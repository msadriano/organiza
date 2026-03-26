import { useAppStore } from "@/store/useAppStore";
import { TaskWhereFilters } from "@/types/filters.types";

export const useTaskWhereFilters = () => {
  const { searchWhereFilter, priorityWhereFilter, statusWhereFilter } =
    useAppStore();

  const queryParams: TaskWhereFilters = {
    ...(searchWhereFilter.trim() !== "" && { title: searchWhereFilter }),
    ...(searchWhereFilter.trim() !== "" && { description: searchWhereFilter }),
    ...(priorityWhereFilter && { priority: priorityWhereFilter }),
    ...(statusWhereFilter && { status: statusWhereFilter }),
  };

  return { queryParams };
};
