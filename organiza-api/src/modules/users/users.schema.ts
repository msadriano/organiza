import { z } from "zod";

const userUpdateSchema = z.object({
  name: z.string().min(1, "Nome inválido").optional(),
  email: z.string().email("Entre com um e-mail válido").optional(),
  avatar_url: z.string().optional(),
});

export { userUpdateSchema };

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
