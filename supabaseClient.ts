import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// A chave "publishable" é segura para uso no navegador: ela só permite o que
// as políticas de RLS autorizam. Em produção, prefira variáveis de ambiente
// (ex.: import.meta.env.VITE_SUPABASE_URL / process.env.NEXT_PUBLIC_SUPABASE_URL).
const SUPABASE_URL = "https://izqkytitetewozwtlsez.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qQDMHFx5q2v_O6Lp9odhbw_ylEG4W6V";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
