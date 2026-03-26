"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/store/useAppStore";
import { useCreateTask } from "@/hooks/useTasks";
import { useGetLists } from "@/hooks/useLists";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet";

const formSchema = z.object({
  title: z.string().min(1, "Informe o nome da tarefa"),
  description: z.string().optional(),
  listId: z.string().min(1, "Selecione uma lista"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  dueDate: z.date(),
});

export default function CreateTaskDialog() {
  const { openCreateTask, setOpenCreateTask, createTaskListId } = useAppStore();
  const { data: lists = [], isLoading: isLoadingLists } = useGetLists();
  const { mutate: createTask, isPending } = useCreateTask();

  const listId =
    createTaskListId && createTaskListId != "all-tasks"
      ? createTaskListId
      : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      listId: listId,
      priority: "LOW",
      status: "TODO",
      dueDate: new Date(),
    },
  });

  useEffect(() => {
    form.setValue("listId", listId ?? "");
  }, [form, listId]);

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    createTask(data, {
      onSuccess: () => {
        setOpenCreateTask(false);
        form.reset();
      },
    });
  return (
    <Sheet open={openCreateTask} onOpenChange={setOpenCreateTask}>
      <SheetContent className="border-l-sidebar-border">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">
            Criar nova tarefa
          </SheetTitle>
          <SheetDescription className="text-xs">
            Preencha os campos abaixo para criar nova tarefa
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex h-full flex-col gap-5 p-4"
        >
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
                  disabled={isLoadingLists}
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
                  <SelectContent className="p-2" position="popper" align="end">
                    {lists.map((list) => (
                      <SelectItem
                        key={list.id}
                        value={list.id}
                        className="text-xs cursor-pointer"
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
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="LOW" id="priority-low" />
                    <Label htmlFor="priority-low" className="text-xs">
                      Baixa
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="MEDIUM" id="priority-medium" />
                    <Label htmlFor="priority-medium" className="text-xs">
                      Media
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="HIGH" id="priority-high" />
                    <Label htmlFor="priority-high" className="text-xs">
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
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="TODO" id="status-todo" />
                    <Label htmlFor="status-todo" className="text-xs">
                      A fazer
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="IN_PROGRESS"
                      id="status-in-progress"
                    />
                    <Label htmlFor="status-in-progress" className="text-xs">
                      Em andamento
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="DONE" id="status-done" />
                    <Label htmlFor="status-done" className="text-xs">
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      aria-invalid={fieldState.invalid}
                      className={cn(
                        "w-full justify-between border-sidebar-border text-left font-normal text-xs",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? new Intl.DateTimeFormat("pt-BR").format(field.value)
                        : "Selecione uma data"}
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 " align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
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

          <SheetFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando Tarefa..." : "Salvar Tarefa"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="border-sidebar-border">
                Cancelar
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
