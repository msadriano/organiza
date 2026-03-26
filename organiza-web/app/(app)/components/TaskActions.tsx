"use client";

import Link from "next/link";
import { Trash2, FileInput, ListChecks, Flag, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
export default function TaskActions() {
  const isMobile = useIsMobile();
  const {
    selectedTasks,
    setOpenDeleteTask,
    setOpenChangeStatusDialog,
    setOpenChangeDueDateDialog,
    setOpenChangePriorityDialog,
    clearSelectedTasks,
  } = useAppStore();

  return (
    <div className="p-3 bg-primary rounded-md text-surface text-xs flex flex-col  md:flex-row md:items-center shadow">
      <div
        className={cn(
          "flex flex-row items-center justify-between text-white",
          isMobile
            ? "border-b border-foreground/20 pb-3"
            : "border-r border-surface/50 pr-4",
        )}
      >
        <span>
          {selectedTasks && selectedTasks.length > 1
            ? `${selectedTasks.length} tarefas selecionadas`
            : "1 tarefa selecionada"}
        </span>
        {isMobile && (
          <Link
            href="#"
            onClick={() => clearSelectedTasks()}
            className="flex flex-row gap-1 items-center hover:bg-surface/20 cursor-pointer px-2 py-1.5 rounded-md"
          >
            <X size={12} />
            Cancelar seleção
          </Link>
        )}
      </div>

      <div
        className={cn(
          "flex flex-row flex-1 items-center",
          isMobile ? "pt-3" : "pl-3",
        )}
      >
        <div className="flex flex-1 flex-row gap-1 items-center justify-evenly md:justify-start text-white">
          <Link
            href="#"
            onClick={() => setOpenDeleteTask(true)}
            className="flex flex-row gap-1 items-center hover:bg-surface/20 cursor-pointer px-2 py-1.5 rounded-md"
          >
            <Trash2 size={12} />
            Apagar tarefas
          </Link>
          

          <Link
            href="#"
            onClick={() => setOpenChangeDueDateDialog(true)}
            className="flex flex-row gap-1 items-center hover:bg-surface/20 cursor-pointer px-2 py-1.5 rounded-md"
          >
            <FileInput size={12} />
            Alterar data de vencimento
          </Link>
          <Link
            href="#"
            onClick={() => setOpenChangeStatusDialog(true)}
            className="flex flex-row gap-1 items-center hover:bg-surface/20 cursor-pointer px-2 py-1.5 rounded-md"
          >
            <ListChecks size={12} />
            Alterar status
          </Link>

          <Link
            href="#"
            onClick={() => setOpenChangePriorityDialog(true)}
            className="flex flex-row gap-1 items-center hover:bg-surface/20 cursor-pointer px-2 py-1.5 rounded-md"
          >
            <Flag size={12} />
            Alterar prioridade
          </Link>
        </div>
        {!isMobile && (
          <Link
            href="#"
            onClick={() => clearSelectedTasks()}
            className="flex flex-row gap-1 items-center hover:bg-surface/20 cursor-pointer px-2 py-1.5 rounded-md"
          >
            <X size={12} />
            Cancelar seleção
          </Link>
        )}
      </div>
    </div>
  );
}
