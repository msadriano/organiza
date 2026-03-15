import { z } from "zod";

const checkEmailSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export { checkEmailSchema };

export type CheckEmailSchema = z.infer<typeof checkEmailSchema>;
