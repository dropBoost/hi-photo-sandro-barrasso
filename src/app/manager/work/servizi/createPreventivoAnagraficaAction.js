"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPreventivoAnagraficaAction(payload) {
  const supabase = await createSupabaseServerClient();

  const nome_servizio = payload?.nome_servizio?.trim() || "";
  const categoria = payload?.categoria?.trim() || "";
  const descrizione = payload?.descrizione?.trim() || "";

  if (!nome_servizio) {
    return { success: false, error: "Il campo nome_servizio è obbligatorio." };
  }

  if (!categoria) {
    return { success: false, error: "Il campo categoria è obbligatorio." };
  }

  const { error } = await supabase.from("preventivi_servizi").insert([
    {
      nome_servizio,
      categoria,
      descrizione,
    },
  ]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/manager/preventivi");

  return { success: true };
}