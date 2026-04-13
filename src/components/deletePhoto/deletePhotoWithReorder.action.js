"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { reorderGalleryPhotosAction } from "./reorderGalleryPhoto.action";
import { reorderEventPhotosAction } from "./reorderEventPhoto.action";

export async function deletePhotoWithReorderAction({ uuid, bucket, tablePhoto }) {
  try {
    if (!uuid) {
      throw new Error("UUID foto mancante");
    }

    if (!tablePhoto) {
      throw new Error("Tabella mancante");
    }

    const supabase = await createSupabaseServerClient();

    const foreignKey = tablePhoto === "gallery_photo" ? "uuid_gallery" : "uuid_event";

    const { data: photo, error: fetchError } = await supabase
      .from(tablePhoto)
      .select(`uuid, link, ${foreignKey}`)
      .eq("uuid", uuid)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (!photo) {
      throw new Error("Foto non trovata");
    }

    if (photo.link) {
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([photo.link]);

      if (storageError) {
        throw new Error(storageError.message);
      }
    }

    const { error: deleteError } = await supabase
      .from(tablePhoto)
      .delete()
      .eq("uuid", uuid);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (tablePhoto === "gallery_photo") {
      await reorderGalleryPhotosAction(photo.uuid_gallery);
    }

    if (tablePhoto === "event_photo") {
      await reorderEventPhotosAction(photo.uuid_event);
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Errore eliminazione foto",
    };
  }
}