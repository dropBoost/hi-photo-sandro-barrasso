import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import ContrattoPdfDocument from "@/components/pdfContratto/PdfContratto";
import PDFschedaAcconti from "@/components/pdfSchedaAcconti/PDFschedaAcconti";

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
    const idPreventivo = searchParams.get("id");

    if (!idPreventivo) {
      return new Response("ID preventivo mancante", { status: 400 });
    }

    const { data: preventivo, error: preventivoError } = await supabase
      .from("preventivi")
      .select(`
        *,
        cliente:clienti_anagrafica!preventivi_id_cliente_fkey (
          id,
          nome,
          cognome,
          email,
          telefono
        )
      `)
      .eq("id", idPreventivo)
      .single();

    if (preventivoError || !preventivo) {
      console.error("Errore caricamento preventivo:", preventivoError);
      return new Response("Preventivo non trovato", { status: 404 });
    }

    const { data: acconti, error: accontiError } = await supabase
      .from("preventivi_acconti")
      .select(`*`)
      .eq("id_preventivo", idPreventivo)
      .order("created_at", { ascending: true });

    if (accontiError) {
      console.error("Errore caricamento acconti:", accontiError);
      return new Response("Errore caricamento elementi preventivo", {
        status: 500,
      });
    }

    const { data: settingsRows, error: settingsError } = await supabase
      .from("setting")
      .select("key, value");

    if (settingsError) {
      console.error("Errore caricamento settings:", settingsError);
    }

    const settings = settingsArrayToObject(settingsRows || []);

    const payload = {
      idPreventivo: preventivo.id,
      cliente: preventivo.cliente || null,
      descrizione: preventivo.descrizione || "",
      oggetto: preventivo.oggetto || "",
      evento: preventivo.evento || "",
      location: preventivo.location || "",
      location_citta: preventivo.location_citta || "",
      data_evento: preventivo.data_evento || "",
      scadenza_preventivo: preventivo.scadenza_preventivo || "",
      acconti: acconti || [],
      settings,
    };

    const stream = await renderToStream(
      <PDFschedaAcconti data={payload}/>
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="acconti-${idPreventivo}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Errore PDF:", error);

    return new Response("Errore generazione PDF", {
      status: 500,
    });
  }
}