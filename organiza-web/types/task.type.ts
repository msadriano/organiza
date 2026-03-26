export interface Task {
  id: string;
  listId: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}
