"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function moveGalleryPhotoOrderAction({ uuid, direction }) {
  try {
    if (!uuid) {
      throw new Error("UUID foto mancante");
    }

    if (!direction || !["up", "down"].includes(direction)) {
      throw new Error("Direzione non valida");
    }

    const supabase = await createSupabaseServerClient();

    // foto corrente
    const { data: current, error: currentError } = await supabase
      .from("gallery_photo")
      .select("uuid, uuid_gallery, order")
      .eq("uuid", uuid)
      .maybeSingle();

    if (currentError) {
      throw new Error(currentError.message);
    }

    if (!current) {
      throw new Error("Foto non trovata");
    }

    const currentOrder = Number(current.order || 0);

    // tutte le foto della stessa gallery
    const { data: photos, error: photosError } = await supabase
      .from("gallery_photo")
      .select("uuid, order")
      .eq("uuid_gallery", current.uuid_gallery)
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });

    if (photosError) {
      throw new Error(photosError.message);
    }

    const currentIndex = photos.findIndex((p) => p.uuid === current.uuid);

    if (currentIndex === -1) {
      throw new Error("Foto corrente non trovata nella sequenza");
    }

    let targetIndex = currentIndex;

    if (direction === "up") {
      targetIndex = currentIndex - 1;
    }

    if (direction === "down") {
      targetIndex = currentIndex + 1;
    }

    if (targetIndex < 0 || targetIndex >= photos.length) {
      return { success: true };
    }

    const target = photos[targetIndex];
    const targetOrder = Number(target.order || 0);

    // scambio order
    const { error: updateCurrentError } = await supabase
      .from("gallery_photo")
      .update({ order: targetOrder })
      .eq("uuid", current.uuid);

    if (updateCurrentError) {
      throw new Error(updateCurrentError.message);
    }

    const { error: updateTargetError } = await supabase
      .from("gallery_photo")
      .update({ order: currentOrder })
      .eq("uuid", target.uuid);

    if (updateTargetError) {
      throw new Error(updateTargetError.message);
    }

    revalidatePath("/manager/gallery");
    revalidatePath(`/manager/gallery/gallery-management/${current.uuid_gallery}`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Errore riordino foto",
    };
  }
}