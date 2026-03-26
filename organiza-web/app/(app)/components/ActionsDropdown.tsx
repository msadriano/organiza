import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/useAppStore";
import {
  ArrowUpWideNarrow,
  CircleAlertIcon,
  MoreVertical,
  PencilIcon,
  TrashIcon,
  Calendar,
} from "lucide-react";
import { TaskToDisplay } from "../hooks/useCardsView";


interface ActionsDropDownProps {
  task: TaskToDisplay;
}

export default function ActionsDropdown({ task }: ActionsDropDownProps) {
  const {
    setSelectedTaskIds,
    setOpenChangeDueDateDialog,
    setOpenEditTaskSheet,
    setOpenChangeStatusDialog,
    setOpenChangePriorityDialog,
    setOpenDeleteTask,
  } = useAppStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer shrink-0">
        <MoreVertical size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-70">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setSelectedTaskIds([task.id]);
            setOpenEditTaskSheet(true);
          }}
        >
          <PencilIcon /> Editar tarefa
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setSelectedTaskIds([task.id]);
            setOpenChangeDueDateDialog(true);
          }}
        >
          <Calendar />
          Alterar data de vencimento
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setSelectedTaskIds([task.id]);
            setOpenChangeStatusDialog(true);
          }}
        >
          <ArrowUpWideNarrow /> Alterar status
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setSelectedTaskIds([task.id]);
            setOpenChangePriorityDialog(true);
          }}
        >
          <CircleAlertIcon />
          Alterar prioridade
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-200" />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={() => {
            setSelectedTaskIds([task.id]);
            setOpenDeleteTask(true);
          }}
        >
          <TrashIcon />
          Apagar tarefa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
