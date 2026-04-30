"use client";

import { Draggable } from "@hello-pangea/dnd";
import { TaskWithAssignee } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

interface KanbanCardProps {
  task: TaskWithAssignee;
  index: number;
  onClick: () => void;
}

export function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          style={{
            ...provided.draggableProps.style,
          }}
          className={`${snapshot.isDragging ? "z-50" : ""}`}
        >
          <Card className={`hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ? "shadow-lg border-blue-300 ring-2 ring-blue-100" : ""
          }`}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                <Badge className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
              </div>
              
              {task.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-500 border-t border-gray-100 mt-2">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className={new Date(task.dueDate) < new Date() && task.status !== 'done' ? "text-red-500 font-medium" : ""}>
                      {format(new Date(task.dueDate), "MMM d")}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 ml-auto">
                  {task.assignee ? (
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                      <UserIcon className="h-3 w-3" />
                      <span>{task.assignee.name?.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <span className="italic text-gray-400">Unassigned</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
