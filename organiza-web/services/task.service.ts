import { api } from "@/lib/axios";
import { TaskWhereFilters } from "@/types/filters.types";
import { Priority, Status } from "@/types/filters.types";
import { Task } from "@/types/task.type";

export const taskService = {
  getTaskByUserId: async (queryParams: TaskWhereFilters) => {
    const { data } = await api.get<Task[]>("/api/tasks", {
      params: queryParams,
    });

    return data;
  },

  getTaskByListId: async (id: string, queryParams: TaskWhereFilters) => {
    const { data } = await api.get<Task[]>(`/api/tasks/${id}`, {
      params: queryParams,
    });

    return data;
  },

  createTask: async (dataTask: Partial<Task>) => {
    const { data } = await api.post<Task>("/api/tasks", dataTask);

    return data;
  },

  updateTask: async (id: string, dataTask: Partial<Task>) => {
    const { data } = await api.put<Task>(`/api/tasks/${id}`, dataTask);

    return data;
  },

  updateManyTasks: async (
    ids: string[],
    updateData: { priority?: Priority; status?: Status; dueDate?: Date },
  ) => {
    const { data } = await api.patch<{ count: number }>("/api/tasks", {
      ids,
      ...updateData,
    });

    return data;
  },

  deleteTask: async (id: string[]) => {
    const { data } = await api.delete<Task | number>(`/api/tasks`, {
      data: { id },
    });

    return data;
  },
};
