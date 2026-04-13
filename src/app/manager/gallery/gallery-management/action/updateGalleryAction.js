"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function updateGalleryAction({
  uuid,
  title,
  description,
  location,
  event_date,
  active,
  revalidate = [],
}) {
  if (!uuid) {
    return { ok: false, error: "UUID gallery mancante." };
  }

  if (!title || !title.trim()) {
    return { ok: false, error: "Il titolo è obbligatorio." };
  }

  try {
    const supabase = await createSupabaseServerClient();

    const payload = {
      title: title.trim(),
      description: description?.trim() || null,
      location: location?.trim() || null,
      event_date: event_date || null,
      active: Boolean(active),
    };

    const { error } = await supabase
      .from("gallery")
      .update(payload)
      .eq("uuid", uuid);

    if (error) {
      return { ok: false, error: error.message };
    }

    if (Array.isArray(revalidate)) {
      revalidate.forEach((path) => {
        if (path) revalidatePath(path);
      });
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "Errore imprevisto durante l'aggiornamento.",
    };
  }
}