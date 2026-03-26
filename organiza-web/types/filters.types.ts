export type ButtonGroupBy = "none" | "status" | "priority" | "list";

export type ButtonOrderBy = "dueDate" | "priority" | "status";

export type ActiveView = "list" | "kanban" | "calendar";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | null;

export type Status = "TODO" | "IN_PROGRESS" | "DONE" | null;

export interface TaskWhereFilters {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
}
