import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SUPABASE_JWKS_URI: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  PORT: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variáveis de ambiente inválidas ou ausentes:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}
