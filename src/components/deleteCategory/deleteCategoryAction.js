"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

function getReadableDeleteCategoryError(error) {
  const message = String(error?.message || error || "").toLowerCase();

  if (
    message.includes("violates foreign key constraint") &&
    message.includes("event_album_category_id_fkey")
  ) {
    return "Impossibile eliminare la categoria perché è ancora associata a uno o più gallery o album evento.";
  }

  if (
    message.includes("violates foreign key constraint") &&
    message.includes("gallery_category_id_fkey")
  ) {
    return "Impossibile eliminare la categoria perché è ancora associata a una o più gallery.";
  }

  if (message.includes("row-level security")) {
    return "Non hai i permessi necessari per eliminare questa categoria.";
  }

  return "Errore durante l'eliminazione della categoria.";
}

export async function deleteCategoryAction({ id }) {
  if (!id) {
    return { success: false, error: "ID categoria mancante" };
  }

  const supabase = await createSupabaseServerClient();

  const { data: category, error: fetchError } = await supabase
    .from("category")
    .select("id, img_cover")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  if (!category) {
    return { success: false, error: "Categoria non trovata" };
  }

  if (category.img_cover) {
    const filePath = category.img_cover.trim();

    const { error: storageError } = await supabase.storage
      .from("assets")
      .remove([filePath]);

    if (storageError) {
      return {
        success: false,
        error: `Errore eliminazione immagine: ${storageError.message}`,
      };
    }
  }

  const { error: deleteError } = await supabase
    .from("category")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return {
      success: false,
      error: getReadableDeleteCategoryError(deleteError),
    };
  }

  revalidatePath("/manager/gallery/category-management");

  return { success: true };
}