/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL — set as a build-time env var in Cloudflare Pages. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon (public) key — safe to embed; access is gated by RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
