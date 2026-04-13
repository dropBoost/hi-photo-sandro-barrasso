"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function postSiteContactAction(data) {
  try {
    const supabase = await createSupabaseServerClient();

    const payload = {
      name: data?.name?.trim() || "",
      surname: data?.surname?.trim() || "",
      email: data?.email?.trim() || "",
      tel: data?.tel?.trim() || "",
      request: data?.request?.trim() || "",
    };

    if (!payload.name) {
      return { ok: false, message: "Il nome è obbligatorio." };
    }

    if (!payload.surname) {
      return { ok: false, message: "Il cognome è obbligatorio." };
    }

    if (!payload.email) {
      return { ok: false, message: "L'email è obbligatoria." };
    }

    if (!payload.request) {
      return { ok: false, message: "La richiesta è obbligatoria." };
    }

    const { error } = await supabase.from("site_contact").insert([payload]);

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err?.message || "Errore interno del server.",
    };
  }
}