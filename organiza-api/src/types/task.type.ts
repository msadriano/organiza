export interface Task {
  id: string;
  listId: string;
  title: string;
  description: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}
