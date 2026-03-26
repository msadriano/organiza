import { useGetLists } from "@/hooks/useLists";
import { useGetTasksByListId, useGetTasksByUserId } from "@/hooks/useTasks";
import { useTaskWhereFilters } from "@/hooks/useTaskWhereFilters";
import { useAppStore } from "@/store/useAppStore";
import { Task } from "@/types/task.type";

export interface TaskToDisplay extends Omit<Task, "createdAt" | "updatedAt"> {
  statusLabel?: string;
  statusColor?: string;
  priorityLabel?: string;
  priorityColor?: string;
  titleLabel: string;
}

export function useCardsView(groupValue?: string) {
  const { groupBy, orderBy, selectedList, selectedTasks, setSelectedTasks } =
    useAppStore();
  const { queryParams } = useTaskWhereFilters();

  const isAllTasks = selectedList === "all-tasks";

  const allTasksQuery = useGetTasksByUserId(queryParams, {
    enabled: isAllTasks,
  });
  const listIdTasksQuery = useGetTasksByListId(selectedList, queryParams, {
    enabled: !isAllTasks,
  });

  const dataTasks = isAllTasks ? allTasksQuery.data : listIdTasksQuery.data;

  const isLoadingTask = isAllTasks
    ? allTasksQuery.isLoading
    : listIdTasksQuery.isLoading;

  const isErrorTask = isAllTasks
    ? allTasksQuery.isError
    : listIdTasksQuery.isError;

  const {
    data: dataLists,
    isLoading: isLoadingList,
    isError: isErrorList,
  } = useGetLists();

  const listMapper = (listId: string) => {
    return (
      dataLists?.find((list) => list.id === listId)?.title ?? "Lista sem nome"
    );
  };

  const statusMapper = {
    DONE: "Concluído",
    TODO: "A Fazer",
    IN_PROGRESS: "Em andamento",
  };

  const statusColorMap = {
    DONE: "bg-emerald-300 border border-emerald-400 text-emerald-800 dark:bg-emerald-300/15 dark:border-emerald-400/30 dark:text-emerald-600",
    TODO: "bg-amber-200 border border-amber-300 text-amber-600 dark:bg-amber-800/20 dark:border-amber-800/45 dark:text-amber-500",
    IN_PROGRESS:
      "bg-blue-200 border border-blue-300 text-blue-700 dark:bg-blue-800/20 dark:border-blue-800/45 dark:text-blue-500",
  };

  const priorityMapper = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
  };
  const priorityColorMap = {
    LOW: "bg-teal-200 border border-teal-300 text-teal-600 dark:bg-teal-300/15 dark:border-teal-400/30 dark:text-teal-600",
    MEDIUM: "bg-indigo-200 border border-indigo-300 text-indigo-600 dark:bg-mauve-600/25 dark:border-mauve-600/30 dark:text-mauve-500",
    HIGH: "bg-rose-200 border border-rose-300 text-rose-700 dark:bg-rose-800/15 dark:border-rose-600/20 dark:text-rose-400/45",
  };

  const newDataTasks = dataTasks?.map((task) => {
    return {
      ...task,
      statusLabel: statusMapper[task.status],
      priorityLabel: priorityMapper[task.priority],
      titleLabel: listMapper(task.listId),
      statusColor: statusColorMap[task.status],
      priorityColor: priorityColorMap[task.priority],
    };
  });

  const taskToDisplay: TaskToDisplay[] = (newDataTasks ?? []).filter((task) => {
    if (groupBy === "none" || !groupValue) return true;

    const values = {
      status: task.status,
      priority: task.priority,
      list: task.listId,
    };

    return values[groupBy] === groupValue;
  });

  const sortedTasks = [...taskToDisplay].sort((a, b) => {
    if (orderBy === "status") {
      const statusOrder = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    if (orderBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (orderBy === "priority") {
      const priorityOrder = { LOW: 2, MEDIUM: 1, HIGH: 0 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return 0;
  });

  return {
    dataTasks,
    isLoadingTask,
    isLoadingList,
    isErrorTask,
    isErrorList,
    sortedTasks,
    groupBy,
    selectedTasks,
    setSelectedTasks,
  };
}
