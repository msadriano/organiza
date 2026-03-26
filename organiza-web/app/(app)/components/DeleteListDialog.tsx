"use client";

import { useDeleteList } from "@/hooks/useLists";
import { useAppStore } from "@/store/useAppStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteListDialogProps {
  list: string;
  title: string;
}

export default function DeleteListDialog({
  list,
  title,
}: DeleteListDialogProps) {
  const { openDeleteList, setOpenDeleteList } = useAppStore();
  const { mutate: deleteList, isError, isPending } = useDeleteList();

  return (
    <AlertDialog open={openDeleteList} onOpenChange={setOpenDeleteList}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apagar Lista</AlertDialogTitle>
          <AlertDialogDescription>
            {isError ? (
              <span>Erro ao apagar a lista</span>
            ) : (
              <>
                <span>Você tem certeza que deseja apagar a lista </span>
                <span className="font-bold">{title}</span>
                <span> e todas as suas tarefas?</span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-sidebar-border">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              deleteList(list, {
                onSuccess: () => {
                  setOpenDeleteList(false);
                },
              });
            }}
          >
            {isPending ? "Apagando Lista..." : "Apagar Lista"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
