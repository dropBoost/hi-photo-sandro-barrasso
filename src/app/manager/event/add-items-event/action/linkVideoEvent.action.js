"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function insertGalleryVideoEventAction({ uuid_event, link }) {
  const supabase = await createSupabaseServerClient();

  const cleanLink = (link || "").trim();
  if (!uuid_event) throw new Error("uuid_event mancante");
  if (!cleanLink) throw new Error("Inserisci un link valido");

  const { error } = await supabase.from("event_video").insert([
    {
      uuid_event,
      link: cleanLink,
    },
  ]);

  if (error) throw new Error(error.message);

  return { ok: true };
}