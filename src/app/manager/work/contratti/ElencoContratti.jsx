"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { AiFillDollarCircle } from "react-icons/ai";
import { RiArchiveDrawerFill } from "react-icons/ri";
import IconBooleanField from "@/components/updateBool/updateBool";
import DeleteRecordWithCheck from "@/components/deletePreventivo/deletePreventivo";
import DownloadContrattoPdfButton from "@/components/pdfContratto/DownloadContratto";

export default function ElencoContratti() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      setError("");

      const supabase = createSupabaseBrowserClient();

      const oggi = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("preventivi_item")
        .select(`
          *,
          preventivi!inner(*,
          cliente:clienti_anagrafica(*)
          )
        `)
        .eq("preventivi.accettato", true)
        .eq("preventivi.archiviato", false)
        .gte("preventivi.data_evento", oggi)
        .order("id_preventivi", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        setError(error.message);
        setItems([]);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    }

    fetchItems();
  }, [update]);
  
  const gruppi = useMemo(() => {
    if (!items.length) return [];

    const grouped = items.reduce((acc, item) => {
      const idPreventivo = item.id_preventivi;
      const preventivo = item.preventivi;

      if (!acc[idPreventivo]) {
        acc[idPreventivo] = {
          idPreventivo,
          preventivo,
          righe: [],
          totale: 0,
        };
      }

      const prezzo = Number(item.prezzo || 0);
      const sconto = Number(item.sconto || 0);

      // totale riga con sconto percentuale
      const totaleRiga = prezzo - (prezzo * sconto) / 100;

      acc[idPreventivo].righe.push(item);
      acc[idPreventivo].totale += totaleRiga;

      return acc;
    }, {});

    return Object.values(grouped);
  }, [items]);

  if (loading) {
    return <div className="p-4">Caricamento...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Errore: {error}</div>;
  }
  
  return (
    <div className="flex w-full flex-col gap-3">
      {!gruppi.length ? (
        <div className="p-4">Nessun record trovato.</div>
      ) : (
        gruppi.map((gruppo) => {
          const idPreventivo = gruppo.idPreventivo;
          const p = gruppo.preventivo;
          const c = gruppo.preventivo.cliente;

          return (
            <div className="flex lg:flex-row flex-col gap-2" key={idPreventivo}>
              <div className="flex-1 block rounded-xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="text-base font-semibold">
                        {c?.nome || "-"} {c?.cognome || "-"}
                      </h2>

                      <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                        #{idPreventivo}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div className="truncate">
                        <span className="font-medium">Tel:</span>{" "}
                        {c?.telefono || "-"}
                      </div>

                      <div className="truncate">
                        <span className="font-medium">Email:</span>{" "}
                        {c?.email || "-"}
                      </div>

                      <div className="truncate">
                        <span className="font-medium">Oggetto:</span>{" "}
                        {p?.oggetto || "-"}
                      </div>

                      <div className="truncate">
                        <span className="font-medium">Evento:</span>{" "}
                        {p?.evento || "-"}
                      </div>

                      <div className="truncate">
                        <span className="font-medium">Data:</span>{" "}
                        {p?.data_evento
                          ? new Date(p.data_evento).toLocaleDateString("it-IT")
                          : "-"}
                      </div>

                      <div className="truncate">
                        <span className="font-medium">Città:</span>{" "}
                        {p?.location_citta || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-end">
                    <div className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-semibold dark:bg-neutral-950">
                      € {gruppo.totale.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col flex-row items-center lg:justify-between justify-end gap-1 rounded-lg bg-neutral-100 px-2 py-2 text-sm font-semibold dark:bg-neutral-950">
                {p?.accettato && (
                  <div>
                    <DownloadContrattoPdfButton idPreventivo={idPreventivo} />
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}