"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function deleteGalleryPhotoAction({ uuid, link, revalidate = [], bucket, tablePhoto }) {
  if (!uuid) {
    return { ok: false, error: "UUID mancante." };
  }

  if (!link) {
    return { ok: false, error: "Link file mancante." };
  }

  if (!bucket) {
    return { ok: false, error: "Bucket mancante." };
  }

  try {
    const supabase = await createSupabaseServerClient();

    const filePath = String(link).trim();

    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (storageError) {
      return {
        ok: false,
        error: `Errore cancellazione file: ${storageError.message}`,
      };
    }

    const { error: dbError } = await supabase
      .from(tablePhoto)
      .delete()
      .eq("uuid", uuid);

    if (dbError) {
      return {
        ok: false,
        error: `File eliminato ma record non cancellato: ${dbError.message}`,
      };
    }

    if (Array.isArray(revalidate)) {
      revalidate.forEach((path) => {
        if (path) revalidatePath(path);
      });
    }

    return { ok: true, uuid };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "Errore imprevisto durante l'eliminazione.",
    };
  }
}