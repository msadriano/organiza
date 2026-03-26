"use client";

import { useEffect, useState } from "react";
import { useUpdateManyTasks } from "@/hooks/useTasks";
import { useCachedTaskField } from "@/hooks/useCachedTaskField";
import { useAppStore } from "@/store/useAppStore";
import { Status } from "@/types/filters.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function ChangeTaskStatusDialog() {
  const { selectedTasks, openChangeStatusDialog, setOpenChangeStatusDialog } =
    useAppStore();
  const { mutate: updateManyTasks, isPending, isError } = useUpdateManyTasks();

  const initialStatus = useCachedTaskField(
    openChangeStatusDialog,
    (task) => task.status,
  );

  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  useEffect(() => {
    setSelectedStatus(initialStatus);
  }, [initialStatus]);

  const handleOpenChange = (open: boolean) => {
    setOpenChangeStatusDialog(open);

    if (!open) {
      setSelectedStatus(null);
    }
  };

  const handleUpdateStatus = () => {
    if (!selectedStatus || selectedTasks.length === 0) return;

    updateManyTasks(
      { ids: selectedTasks, data: { status: selectedStatus } },
      {
        onSuccess: () => {
          setOpenChangeStatusDialog(false);
          setSelectedStatus(null);
        },
      },
    );
  };

  return (
    <Dialog open={openChangeStatusDialog} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Alterar Status</DialogTitle>
          <DialogDescription className="text-sm">
            {selectedTasks.length === 1
              ? "Altere o status da tarefa selecionada"
              : "Altere o status das tarefas selecionadas"}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          {isError && (
            <div className="mb-4 rounded bg-red-50 p-2 text-xs text-red-500">
              Erro ao alterar status. Tente novamente.
            </div>
          )}
          <RadioGroup
            value={selectedStatus ?? ""}
            onValueChange={(value) => setSelectedStatus(value as Status)}
            className="gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="TODO" id="global-status-todo" />
              <Label
                htmlFor="global-status-todo"
                className="cursor-pointer text-xs"
              >
                A fazer
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="IN_PROGRESS"
                id="global-status-in-progress"
              />
              <Label
                htmlFor="global-status-in-progress"
                className="cursor-pointer text-xs"
              >
                Em andamento
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="DONE" id="global-status-done" />
              <Label
                htmlFor="global-status-done"
                className="cursor-pointer text-xs"
              >
                Concluida
              </Label>
            </div>
          </RadioGroup>
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
            onClick={handleUpdateStatus}
            disabled={!selectedStatus || isPending}
          >
            {isPending ? "Alterando..." : "Alterar Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
