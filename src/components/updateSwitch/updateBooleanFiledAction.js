"use server";

import { createClient } from "@supabase/supabase-js";

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL mancante");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY mancante");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function updateBooleanFieldAction({
  tableName,
  idColumn,
  idValue,
  fieldName,
  value,
}) {
  try {
    if (!tableName) throw new Error("tableName mancante");
    if (!idColumn) throw new Error("idColumn mancante");
    if (idValue === undefined || idValue === null) {
      throw new Error("idValue mancante");
    }
    if (!fieldName) throw new Error("fieldName mancante");
    if (typeof value !== "boolean") {
      throw new Error("value deve essere boolean");
    }

    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from(tableName)
      .update({ [fieldName]: value })
      .eq(idColumn, idValue);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Valore aggiornato correttamente",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Errore aggiornamento",
    };
  }
}