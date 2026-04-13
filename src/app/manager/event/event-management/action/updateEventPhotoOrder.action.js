"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { reorderEventPhotosAction } from "./reorderEventPhoto.action";

export async function moveEventPhotoOrderAction({ uuid, direction }) {
  try {
    if (!uuid) {
      throw new Error("UUID foto mancante");
    }

    if (!direction || !["up", "down"].includes(direction)) {
      throw new Error("Direzione non valida");
    }

    const supabase = await createSupabaseServerClient();

    const { data: current, error: currentError } = await supabase
      .from("event_photo")
      .select("uuid, uuid_event, order")
      .eq("uuid", uuid)
      .maybeSingle();

    if (currentError) {
      throw new Error(currentError.message);
    }

    if (!current) {
      throw new Error("Foto non trovata");
    }

    const { data: photos, error: photosError } = await supabase
      .from("event_photo")
      .select("uuid, order, created_at")
      .eq("uuid_event", current.uuid_event)
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

    if (direction === "up") targetIndex = currentIndex - 1;
    if (direction === "down") targetIndex = currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= photos.length) {
      return { success: true };
    }

    const target = photos[targetIndex];
    const currentOrder = Number(current.order);
    const targetOrder = Number(target.order);

    const { error: updateCurrentError } = await supabase
      .from("event_photo")
      .update({ order: targetOrder })
      .eq("uuid", current.uuid);

    if (updateCurrentError) {
      throw new Error(updateCurrentError.message);
    }

    const { error: updateTargetError } = await supabase
      .from("event_photo")
      .update({ order: currentOrder })
      .eq("uuid", target.uuid);

    if (updateTargetError) {
      throw new Error(updateTargetError.message);
    }

    await reorderEventPhotosAction(current.uuid_event);

    revalidatePath(`/manager/event/event-management/${current.uuid_event}`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Errore nel riordino delle foto evento",
    };
  }
}