import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import ContrattoPdfDocument from "@/components/pdfContratto/PdfContratto";

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

    const { data: items, error: itemsError } = await supabase
      .from("preventivi_item")
      .select(`
        *,
        preventivi_servizi (
          id,
          nome_servizio,
          categoria,
          descrizione
        )
      `)
      .eq("id_preventivi", idPreventivo)
      .order("id", { ascending: true });

    if (itemsError) {
      console.error("Errore caricamento items:", itemsError);
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
      items: items || [],
      settings,
    };

    const stream = await renderToStream(
      <ContrattoPdfDocument data={payload} />
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="contratto-${idPreventivo}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Errore PDF:", error);

    return new Response("Errore generazione PDF", {
      status: 500,
    });
  }
}