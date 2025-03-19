"use client";

import { useState } from "react";
import type { Task } from "~/types/kanban";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/ui/components/dialog";
import { Button } from "~/ui/components/button";
import { Badge } from "~/ui/components/badge";
import { TaskForm } from "./TaskForm";
import { CalendarIcon, TagIcon, UserIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/components/avatar";
import { PenBox } from "lucide-react";

interface TaskDetailViewProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onDelete: () => void;
  setEditingTask: (data: any) => void;
}

export const TaskDetailView = ({
  task,
  open,
  onClose,
  onSave,
  onDelete,
  setEditingTask,
}: TaskDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!task) return null;

  const priorityVariants: Record<
    Task["priority"],
    "secondary" | "default" | "destructive"
  > = {
    Low: "secondary",
    Medium: "default",
    High: "destructive",
  };

  const handleSubmit = (updatedTaskData: Omit<Task, "id">) => {
    const updatedTask = {
      ...updatedTaskData,
      id: task.id,
    } as Task;

    onSave(updatedTask);
    setIsEditing(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Todo":
        return "Todo";
      case "in-progress":
        return "In Progress";
      case "review":
        return "Review";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto p-0 sm:max-w-xl">
          <div className="sticky top-0 z-10 border-b bg-white">
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="line-clamp-2 text-2xl font-bold text-gray-900">
                  {task.title}
                </DialogTitle>
                {/* <Button
                  onClick={() => {
                    setEditingTask(task);
                    setIsEditing(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 hover:bg-gray-100"
                >
                  <PenBox className="h-4 w-4" />
                  Edit
                </Button> */}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {getStatusDisplay(task.column)}
                </Badge>
                <Badge
                  variant={priorityVariants[task.priority]}
                  className="text-sm"
                >
                  {task.priority} Priority
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <div className="space-y-6 p-6 pt-4">
            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TagIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="transition-colors hover:bg-opacity-20"
                      style={{
                        backgroundColor: tag.color + "20",
                        color: tag.color,
                        borderColor: tag.color + "40",
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Description
              </h3>
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                {task.description ? (
                  <p className="whitespace-pre-wrap">{task.description}</p>
                ) : (
                  <p className="italic text-gray-400">
                    No description provided.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Due Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">
                    Due Date
                  </h3>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <span className="text-sm text-gray-600">
                    {format(new Date(task.dueDate), "PPP")}
                  </span>
                </div>
              </div>

              {/* Assignees */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">
                    Assignees
                  </h3>
                </div>
                <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3">
                  {task.assignees.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 rounded-full border bg-white px-2 py-1"
                    >
                      <Avatar
                        className="h-6 w-6 border border-white"
                        title={user.name}
                      >
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-xs font-medium">{user.name}</span>
                    </div>
                  ))}

                  {task.assignees.length === 0 && (
                    <span className="text-xs text-gray-400">No assignees</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 flex items-center justify-between border-t bg-gray-50 p-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="flex items-center gap-1.5 hover:bg-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Delete Task
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Form Dialog */}
      <TaskForm
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        initialData={{
          ...task,
          column: getStatusDisplay(task.column) as
            | "Todo"
            | "In Progress"
            | "Review"
            | "Done",
        }}
        mode="edit"
      />
    </>
  );
};
