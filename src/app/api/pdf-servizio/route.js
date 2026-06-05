import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import ServizioPdfDocument from "@/components/pdfServizio/PDFservizio";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function settingsArrayToObject(settingsRows = []) {
  return settingsRows.reduce((acc, row) => {
    if (row?.key) {
      acc[row.key] = row.value;
    }

    return acc;
  }, {});
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idServizio = searchParams.get("id");

    if (!idServizio) {
      return new Response("ID servizio mancante", { status: 400 });
    }

    const { data: servizio, error: servizioError } = await supabase
      .from("preventivi_servizi")
      .select("id, nome_servizio, categoria, descrizione")
      .eq("id", idServizio)
      .single();

    if (servizioError || !servizio) {
      console.error("Errore caricamento servizio:", servizioError);

      return new Response("Servizio non trovato", {
        status: 404,
      });
    }

    const { data: settingsRows, error: settingsError } = await supabase
      .from("setting")
      .select("key, value");

    if (settingsError) {
      console.error("Errore caricamento settings:", settingsError);
    }

    const settings = settingsArrayToObject(settingsRows || []);

    const stream = await renderToStream(
      <ServizioPdfDocument
        servizio={servizio}
        settings={settings}
      />
    );

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="scheda-servizio-${idServizio}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Errore PDF servizio:", error);

    return new Response("Errore generazione PDF servizio", {
      status: 500,
    });
  }
}