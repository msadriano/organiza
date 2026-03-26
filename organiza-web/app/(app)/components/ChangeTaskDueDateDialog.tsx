"use client";

import { useEffect, useState } from "react";
import { Calendar1Icon } from "lucide-react";
import { useUpdateManyTasks } from "@/hooks/useTasks";
import { useCachedTaskField } from "@/hooks/useCachedTaskField";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function ChangeTaskDueDateDialog() {
  const { selectedTasks, openChangeDueDateDialog, setOpenChangeDueDateDialog } =
    useAppStore();
  const { mutate: updateManyTasks, isPending, isError } = useUpdateManyTasks();

  const initialDueDate = useCachedTaskField(
    openChangeDueDateDialog,
    (task) => task.dueDate,
  );

  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>(null);

  useEffect(() => {
    setSelectedDueDate(initialDueDate ? new Date(initialDueDate) : null);
  }, [initialDueDate]);

  const handleOpenChange = (open: boolean) => {
    setOpenChangeDueDateDialog(open);

    if (!open) {
      setSelectedDueDate(null);
    }
  };

  const handleUpdateDueDate = () => {
    if (!selectedDueDate || selectedTasks.length === 0) return;

    updateManyTasks(
      { ids: selectedTasks, data: { dueDate: selectedDueDate } },
      {
        onSuccess: () => {
          setOpenChangeDueDateDialog(false);
          setSelectedDueDate(null);
        },
      },
    );
  };

  return (
    <Dialog open={openChangeDueDateDialog} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">
            Alterar Data de Vencimento
          </DialogTitle>
          <DialogDescription className="text-sm">
            {selectedTasks.length === 1
              ? "Altere a data de vencimento da tarefa selecionada"
              : "Altere a data de vencimento das tarefas selecionadas"}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          {isError && (
            <div className="mb-4 rounded bg-red-50 p-2 text-xs text-red-500">
              Erro ao alterar data de vencimento. Tente novamente.
            </div>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-between border-sidebar-border text-left text-xs font-normal",
                  !selectedDueDate && "text-muted-foreground",
                )}
              >
                {selectedDueDate
                  ? new Intl.DateTimeFormat("pt-BR").format(selectedDueDate)
                  : "Selecione uma data"}
                <Calendar1Icon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDueDate ?? undefined}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDueDate(date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
          className="border-sidebar-border"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleUpdateDueDate}
            disabled={!selectedDueDate || isPending}
          >
            {isPending ? "Alterando..." : "Alterar Data de Vencimento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
