"use client";

import { useEffect, useState } from "react";
import { useUpdateManyTasks } from "@/hooks/useTasks";
import { useCachedTaskField } from "@/hooks/useCachedTaskField";
import { useAppStore } from "@/store/useAppStore";
import { Priority } from "@/types/filters.types";
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

export default function ChangeTaskPriorityDialog() {
  const {
    selectedTasks,
    openChangePriorityDialog,
    setOpenChangePriorityDialog,
  } = useAppStore();
  const { mutate: updateManyTasks, isPending, isError } = useUpdateManyTasks();

  const initialPriority = useCachedTaskField(
    openChangePriorityDialog,
    (task) => task.priority,
  );

  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(
    null,
  );

  useEffect(() => {
    setSelectedPriority(initialPriority);
  }, [initialPriority]);

  const handleOpenChange = (open: boolean) => {
    setOpenChangePriorityDialog(open);

    if (!open) {
      setSelectedPriority(null);
    }
  };

  const handleUpdatePriority = () => {
    if (!selectedPriority || selectedTasks.length === 0) return;

    updateManyTasks(
      { ids: selectedTasks, data: { priority: selectedPriority } },
      {
        onSuccess: () => {
          setOpenChangePriorityDialog(false);
          setSelectedPriority(null);
        },
      },
    );
  };

  return (
    <Dialog open={openChangePriorityDialog} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Alterar Prioridade</DialogTitle>
          <DialogDescription className="text-sm">
            {selectedTasks.length === 1
              ? "Altere a prioridade da tarefa selecionada"
              : `Altere a prioridade de ${selectedTasks.length} tarefas selecionadas`}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          {isError && (
            <div className="mb-4 rounded bg-red-50 p-2 text-xs text-red-500">
              Erro ao alterar prioridade. Tente novamente.
            </div>
          )}
          <RadioGroup
            value={selectedPriority ?? ""}
            onValueChange={(value) => setSelectedPriority(value as Priority)}
            className="gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="LOW" id="global-priority-low" />
              <Label
                htmlFor="global-priority-low"
                className="cursor-pointer text-xs"
              >
                Baixa
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="MEDIUM" id="global-priority-medium" />
              <Label
                htmlFor="global-priority-medium"
                className="cursor-pointer text-xs"
              >
                Media
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="HIGH" id="global-priority-high" />
              <Label
                htmlFor="global-priority-high"
                className="cursor-pointer text-xs"
              >
                Alta
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
            onClick={handleUpdatePriority}
            disabled={!selectedPriority || isPending}
          >
            {isPending ? "Alterando..." : "Alterar Prioridade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
