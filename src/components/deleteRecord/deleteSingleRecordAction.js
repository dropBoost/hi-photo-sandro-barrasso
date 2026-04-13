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

function getReadableDeleteError(error) {
  const message = String(error?.message || error || "").toLowerCase();

  if (
    message.includes("violates foreign key constraint") &&
    message.includes("preventivi_item_id_servizio_fkey")
  ) {
    return "Impossibile eliminare questo Elemento perché è ancora utilizzato in uno o più record collegati.";
  }

  if (message.includes("violates foreign key constraint")) {
    return "Impossibile eliminare questo Elemento perché è ancora collegato ad altri record.";
  }

  if (message.includes("row-level security")) {
    return "Non hai i permessi necessari per eliminare questo Elemento.";
  }

  if (message.includes("permission denied")) {
    return "Non hai i permessi necessari per eliminare questo Elemento.";
  }

  if (message.includes("tableName mancante".toLowerCase())) {
    return "Nome tabella mancante.";
  }

  if (message.includes("columnName mancante".toLowerCase())) {
    return "Nome colonna mancante.";
  }

  if (message.includes("uuid mancante".toLowerCase())) {
    return "Identificativo Elemento mancante.";
  }

  return "Si è verificato un errore durante l'eliminazione di questo Elemento.";
}

export async function deleteSingleRecordAction({
  tableName,
  columnName,
  uuid,
}) {
  try {
    if (!tableName) throw new Error("tableName mancante");
    if (!columnName) throw new Error("columnName mancante");
    if (!uuid) throw new Error("uuid mancante");

    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(columnName, uuid);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Elemento eliminato correttamente.",
    };
  } catch (error) {
    return {
      success: false,
      message: getReadableDeleteError(error),
    };
  }
}