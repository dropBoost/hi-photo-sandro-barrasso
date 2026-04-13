"use server";

import { createClient } from "@supabase/supabase-js";

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}


// recupera tutti i file dentro una cartella
async function getFilesRecursive(supabase, bucket, folder) {
  const files = [];

  async function walk(path) {
    const { data, error } = await supabase.storage.from(bucket).list(path, {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) throw new Error(error.message);

    for (const item of data || []) {
      const fullPath = `${path}/${item.name}`;

      if (item.metadata) {
        files.push(fullPath);
      } else {
        await walk(fullPath);
      }
    }
  }

  await walk(folder);

  return files;
}


export async function deleteMotherContentAction({
  uuid,
  bucket,
  motherTable,
  contentTable,
  motherIdColumn,
  contentForeignKeyColumn,
}) {

  const supabase = createSupabaseAdmin();

  try {

    if (!uuid) throw new Error("uuid mancante");

    // =========================
    // 1️⃣ STORAGE
    // =========================

    if (bucket) {

      const files = await getFilesRecursive(
        supabase,
        bucket,
        uuid
      );

      if (files.length > 0) {
        const { error } = await supabase
          .storage
          .from(bucket)
          .remove(files);

        if (error) throw new Error(error.message);
      }

    }


    // =========================
    // 2️⃣ CONTENT TABLE
    // =========================

    if (contentTable) {

      const { error } = await supabase
        .from(contentTable)
        .delete()
        .eq(contentForeignKeyColumn, uuid);

      if (error) throw new Error(error.message);

    }


    // =========================
    // 3️⃣ MOTHER TABLE
    // =========================

    const { error } = await supabase
      .from(motherTable)
      .delete()
      .eq(motherIdColumn, uuid);

    if (error) throw new Error(error.message);


    return {
      success: true,
      message: "Eliminazione completata",
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };

  }
}