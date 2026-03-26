"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "@/store/useAppStore";
import { useDeleteTask } from "@/hooks/useTasks";

export default function DeleteTaskDialog() {
  const { openDeleteTask, setOpenDeleteTask, selectedTasks } = useAppStore();
  const {
    mutate: deleteTask,
    isPending: isPendingDelete,
    isError: isErrorDelete,
  } = useDeleteTask();
  return (
    <AlertDialog open={openDeleteTask} onOpenChange={setOpenDeleteTask}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {selectedTasks && selectedTasks.length > 0
              ? "Tem certeza que deseja apagar as tarefas selecionadas?"
              : "Tem certeza que deseja apagar a tarefa selecionada?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isErrorDelete
              ? "Error no processamento."
              : "Esta ação não pode ser desfeita. Os dados serão apagados definitivamente dos nossos servidores."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-sidebar-border">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPendingDelete}
            onClick={(e) => {
              e.preventDefault();
              deleteTask(selectedTasks, {
                onSuccess: () => {
                  setOpenDeleteTask(false);
                },
              });
            }}
          >
            {isPendingDelete ? "Apagando Tarefa(s)" : "Apagar tarefas"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
