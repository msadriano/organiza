"use client";

import { useAppStore } from "@/store/useAppStore";
import TaskActions from "./TaskActions";

export default function TaskActionsWrapper() {
  const { selectedTasks } = useAppStore();

  return <>{selectedTasks.length > 0 && <TaskActions />}</>;
}
