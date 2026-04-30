"use server";

import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getActivityLogs() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.query.activityLogs.findMany({
    with: {
      user: true,
      task: true,
    },
    orderBy: [desc(activityLogs.createdAt)],
    limit: 20,
  });
}

export async function getTaskStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const allTasks = await db.query.tasks.findMany();

  const stats = {
    total: allTasks.length,
    todo: allTasks.filter((t) => t.status === "todo").length,
    inProgress: allTasks.filter((t) => t.status === "in_progress").length,
    done: allTasks.filter((t) => t.status === "done").length,
    highPriority: allTasks.filter((t) => t.priority === "high").length,
  };

  return stats;
}
