"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function reorderGalleryPhotosAction(uuid_gallery) {

  if (!uuid_gallery) {
    return { error: "UUID gallery mancante" };
  }

  const supabase = await createSupabaseServerClient();

  const { data: photos, error } = await supabase
    .from("gallery_photo")
    .select("uuid")
    .eq("uuid_gallery", uuid_gallery)
    .order("order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  if (!photos?.length) {
    return { success: true };
  }

  const updates = photos.map((p, index) => ({
    uuid: p.uuid,
    order: index + 1
  }));

  for (const row of updates) {
    await supabase
      .from("gallery_photo")
      .update({ order: row.order })
      .eq("uuid", row.uuid);
  }

  return { success: true };
}