declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    SUPABASE_JWKS_URI: string;
    GROQ_API_KEY: string;
  }
}
