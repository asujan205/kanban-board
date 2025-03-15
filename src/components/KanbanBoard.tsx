'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn, Task } from '~/types/kanban';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Button } from '~/ui/components/button';
import { PlusIcon } from '@heroicons/react/24/outline';

const initialColumns: KanbanColumn[] = [
  { 
    id: 'Todo', 
    title: 'To Do', 
    tasks: [
      {
        id: '1',
        title: 'Implement Authentication',
        description: 'Add user authentication using NextAuth.js',
        priority: 'High',
        dueDate: '2024-04-15',
        assignees: [
          { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' }
        ],
        tags: [
          { id: '1', name: 'Feature', color: '#0ea5e9' },
          { id: '2', name: 'Security', color: '#ef4444' }
        ],
        column: 'Todo'
      },
      {
        id: '2',
        title: 'Design System Setup',
        description: 'Create reusable components and style guide',
        priority: 'Medium',
        dueDate: '2024-04-20',
        assignees: [
          { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' }
        ],
        tags: [
          { id: '3', name: 'UI', color: '#8b5cf6' }
        ],
        column: 'Todo'
      }
    ]
  },
  { 
    id: 'In Progress', 
    title: 'In Progress', 
    tasks: [
      {
        id: '3',
        title: 'API Integration',
        description: 'Connect frontend with backend API endpoints',
        priority: 'High',
        dueDate: '2024-04-10',
        assignees: [
          { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
          { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' }
        ],
        tags: [
          { id: '4', name: 'Backend', color: '#84cc16' },
          { id: '5', name: 'Integration', color: '#f59e0b' }
        ],
        column: 'In Progress'
      }
    ]
  },
  { 
    id: 'Review', 
    title: 'Review', 
    tasks: [
      {
        id: '4',
        title: 'Performance Optimization',
        description: 'Optimize app performance and loading times',
        priority: 'Medium',
        dueDate: '2024-04-12',
        assignees: [
          { id: '4', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=4' }
        ],
        tags: [
          { id: '6', name: 'Performance', color: '#ec4899' }
        ],
        column: 'Review'
      }
    ]
  },
  { 
    id: 'Done', 
    title: 'Done', 
    tasks: [
      {
        id: '5',
        title: 'Project Setup',
        description: 'Initialize project and set up development environment',
        priority: 'Low',
        dueDate: '2024-04-05',
        assignees: [
          { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' }
        ],
        tags: [
          { id: '7', name: 'Setup', color: '#64748b' }
        ],
        column: 'Done'
      }
    ]
  }
];

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
    };

    const newColumns = columns.map(col => {
      if (col.id === taskData.column) {
        return {
          ...col,
          tasks: [...col.tasks, newTask],
        };
      }
      return col;
    });

    setColumns(newColumns);
  };

  const handleEditTask = (taskData: Omit<Task, 'id'>) => {
    if (!editingTask) return;

    const newColumns = columns.map(col => ({
      ...col,
      tasks: col.tasks.map(task =>
        task.id === editingTask.id
          ? { ...taskData, id: task.id }
          : task
      ),
    }));

    setColumns(newColumns);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const newColumns = columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(task => task.id !== taskId),
    }));

    setColumns(newColumns);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const column = columns.find((col) => col.id === source.droppableId);
      if (!column) return;

      const newTasks = Array.from(column.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      if (!removed) return;
      newTasks.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) =>
        col.id === source.droppableId ? { ...col, tasks: newTasks } : col
      );

      setColumns(newColumns);
    } else {
      // Move between columns
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find((col) => col.id === destination.droppableId);
      if (!sourceColumn || !destColumn) return;

      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      if (!removed) return;
      
      const updatedTask: Task = {
        ...removed,
        column: destination.droppableId as Task['column']
      };
      
      destTasks.splice(destination.index, 0, updatedTask);

      const newColumns = columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setColumns(newColumns);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsTaskFormOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-4 h-full overflow-x-auto">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
            >
              <h2 className="font-bold text-xl mb-4">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {column.tasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        onEdit={() => {
                          setEditingTask(task);
                          setIsTaskFormOpen(true);
                        }}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        initialData={editingTask || undefined}
        mode={editingTask ? 'edit' : 'create'}
      />
    </div>
  );
}; 