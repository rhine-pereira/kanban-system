import { getTasks } from "@/actions/tasks";
import { KanbanBoard } from "@/components/board/kanban-board";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const tasks = await getTasks();

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Board</h2>
          <p className="text-gray-500 mt-1">Manage and track your team's tasks.</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <KanbanBoard initialTasks={tasks} />
      </div>
    </div>
  );
}
