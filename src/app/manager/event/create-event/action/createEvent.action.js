"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const EventSchema = z.object({
  title: z.string().trim().min(2, "Titolo troppo corto"),
  description: z.string().trim().optional(),
  location: z.string().trim().min(2, "Location troppo corta"),
  event_date: z.string().trim().min(10, "Data non valida"), // YYYY-MM-DD
  category_id: z.string().trim().min(3, "Categoria non valida"),
});

export async function createEventAction(prevState, formData) {
  try {
    const raw = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      event_date: formData.get("event_date"),
      category_id: formData.get("category_id"),
    };

    const parsed = EventSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
        message: "Controlla i campi evidenziati",
      };
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("event_album").insert({
      title: parsed.data.title,
      description: parsed.data.description || null,
      location: parsed.data.location,
      event_date: parsed.data.event_date,
      category_id: parsed.data.category_id,
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Evento creato con successo" };
  } catch (e) {
    return { ok: false, message: e?.message || "Errore server" };
  }
}