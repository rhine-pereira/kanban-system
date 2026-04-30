"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { KanbanColumn } from "./kanban-column";
import { TaskWithAssignee } from "@/types";
import { TaskDialog } from "../task-dialog";
import { moveTask } from "@/actions/tasks";

interface KanbanBoardProps {
  initialTasks: TaskWithAssignee[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const openCreateDialog = () => {
    setSelectedTask(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (task: TaskWithAssignee) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as "todo" | "in_progress" | "done";
    const destColumnTasks = tasks
      .filter((t) => t.status === newStatus)
      .sort((a, b) => a.position - b.position);

    let newPosition: number;

    if (destColumnTasks.length === 0) {
      newPosition = 1000;
    } else if (destination.index === 0) {
      newPosition = destColumnTasks[0].position / 2;
    } else if (destination.index >= destColumnTasks.length) {
      newPosition = destColumnTasks[destColumnTasks.length - 1].position + 1000;
    } else {
      const prevTask = destColumnTasks[destination.index - 1];
      const nextTask = destColumnTasks[destination.index];
      newPosition = (prevTask.position + nextTask.position) / 2;
    }

    // Optimistic update
    const updatedTasks = tasks.map((t) => {
      if (t.id === draggableId) {
        return { ...t, status: newStatus, position: newPosition };
      }
      return t;
    });
    setTasks(updatedTasks);

    try {
      await moveTask(draggableId, newStatus, newPosition);
    } catch (error) {
      console.error(error);
      setTasks(initialTasks); // Rollback
    }
  };

  if (!isMounted) return null;

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 h-full overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((t) => t.status === column.id)}
              onAddTask={openCreateDialog}
              onEditTask={openEditDialog}
            />
          ))}
        </div>
      </DragDropContext>
      
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        task={selectedTask}
      />
    </>
  );
}
