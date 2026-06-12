/* ============================================================
   Supabase client. Reads the project URL + anon key from build-time
   Vite env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). When they
   are not configured the client is null and all telemetry is skipped, so
   the app still runs fine locally / on a fresh deploy without Supabase.

   The anon key is intentionally public: the `level_times` table is
   INSERT-only for the anon role via row-level security (see
   supabase/schema.sql), so players can write their times but cannot read
   anyone's data. Only you, via the Supabase dashboard, can read it.
   ============================================================ */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

export const supabase = supabaseEnabled
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: false },
    })
  : null;
