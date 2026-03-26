import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { Task } from "@/types/task.type";
import { TaskWhereFilters, Priority, Status } from "@/types/filters.types";

interface UpdateTasksTypes {
  id: string;
  dataTask: Partial<Task>;
}

interface UpdateManyTasksTypes {
  ids: string[];
  data: { priority?: Priority; status?: Status; dueDate?: Date };
}

type TaskRaw = Omit<Task, "dueDate" | "createdAt" | "updatedAt"> & {
  dueDate: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string | null;
};

const toDate = (value: Date | string | null | undefined) => {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
};

const parseTaskDates = (task: TaskRaw): Task => ({
  ...task,
  dueDate: toDate(task.dueDate),
  createdAt: toDate(task.createdAt) ?? new Date(0),
  updatedAt: toDate(task.updatedAt),
});

export function useGetTasksByListId(
  id: string,
  queryParams: TaskWhereFilters,
  option?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["tasks", id, queryParams],
    queryFn: () => taskService.getTaskByListId(id, queryParams),
    select: (data) => data.map((task) => parseTaskDates(task)),
    enabled: option?.enabled,
  });
}

export function useGetTasksByUserId(
  queryParams: TaskWhereFilters,
  option?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["tasks", queryParams],
    queryFn: () => taskService.getTaskByUserId(queryParams),
    select: (data) => data.map((task) => parseTaskDates(task)),
    enabled: option?.enabled,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string[]) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dataTask }: UpdateTasksTypes) =>
      taskService.updateTask(id, dataTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateManyTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, data }: UpdateManyTasksTypes) =>
      taskService.updateManyTasks(ids, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
