import ListView from "./components/ListView";
import TaskActionsWrapper from "./components/TaskActionsWrapper";

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 bg-background md:py-6 md:px-8 space-y-4">
      <TaskActionsWrapper />
      <ListView />
    </div>
  );
}
