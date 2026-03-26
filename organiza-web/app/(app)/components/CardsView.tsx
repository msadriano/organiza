"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionsDropdown from "./ActionsDropdown";
import { useCardsView } from "../hooks/useCardsView";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CardsViewTable from "./CardsViewTable";
import { formatDate } from "@/utils/formatDate";

export default function CardsView({ groupValue }: { groupValue?: string }) {
  const isMobile = useIsMobile();
  const {
    dataTasks,
    isLoadingTask,
    isLoadingList,
    isErrorTask,
    isErrorList,
    sortedTasks,
    groupBy,
    selectedTasks,
    setSelectedTasks,
  } = useCardsView(groupValue);

  if (dataTasks && dataTasks?.length < 1)
    return (
      <p className="flex flex-col items-center justify-center w-full h-full">
        Nenhuma tarefa encontrada!
      </p>
    );

  if (isLoadingTask || isLoadingList)
    return (
      <p className="flex flex-col items-center justify-center w-full h-full">
        Carregando...
      </p>
    );

  if (isErrorTask || isErrorList)
    return (
      <p className="flex flex-col items-center justify-center w-full h-full">
        Erro ao carregar os dados
      </p>
    );

  return (
    <div
      className={cn("flex flex-col gap-4", groupBy !== "none" ? "gap-1" : "")}
    >
      {isMobile ? (
        // Mobile
        sortedTasks.map((task) => (
          <div
            className="card p-3 border border-sidebar-border flex flex-col gap-2"
            key={task.id}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedTasks.includes(task.id)}
                onCheckedChange={() => setSelectedTasks(task.id)}
                className="shrink-0"
              />
              <h6 className="flex-1 truncate">{task.title}</h6>
              <div className="cursor-pointer shrink-0">
                <ActionsDropdown task={task} />
              </div>
            </div>
            <p className="text-xs truncate text-muted-foreground">
              {task.description}
            </p>
            <div className="flex flex-row gap-2 flex-wrap items-center text-xs justify-between">
              <div className="flex flex-row items-center flex-1 gap-2">
                <span className="bg-amber-200 border border-amber-300 px-1.5 py-0.5 rounded-full text-amber-800">
                  {task.priorityLabel}
                </span>
                <span className="bg-zinc-200 border border-zinc-300 px-1.5 py-0.5 rounded-full text-zinc-800">
                  {task.titleLabel}
                </span>
                <span className="bg-amber-200 border border-amber-300 px-1.5 py-0.5 rounded-full text-amber-800">
                  {task.statusLabel}
                </span>
              </div>
              <span className="flex flex-row gap-1 items-center text-xs">
                <Calendar size={12} />
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>
        ))
      ) : (
        // Desktop
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="border-sidebar-border">
              <TableHead className="w-1/40 text-xs">
                <Checkbox className="shrink-0" />
              </TableHead>
              <TableHead className="w-10/40 text-xs">Nome da tarefa</TableHead>
              <TableHead className="w-4/40 text-xs">Lista</TableHead>
              <TableHead className="w-3/40 text-xs">Status</TableHead>
              <TableHead className="w-3/40 text-xs">Prioridade</TableHead>
              <TableHead className="w-4/40 text-xs">
                Data de conclusão
              </TableHead>
              <TableHead className="w-1/40 text-xs">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <CardsViewTable task={task} key={task.id} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
