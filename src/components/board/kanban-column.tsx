"use client";

import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./kanban-card";
import { TaskWithAssignee } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: TaskWithAssignee[];
  onAddTask: () => void;
  onEditTask: (task: TaskWithAssignee) => void;
}

export function KanbanColumn({ id, title, tasks, onAddTask, onEditTask }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-full min-w-[300px] bg-gray-50 rounded-lg p-4 border border-gray-200 h-full max-h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">
          {title} <span className="ml-2 text-sm text-gray-500 font-normal">{tasks.length}</span>
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 overflow-y-auto space-y-3 min-h-[100px] rounded-md transition-colors ${
              snapshot.isDraggingOver ? "bg-gray-100/50" : ""
            }`}
          >
            {tasks
              .sort((a, b) => a.position - b.position)
              .map((task, index) => (
                <KanbanCard 
                  key={task.id} 
                  task={task} 
                  index={index} 
                  onClick={() => onEditTask(task)}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
