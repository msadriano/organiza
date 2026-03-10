declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    ANTHROPIC_API_KEY: string;
    SUPABASE_JWKS_URI: string;
    ANTHROPIC_API_KEY: string;
  }
}
