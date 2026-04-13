"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default function PreventivoView({ idpreventivo }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      setError("");

      const supabase = createSupabaseBrowserClient();

      let query = supabase
        .from("preventivi_item")
        .select(`
          *,
          preventivi:preventivi!preventivi_item_id_preventivi_fkey (
            id,
            oggetto,
            location,
            location_citta,
            evento,
            descrizione,
            data_evento,
            cliente:clienti_anagrafica (
              id,
              nome,
              cognome,
              email,
              telefono
            )
          ),
          preventivi_servizi:preventivi_servizi!preventivi_item_id_servizio_fkey (
            id,
            nome_servizio,
            categoria,
            descrizione
          )
        `)
        .order("id_preventivi", { ascending: true })
        .order("id", { ascending: true });

      if (idpreventivo) {
        query = query.eq("id_preventivi", idpreventivo);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        setItems([]);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    }

    fetchItems();
  }, [idpreventivo]);

  const groupedItems = useMemo(() => {
    const grouped = {};

    for (const item of items) {
      const key = item.id_preventivi;

      if (!grouped[key]) {
        grouped[key] = {
          preventivo: item.preventivi || null,
          items: [],
          totale: 0,
        };
      }

      const prezzo = Number(item.prezzo || 0);
      const sconto = Number(item.sconto || 0);
      const totaleRiga = prezzo - (prezzo * sconto) / 100;

      grouped[key].items.push({
        ...item,
        totaleRiga,
      });

      grouped[key].totale += totaleRiga;
    }

    return Object.entries(grouped);
  }, [items]);

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (error) {
    return <div className="text-red-500">Errore: {error}</div>;
  }

  if (!groupedItems.length) {
    return <div>Nessun record trovato.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {groupedItems.map(([id, gruppo]) => {
        const p = gruppo.preventivo;

        return (
          <div key={id} className="rounded-2xl p-6 shadow-sm">
            <div className="mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold">Preventivo #{id}</h2>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <span className="font-semibold">Nome:</span>{" "}
                  {p?.cliente?.nome || "-"}
                </div>

                <div>
                  <span className="font-semibold">Cognome:</span>{" "}
                  {p?.cliente?.cognome || "-"}
                </div>

                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  {p?.cliente?.email || "-"}
                </div>

                <div>
                  <span className="font-semibold">Telefono:</span>{" "}
                  {p?.cliente?.telefono || "-"}
                </div>

                <div>
                  <span className="font-semibold">Oggetto:</span>{" "}
                  {p?.oggetto || "-"}
                </div>

                <div>
                  <span className="font-semibold">Evento:</span>{" "}
                  {p?.evento || "-"}
                </div>

                <div>
                  <span className="font-semibold">Location:</span>{" "}
                  {p?.location || "-"}
                </div>

                <div>
                  <span className="font-semibold">Città location:</span>{" "}
                  {p?.location_citta || "-"}
                </div>

                <div>
                  <span className="font-semibold">Data evento:</span>{" "}
                  {p?.data_evento
                    ? new Date(p.data_evento).toLocaleDateString("it-IT")
                    : "-"}
                </div>
              </div>

              <div className="mt-4">
                <span className="font-semibold">Descrizione preventivo:</span>
                <div className="mt-1 rounded-lg p-3 text-sm">
                  {p?.descrizione || "-"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {gruppo.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-neutral-200 p-4"
                >
                  <div className="mb-3 flex flex-col gap-1 border-b pb-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-lg font-semibold">
                        {item.preventivi_servizi?.nome_servizio || "-"}
                      </div>
                      <div className="text-sm text-neutral-500">
                        Categoria: {item.preventivi_servizi?.categoria || "-"}
                      </div>
                    </div>

                    <div className="text-sm text-neutral-500">
                      ID Item: {item.id}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <span className="font-semibold">ID Preventivo:</span>{" "}
                      {item.id_preventivi || "-"}
                    </div>

                    <div>
                      <span className="font-semibold">ID Servizio:</span>{" "}
                      {item.id_servizio || "-"}
                    </div>

                    <div>
                      <span className="font-semibold">Prezzo:</span>{" "}
                      € {Number(item.prezzo || 0).toFixed(2)}
                    </div>

                    <div>
                      <span className="font-semibold">Sconto:</span>{" "}
                      {Number(item.sconto || 0).toFixed(2)}%
                    </div>

                    <div>
                      <span className="font-semibold">Totale riga:</span>{" "}
                      € {item.totaleRiga.toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="font-semibold">Descrizione servizio:</span>
                    <div className="mt-1 rounded-lg p-3 text-sm">
                      {item.preventivi_servizi?.descrizione || "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end border-t pt-4">
              <div className="rounded-xl bg-neutral-950 px-5 py-3 font-bold text-white">
                Totale preventivo: € {gruppo.totale.toFixed(2)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}