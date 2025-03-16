'use client';

import * as z from 'zod';
import { Task } from '~/types/kanban';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/ui/components/dialog';

import { AutoForm } from '~/ui/forms/AutoForm/AutoForm';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  initialData?: Task;
  mode: 'create' | 'edit';
}

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.string(),
  column: z.enum(['Todo', 'In Progress', 'Review', 'Done'])
});

export const TaskForm = ({ isOpen, onClose, onSubmit, initialData, mode }: TaskFormProps) => {
  const fieldConfig = {
    title: {
      fieldType: "input" as const,
      inputProps: {
        label: "Title",
        placeholder: "Enter task title"
      }
    },
    description: {
      fieldType: "textarea" as const,
      inputProps: {
        label: "Description",
        placeholder: "Enter task description",
        rows: 3
      }
    },
    priority: {
      fieldType: "input" as const,
      inputProps: {
        label: "Priority",
        type: "text",
        placeholder: "Low, Medium, or High"
      }
    },
    dueDate: {
      fieldType: "input" as const,
      inputProps: {
        label: "Due Date",
        type: "date"
      }
    },
    column: {
      fieldType: "input" as const,
      inputProps: {
        label: "Status",
        type: "text",
        placeholder: "Todo, In Progress, Review, or Done"
      }
    }
  };

  const handleSubmit = (data: z.infer<typeof taskSchema>) => {
    // Add default empty arrays for assignees and tags since they're not in the form
    onSubmit({
      ...data,
      assignees: initialData?.assignees || [],
      tags: initialData?.tags || []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        <AutoForm
          schema={taskSchema}
          fieldConfig={fieldConfig}
          onSubmitProps={handleSubmit}
          initValues={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}; 