"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function reorderEventPhotosAction(uuid_event) {
  try {
    if (!uuid_event) {
      throw new Error("UUID evento mancante");
    }

    const supabase = await createSupabaseServerClient();

    const { data: photos, error } = await supabase
      .from("event_photo")
      .select("uuid, order, created_at")
      .eq("uuid_event", uuid_event)
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    if (!photos?.length) {
      return { success: true };
    }

    for (let i = 0; i < photos.length; i++) {
      const desiredOrder = i + 1;

      if (photos[i].order !== desiredOrder) {
        const { error: updateError } = await supabase
          .from("event_photo")
          .update({ order: desiredOrder })
          .eq("uuid", photos[i].uuid);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }
    }

    revalidatePath(`/manager/event/event-management/${uuid_event}`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Errore riordino foto evento",
    };
  }
}