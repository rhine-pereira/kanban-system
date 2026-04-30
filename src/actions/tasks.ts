"use server";

import { db } from "@/db";
import { tasks, activityLogs } from "@/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  dueDate: z.string().optional().nullable(),
  assignedToId: z.string().uuid().optional().nullable(),
});

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = Object.fromEntries(formData.entries());
  const validated = TaskSchema.safeParse(data);

  if (!validated.success) return { error: "Invalid fields" };

  // Get max position for the status
  const [maxPos] = await db
    .select({ max: sql<number>`max(${tasks.position})` })
    .from(tasks)
    .where(and(eq(tasks.status, validated.data.status), eq(tasks.createdById, session.user.id)));

  const position = (maxPos?.max ?? 0) + 1000;

  const [newTask] = await db.insert(tasks).values({
    ...validated.data,
    dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
    position,
    createdById: session.user.id,
  }).returning();

  await db.insert(activityLogs).values({
    taskId: newTask.id,
    userId: session.user.id,
    action: "created",
    details: { title: newTask.title },
  });

  revalidatePath("/board");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTask(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = Object.fromEntries(formData.entries());
  const validated = TaskSchema.safeParse(data);

  if (!validated.success) return { error: "Invalid fields" };

  const [updatedTask] = await db
    .update(tasks)
    .set({
      ...validated.data,
      dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, id), eq(tasks.createdById, session.user.id)))
    .returning();

  await db.insert(activityLogs).values({
    taskId: updatedTask.id,
    userId: session.user.id,
    action: "edited",
    details: { title: updatedTask.title },
  });

  revalidatePath("/board");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTask(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [deletedTask] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.createdById, session.user.id)))
    .returning();

  await db.insert(activityLogs).values({
    userId: session.user.id,
    action: "deleted",
    details: { title: deletedTask.title },
  });

  revalidatePath("/board");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function moveTask(
  taskId: string,
  newStatus: "todo" | "in_progress" | "done",
  newPosition: number
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [updatedTask] = await db
    .update(tasks)
    .set({
      status: newStatus,
      position: newPosition,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.createdById, session.user.id)))
    .returning();

  await db.insert(activityLogs).values({
    taskId: updatedTask.id,
    userId: session.user.id,
    action: "moved",
    details: { status: newStatus, position: newPosition },
  });

  revalidatePath("/board");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.query.tasks.findMany({
    where: eq(tasks.createdById, session.user.id),
    with: {
      assignee: true,
      creator: true,
    },
    orderBy: [asc(tasks.position)],
  });
}
