"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPreventivoAction(payload) {
  const supabase = await createSupabaseServerClient();

  const data = {
    id_cliente: payload?.id_cliente || null,
    oggetto: payload?.oggetto?.trim() || "",
    location: payload?.location?.trim() || "",
    location_citta: payload?.location_citta?.trim() || "",
    evento: payload?.evento?.trim() || "",
    descrizione: payload?.descrizione?.trim() || "",
    data_evento: payload?.data_evento || null,
    scadenza_preventivo: payload?.scadenza_preventivo || null,
  };

  if (!data.id_cliente) {
    return { success: false, error: "Devi selezionare un cliente." };
  }

  if (!data.oggetto) {
    return { success: false, error: "Il campo oggetto è obbligatorio." };
  }

  if (!data.evento) {
    return { success: false, error: "Il campo evento è obbligatorio." };
  }

  const { error } = await supabase.from("preventivi").insert([data]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/manager/preventivi");

  return { success: true };
}