export type Priority = 'Low' | 'Medium' | 'High';

export type Column = 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  assignees: User[];
  tags: Tag[];
  column: Column;
}

export interface KanbanColumn {
  id: Column;
  title: string;
  tasks: Task[];
} 