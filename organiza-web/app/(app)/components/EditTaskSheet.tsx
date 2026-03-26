"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CalendarIcon, TrashIcon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useDeleteTask, useUpdateTask } from "@/hooks/useTasks";
import { useGetLists } from "@/hooks/useLists";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = z.object({
  title: z.string().min(1, "Informe o nome da tarefa"),
  description: z.string().optional(),
  listId: z.string().min(1, "Selecione uma lista"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  dueDate: z.date().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CachedTask = {
  id: string;
  title: string;
  description?: string;
  listId: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: Date | string | null;
};

const normalizeDate = (value: Date | string | null | undefined) => {
  if (!value) return null;
  const parsedDate = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export default function EditTaskSheet() {
  const queryClient = useQueryClient();
  const {
    selectedTasks,
    openEditTaskSheet,
    setOpenEditTaskSheet,
    setOpenDeleteTask,
  } = useAppStore();

  const { data: lists = [], isLoading: isLoadingLists } = useGetLists();
  const {
    mutate: updateTask,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
  } = useUpdateTask();
  const {
    mutate: deleteTask,
    isPending: isPendingDelete,
    isError: isErrorDelete,
  } = useDeleteTask();

  const selectedTaskId = selectedTasks.length === 1 ? selectedTasks[0] : null;

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;

    const queryEntries = queryClient.getQueriesData<CachedTask[]>({
      queryKey: ["tasks"],
    });
    const cachedTasks = queryEntries.flatMap(([, tasks]) => tasks ?? []);

    return cachedTasks.find((task) => task.id === selectedTaskId) ?? null;
  }, [queryClient, selectedTaskId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      listId: "",
      priority: "LOW",
      status: "TODO",
      dueDate: null,
    },
  });

  useEffect(() => {
    if (!openEditTaskSheet || !selectedTask) return;

    form.reset({
      title: selectedTask.title,
      description: selectedTask.description ?? "",
      listId: selectedTask.listId,
      priority: selectedTask.priority,
      status: selectedTask.status,
      dueDate: normalizeDate(selectedTask.dueDate),
    });
  }, [form, openEditTaskSheet, selectedTask]);

  const handleOpenChange = (open: boolean) => {
    setOpenEditTaskSheet(open);
    if (!open) {
      form.reset();
    }
  };

  const onSubmit = (formData: FormValues) => {
    if (!selectedTaskId) return;

    updateTask(
      {
        id: selectedTaskId,
        dataTask: {
          title: formData.title,
          description: formData.description,
          listId: formData.listId,
          priority: formData.priority,
          status: formData.status,
          dueDate: formData.dueDate ?? undefined,
        },
      },
      {
        onSuccess: () => {
          setOpenEditTaskSheet(false);
          form.reset();
        },
      },
    );
  };

  const handleDeleteTask = () => {
    if (!selectedTaskId) return;

    deleteTask([selectedTaskId], {
      onSuccess: () => {
        setOpenEditTaskSheet(false);
        setOpenDeleteTask(false);
        form.reset();
      },
    });
  };

  const isPending = isPendingUpdate || isPendingDelete;

  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Sheet open={openEditTaskSheet} onOpenChange={handleOpenChange}>
      <SheetContent className="border-l-sidebar-border flex flex-col overflow-hidden">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Editar tarefa</SheetTitle>
          <SheetDescription className="text-xs">
            Atualize os dados da tarefa selecionada
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
            {isErrorUpdate && (
              <div className="rounded bg-red-50 p-2 text-xs text-red-500">
                Erro ao atualizar tarefa. Tente novamente.
              </div>
            )}

            {isErrorDelete && (
              <div className="rounded bg-red-50 p-2 text-xs text-red-500">
                Erro ao apagar tarefa. Tente novamente.
              </div>
            )}

            {!selectedTask && (
              <div className="rounded bg-amber-50 p-2 text-xs text-amber-700">
                Nenhuma tarefa selecionada para edição.
              </div>
            )}

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2">
                  <FieldLabel className="text-xs">Nome da tarefa</FieldLabel>
                  <Input
                    className="text-xs placeholder:text-xs"
                    placeholder="Nome da tarefa"
                    aria-invalid={fieldState.invalid}
                    disabled={!selectedTask || isPending}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2">
                  <FieldLabel className="text-xs">Descrição</FieldLabel>
                  <Textarea
                    className="text-xs placeholder:text-xs"
                    placeholder="Descrição da tarefa"
                    aria-invalid={fieldState.invalid}
                    disabled={!selectedTask || isPending}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="listId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2">
                  <FieldLabel className="text-xs">Lista</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingLists || !selectedTask || isPending}
                  >
                    <SelectTrigger
                      className="w-full text-xs"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingLists
                            ? "Carregando listas..."
                            : "Selecione uma lista"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="p-2"
                      position="popper"
                      align="end"
                    >
                      {lists.map((list) => (
                        <SelectItem
                          key={list.id}
                          value={list.id}
                          className="cursor-pointer text-xs"
                        >
                          {list.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2">
                  <FieldLabel className="text-xs">Prioridade</FieldLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="gap-2"
                    disabled={!selectedTask || isPending}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="LOW" id="edit-priority-low" />
                      <Label htmlFor="edit-priority-low" className="text-xs">
                        Baixa
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="MEDIUM"
                        id="edit-priority-medium"
                      />
                      <Label htmlFor="edit-priority-medium" className="text-xs">
                        Média
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="HIGH" id="edit-priority-high" />
                      <Label htmlFor="edit-priority-high" className="text-xs">
                        Alta
                      </Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2">
                  <FieldLabel className="text-xs">Status</FieldLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="gap-2"
                    disabled={!selectedTask || isPending}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="TODO" id="edit-status-todo" />
                      <Label htmlFor="edit-status-todo" className="text-xs">
                        A fazer
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="IN_PROGRESS"
                        id="edit-status-progress"
                      />
                      <Label htmlFor="edit-status-progress" className="text-xs">
                        Em andamento
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="DONE" id="edit-status-done" />
                      <Label htmlFor="edit-status-done" className="text-xs">
                        Concluído
                      </Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="dueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2">
                  <FieldLabel className="text-xs">Data de conclusão</FieldLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        aria-invalid={fieldState.invalid}
                        disabled={!selectedTask || isPending}
                        className={cn(
                          "w-full justify-between border-sidebar-border text-left text-xs font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? new Intl.DateTimeFormat("pt-BR").format(field.value)
                          : "Selecione uma data"}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => {
                          field.onChange(date ?? null);
                          setCalendarOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <SheetFooter className="flex-col items-center">
            <Button
              type="submit"
              disabled={!selectedTask || isPending}
              className="w-full"
            >
              {isPendingUpdate ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!selectedTask || isPending}
              onClick={handleDeleteTask}
              className="w-full"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              {isPendingDelete ? "Apagando..." : "Apagar tarefa"}
            </Button>
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-sidebar-border w-full"
                disabled={isPending}
              >
                Cancelar
              </Button>
            </SheetClose>
 
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
