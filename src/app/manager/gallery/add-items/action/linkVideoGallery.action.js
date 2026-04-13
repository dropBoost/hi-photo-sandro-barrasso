"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function insertGalleryVideoAction({ uuid_gallery, link }) {
  const supabase = await createSupabaseServerClient();

  const cleanLink = (link || "").trim();
  if (!uuid_gallery) throw new Error("uuid_gallery mancante");
  if (!cleanLink) throw new Error("Inserisci un link valido");

  const { error } = await supabase.from("gallery_video").insert([
    {
      uuid_gallery,
      link: cleanLink,
    },
  ]);

  if (error) throw new Error(error.message);

  return { ok: true };
}