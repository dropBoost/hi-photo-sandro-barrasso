"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function insertEventPhotosAction({ uuid_event, links }) {
  try {
    if (!uuid_event) {
      throw new Error("UUID evento mancante");
    }

    if (!links || !Array.isArray(links) || links.length === 0) {
      throw new Error("Nessuna immagine da salvare");
    }

    const supabase = await createSupabaseServerClient();

    const { data: lastPhoto, error: lastPhotoError } = await supabase
      .from("event_photo")
      .select("order")
      .eq("uuid_event", uuid_event)
      .order("order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastPhotoError) {
      throw new Error(lastPhotoError.message);
    }

    const startOrder = lastPhoto?.order ? Number(lastPhoto.order) + 1 : 1;

    const rows = links.map((link, index) => ({
      uuid_event,
      link,
      order: startOrder + index,
    }));

    const { error } = await supabase
      .from("event_photo")
      .insert(rows);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/manager/event/event-management/${uuid_event}`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Errore inserimento foto evento",
    };
  }
}