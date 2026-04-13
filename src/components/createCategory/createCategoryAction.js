"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

function generateCategoryId(alias) {
  if (!alias) return "";

  const clean = alias
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();

  const consonants = clean.replace(/[AEIOU]/g, "");
  const vowels = clean.replace(/[^AEIOU]/g, "");

  let result = (consonants + vowels).slice(0, 3);

  while (result.length < 3) {
    result += "X";
  }

  return result;
}

export async function createCategoryAction(formData) {
  const supabase = await createSupabaseServerClient();

  const aliasRaw = formData.get("alias");
  const color = formData.get("color");
  const file = formData.get("img_cover");

  const alias = aliasRaw?.toString().trim().toLowerCase() || "";
  const id = generateCategoryId(alias);

  if (!alias) {
    return { ok: false, error: "Il campo alias è obbligatorio." };
  }

  if (!color) {
    return { ok: false, error: "Il campo color è obbligatorio." };
  }

  if (!file || typeof file === "string" || file.size === 0) {
    return { ok: false, error: "Devi caricare un'immagine." };
  }

  // controllo unicità alias
  const { data: existingAlias, error: aliasCheckError } = await supabase
    .from("category")
    .select("alias")
    .eq("alias", alias)
    .maybeSingle();

  if (aliasCheckError) {
    return { ok: false, error: aliasCheckError.message };
  }

  if (existingAlias) {
    return { ok: false, error: "Esiste già una categoria con questo alias." };
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = alias
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");

  const filePath = `category_cover/${safeName}-${Date.now()}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("assets")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, error: uploadError.message };
  }

  const { error: insertError } = await supabase
    .from("category")
    .insert([
      {
        alias,
        color,
        img_cover: filePath,
        id,
      },
    ]);

  if (insertError) {
    await supabase.storage.from("assets").remove([filePath]);

    if (insertError.code === "23505") {
      return { ok: false, error: "Alias già esistente." };
    }

    return { ok: false, error: insertError.message };
  }

  return {
    ok: true,
    message: "Categoria creata con successo.",
  };
}