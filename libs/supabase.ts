import { createClient } from "@supabase/supabase-js";
import CONFIG from "src/config";

export const supabaseClient = createClient(
	CONFIG.SUPABASE.public_url,
	CONFIG.SUPABASE.public_anon_key,
);
export const storageBucket = supabaseClient.storage.from("uploads");
