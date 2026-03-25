import { Priority, Status } from "@prisma/client";
import { z } from "zod";

const taskCreateSchema = z.object({
  listId: z.string().uuid(),
  title: z.string().min(1, "O título da tarefa não pode ficar em branco"),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).default("LOW"),
  status: z.nativeEnum(Status).default("TODO"),
  dueDate: z.coerce.date().optional(),
});

const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "O título da tarefa não pode ficar em branco")
    .optional(),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
  dueDate: z.coerce.date().optional(),
});

const taskCreateManySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).default("LOW"),
  dueDate: z.coerce.date().optional(),
  listId: z.string().uuid(),
});

const taskQueryParams = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
});

const taskDeleteBodySchema = z.object({
  id: z.array(z.string().uuid()).min(1, "Envie ao menos um id"),
});

const taskUpdateManySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "Envie ao menos um id"),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
  dueDate: z.coerce.date().optional(),
});
export {
  taskCreateSchema,
  taskUpdateSchema,
  taskCreateManySchema,
  taskQueryParams,
  taskDeleteBodySchema,
  taskUpdateManySchema,
};

export type TaskCreateSchema = z.infer<typeof taskCreateSchema>;
export type TaskUpdateSchema = z.infer<typeof taskUpdateSchema>;
export type TaskCreateManySchema = z.infer<typeof taskCreateManySchema>;
export type TaskQueryParams = z.infer<typeof taskQueryParams>;
export type TaskDeleteBodySchema = z.infer<typeof taskDeleteBodySchema>;
