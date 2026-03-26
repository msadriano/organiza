"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateList } from "@/hooks/useLists";
import { useState } from "react";

export default function CreateListDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const { mutate: createList, isPending } = useCreateList();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 shrink-0 hover:bg-sidebar-accent cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Adicionar nova lista
          </DialogTitle>
          <DialogDescription className="text-xs">
            Adicione uma nova lista para agrupar suas tarefas
          </DialogDescription>
        </DialogHeader>
        <Field>
          <Label>Nome</Label>
          <Input
            placeholder="Ex: Compras da semana, Trabalho..."
            className="text-xs placeholder:text-xs"
            name="listName"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-sidebar-border">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() =>
              createList(
                { title },
                {
                  onSuccess: () => {
                    setOpen(false);
                    setTitle("");
                  },
                },
              )
            }
            disabled={isPending}
          >
            {isPending ? "Salvando..." : "Salvar Lista"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
