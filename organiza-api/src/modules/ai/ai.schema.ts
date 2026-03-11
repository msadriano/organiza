import { z } from "zod";

const aiPromptSchema = z.object({
  prompt: z.string().min(1, "O prompt não pode ser vazio"),
});

export { aiPromptSchema };

export type AiPromptSchema = z.infer<typeof aiPromptSchema>;
