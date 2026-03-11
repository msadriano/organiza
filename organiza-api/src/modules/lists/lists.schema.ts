import { z } from "zod";

const listCreateSchema = z.object({
  title: z.string().min(1, "O título da lista não pode ser vazio"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

const idParamsValidateSchema = z.object({
  id: z.string().uuid(),
});

const listBodyUpdateSchema = z.object({
  title: z.string().min(1, "O título não pode ser vázio").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export { listCreateSchema, idParamsValidateSchema, listBodyUpdateSchema };

export type ListCreateSchema = z.infer<typeof listCreateSchema>;
export type ListParamsUpdateSchema = z.infer<typeof idParamsValidateSchema>;
export type ListBodyUpdateSchema = z.infer<typeof listBodyUpdateSchema>;
