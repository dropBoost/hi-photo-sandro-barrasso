import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = (searchParams.get("q") || "").trim();
    const limit = Math.min(Number(searchParams.get("limit") || 20), 50);

    const supabase = await createSupabaseServerClient();

    // Se la colonna PK è "id" e non "uuid", cambia "uuid" -> "id"
    let query = supabase
      .from("gallery")
      .select(`
        *,
        category:category(*)
      `)
      .order("title", { ascending: true })
      .limit(limit);

    if (q) query = query.ilike("title", `%${q}%`);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data: data || [] });
  } catch (e) {
    console.error("API /api/list-gallery error:", e);
    return NextResponse.json({ ok: false, message: e?.message || "Server error" }, { status: 500 });
  }
}