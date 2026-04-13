"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function insertGalleryPhotosAction({ uuid_gallery, links }) {
  try {

    if (!uuid_gallery) {
      throw new Error("UUID gallery mancante");
    }

    if (!links || !Array.isArray(links) || links.length === 0) {
      throw new Error("Nessuna immagine da salvare");
    }

    const supabase = await createSupabaseServerClient();

    // recupero ultimo order
    const { data: lastPhoto } = await supabase
      .from("gallery_photo")
      .select("order")
      .eq("uuid_gallery", uuid_gallery)
      .order("order", { ascending: false })
      .limit(1)
      .maybeSingle();

    let startOrder = lastPhoto ? Number(lastPhoto.order) + 1 : 1;

    const rows = links.map((link, index) => ({
      uuid_gallery: uuid_gallery,
      link: link,
      order: startOrder + index
    }));

    const { error } = await supabase
      .from("gallery_photo")
      .insert(rows);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/manager/gallery");

    return {
      success: true,
    };

  } catch (err) {
    return {
      error: err.message || "Errore inserimento foto",
    };
  }
}