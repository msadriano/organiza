export interface Task {
  id: string;
  listId: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface TaskOverview {
  tasks: Task[];
  count: number;
}

export interface IaTask {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
}

export type Priority = "LOW" | "MEDIUM" | "HIGH" | null;

export type Status = "TODO" | "IN_PROGRESS" | "DONE" | null;
