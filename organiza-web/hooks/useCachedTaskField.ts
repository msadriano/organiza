"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task.type";
import { useAppStore } from "@/store/useAppStore";

export function useCachedTaskField<TaskFieldValue>(
  isDialogOpen: boolean,
  fieldSelector: (task: Task) => TaskFieldValue | null | undefined,
): TaskFieldValue | null {
  const queryClient = useQueryClient();
  const { selectedTasks } = useAppStore();
  const fieldSelectorRef = useRef(fieldSelector);
  fieldSelectorRef.current = fieldSelector;

  const [fieldValue, setFieldValue] = useState<TaskFieldValue | null>(null);

  useEffect(() => {
    if (!isDialogOpen) {
      setFieldValue(null);
      return;
    }

    if (selectedTasks.length !== 1) {
      setFieldValue(null);
      return;
    }

    const selectedTaskId = selectedTasks[0];
    const queryEntries = queryClient.getQueriesData<Task[]>({
      queryKey: ["tasks"],
    });
    const cachedTasks = queryEntries.flatMap(([, tasks]) => tasks ?? []);
    const selectedTask = cachedTasks.find((task) => task.id === selectedTaskId);

    setFieldValue(
      selectedTask ? (fieldSelectorRef.current(selectedTask) ?? null) : null,
    );
  }, [isDialogOpen, selectedTasks, queryClient]);

  return fieldValue;
}
