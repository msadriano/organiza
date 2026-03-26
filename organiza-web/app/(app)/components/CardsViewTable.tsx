import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";
import ActionsDropdown from "./ActionsDropdown";
import { useAppStore } from "@/store/useAppStore";
import { TaskToDisplay } from "../hooks/useCardsView";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

interface CardsViewTableProps {
  task: TaskToDisplay;
}

export default function CardsViewTable({ task }: CardsViewTableProps) {
  const { selectedTasks, setSelectedTasks } = useAppStore();

  return (
    <TableRow className="border-0">
      <TableCell>
        <Checkbox
          checked={selectedTasks.includes(task.id)}
          onCheckedChange={() => setSelectedTasks(task.id)}
          className="shrink-0"
        />
      </TableCell>
      <TableCell>
        <span className="text-xs font-semibold truncate">{task.title}</span>
        {task.description !== null && (
          <span className="text-[11px] truncate">{` - ${task.description}`}</span>
        )}
      </TableCell>
      <TableCell className="text-xs">
        <span className="px-2 py-1 bg-purple-100 border border-purple-200 text-[10px] text-purple-800 rounded-sm dark:bg-fuchsia-800/20 dark:text-white/50 dark:border-white/10">
          {task.titleLabel}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px]",
            task.statusColor,
          )}
        >
          {task.statusLabel}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px]",
            task.priorityColor,
          )}
        >
          {task.priorityLabel}
        </span>
      </TableCell>
      <TableCell className="flex flex-row gap-1.5 text-xs items-center">
        <Calendar size={12} />
        {formatDate(task.dueDate)}
      </TableCell>
      <TableCell className="text-center">
        <ActionsDropdown task={task} />
      </TableCell>
    </TableRow>
  );
}
