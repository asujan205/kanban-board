"use client";

import { Task } from "~/types/kanban";
import { format } from "date-fns";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "~/ui/components/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/ui/components/card";
import { Badge } from "~/ui/components/badge";
import { EllipsisVertical } from "lucide-react";
import { Separator } from "~/ui/components/divider";
import { Popover } from "~/ui/components/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard = ({ task, index, onEdit, onDelete }: TaskCardProps) => {
  const priorityVariants: Record<
    Task["priority"],
    "secondary" | "default" | "destructive"
  > = {
    Low: "secondary",
    Medium: "default",
    High: "destructive",
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group mb-3 cursor-pointer transition-shadow hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2">
                {task.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
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
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-accent"
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-26 border border-border bg-card p-2 shadow-md">
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-2 px-2 hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                        <span className="text-sm">Remove</span>
                      </Button>
                      <Separator className="" />
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-2 px-2 hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit();
                        }}
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="text-sm">Edit</span>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pb-2">
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
            <div className="flex items-center justify-between">
              <Badge variant={priorityVariants[task.priority]}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal">
                Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
              </Badge>
            </div>
          </CardContent>

          <Separator />

          <CardFooter>
            <div className="mt-1 flex -space-x-2">
              {task.assignees.map((user) => (
                <div
                  key={user.id}
                  className="h-8 w-8 overflow-hidden rounded-full border-2 border-card"
                  title={user.name}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-card/20 text-foreground">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      )}
    </Draggable>
  );
};
