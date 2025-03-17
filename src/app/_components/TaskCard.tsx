'use client';

import { Task } from '~/types/kanban';
import { format } from 'date-fns';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from '~/ui/components/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard = ({ task, index, onEdit, onDelete }: TaskCardProps) => {
  const priorityColors = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow-sm p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow group"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <PencilIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <TrashIcon className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
            <span className="text-xs text-gray-500">
              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          </div>

          <div className="flex -space-x-2">
            {task.assignees.map((user) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                title={user.name}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Draggable>
  );
}; 