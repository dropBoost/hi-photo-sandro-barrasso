"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createPreventivoItemAction(formData) {
  try {
    const supabase = await createSupabaseServerClient();

    const id_preventivi = formData.get("id_preventivi");
    const id_servizio = formData.get("id_servizio");
    const prezzo = Number(formData.get("prezzo"));
    const sconto = Number(formData.get("sconto") || 0);

    if (!id_preventivi || Number.isNaN(id_preventivi)) {
      return { success: false, error: "Seleziona un preventivo valido." };
    }

    if (!id_servizio || Number.isNaN(id_servizio)) {
      return { success: false, error: "Seleziona un servizio valido." };
    }

    if (Number.isNaN(prezzo)) {
      return { success: false, error: "Inserisci un prezzo valido." };
    }

    if (Number.isNaN(sconto)) {
      return { success: false, error: "Inserisci uno sconto valido." };
    }

    const { error } = await supabase.from("preventivi_item").insert([
      {
        id_preventivi,
        id_servizio,
        prezzo,
        sconto,
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/manager/preventivi-item");

    return {
      success: true,
      message: "Voce preventivo inserita correttamente.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Errore durante il salvataggio.",
    };
  }
}