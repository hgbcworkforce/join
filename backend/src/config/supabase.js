import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const cleanEnvVar = (val) => {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "");
};

const supabaseUrl = cleanEnvVar(process.env.SUPABASE_URL);
const supabaseKey = cleanEnvVar(
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY
);

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id")) {
  console.warn(
    "⚠️ Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing or contains placeholder values. Please check your Render Environment Variables."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
