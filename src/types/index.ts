import { tasks, users } from "@/db/schema";

export type Task = typeof tasks.$inferSelect;
export type User = typeof users.$inferSelect;

export type TaskWithAssignee = Task & {
  assignee: User | null;
  creator: User;
};
