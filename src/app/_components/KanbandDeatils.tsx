"use client";

import { useState } from "react";
import { Task } from "~/types/kanban";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/ui/components/dialog";
import { Button } from "~/ui/components/button";
import { Separator } from "~/ui/components/divider";
import { Badge } from "~/ui/components/badge";
import { TaskForm } from "./TaskForm";
import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/components/avatar";

interface TaskDetailViewProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onDelete: () => void;
}

export const TaskDetailView = ({
  task,
  open,
  onClose,
  onSave,
  onDelete,
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
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {task.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-100"
                >
                  Edit
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Tags */}
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
                    className="hover:bg-opacity-20"
                    style={{
                      backgroundColor: tag.color + "20",
                      color: tag.color,
                      borderColor: tag.color + "40",
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {task.tags.length === 0 && (
                  <span className="text-xs text-gray-400">No tags</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Description
              </h3>
              <p className="whitespace-pre-wrap text-sm text-gray-600">
                {task.description || "No description provided."}
              </p>
            </div>

            <Separator className="my-4" />

            {/* Priority */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Priority</h3>
              <Badge
                variant={priorityVariants[task.priority]}
                className="text-sm"
              >
                {task.priority}
              </Badge>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">
                  Due Date
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-500" />
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
              <div className="flex flex-wrap gap-2">
                {task.assignees.map((user) => (
                  <Avatar
                    key={user.id}
                    className="h-8 w-8 border-2 border-white hover:border-gray-200"
                    title={user.name}
                  >
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                ))}

                {task.assignees.length === 0 && (
                  <span className="text-xs text-gray-400">No assignees</span>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Status</h3>
              <Badge variant="outline" className="text-sm">
                {getStatusDisplay(task.column)}
              </Badge>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="hover:bg-red-600"
            >
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
        onClose={() => setIsEditing(false)}
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
