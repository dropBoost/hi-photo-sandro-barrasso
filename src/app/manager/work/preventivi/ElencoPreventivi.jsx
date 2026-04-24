"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AiFillDollarCircle } from "react-icons/ai";
import { RiArchiveDrawerFill } from "react-icons/ri";
import IconBooleanField from "@/components/updateBool/updateBool";
import DeleteRecordWithCheck from "@/components/deletePreventivo/deletePreventivo";
import DownloadPreventivoPdfButton from "@/components/pdfPreventivo/DownloadPreventive";
import ContrattoPdfDocument from "@/components/pdfContratto/PdfContratto";
import DownloadContrattoPdfButton from "@/components/pdfContratto/DownloadContratto";

export default function ElencoPreventiviRaggruppati() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(0);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filtroStato, setFiltroStato] = useState("inAttesa");
  const [loadingItems, setLoadingItems] = useState(false);
  
  useEffect(() => {
    async function fetchItems() {

      setLoading(true);
      setError("");

      const supabase = createSupabaseBrowserClient();

      let query = supabase
        .from("preventivi_item")
        .select(`
          *,
          preventivi!inner(*,
          cliente:clienti_anagrafica(*)
          )
        `)
        .order("id_preventivi", { ascending: true })
        .order("id", { ascending: true });

      // filtri query supabase
      if (filtroStato === "archiviato") {
        query = query.eq("preventivi.archiviato", true);
      }

      if (filtroStato === "accettato") {
        query = query.eq("preventivi.accettato", true);
      }

      if (filtroStato === "inAttesa") {
        query = query
          .eq("preventivi.accettato", false)
          .eq("preventivi.archiviato", false);
      }

      // "tutto" non applica filtri

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        setItems([]);
      } else {
        setItems(data || []);
        console.log("data",data)
      }

      setLoading(false);
    }
  
    fetchItems();
  }, [update, filtroStato]);

  const groupedItems = useMemo(() => {
    const grouped = {};

    for (const item of items) {
      const key = item.id_preventivi;

      if (!grouped[key]) {
        grouped[key] = {
          preventivo: item.preventivi || null,
          totale: 0,
        };
      }

      const prezzo = Number(item.prezzo || 0);
      const sconto = Number(item.sconto || 0);
      const totaleRiga = prezzo - (prezzo * sconto) / 100;

      grouped[key].totale += totaleRiga;
    }

    return Object.entries(grouped);
  }, [items]);

  const filteredItems = useMemo(() => {
  const term = search.trim().toLowerCase();

  if (!term) return groupedItems;

  return groupedItems.filter(([, gruppo]) => {
    const cliente = gruppo.preventivo?.cliente;

    const nome = cliente?.nome?.toLowerCase() || "";
    const cognome = cliente?.cognome?.toLowerCase() || "";
    const email = cliente?.email?.toLowerCase() || "";

    return (
      nome.includes(term) ||
      cognome.includes(term) ||
      email.includes(term)
    );
  });
}, [groupedItems, search]);

  if (loading) {
    return <div className="p-4">Caricamento...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Errore: {error}</div>;
  }
  
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="sticky top-0 z-10 flex flex-col gap-3 rounded-xl border bg-background p-3">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca per nome, cognome o email..."/>

        <div className="flex flex-wrap items-center gap-4 rounded-lg border p-3">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Checkbox
              checked={filtroStato === "inAttesa"}
              onCheckedChange={() => setFiltroStato("inAttesa")}
            />
            <span>In attesa</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Checkbox
              checked={filtroStato === "accettato"}
              onCheckedChange={() => setFiltroStato("accettato")}
            />
            <span>Accettato</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Checkbox
              checked={filtroStato === "archiviato"}
              onCheckedChange={() => setFiltroStato("archiviato")}
            />
            <span>Archiviato</span>
          </label>


          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Checkbox
              checked={filtroStato === "tutto"}
              onCheckedChange={() => setFiltroStato("tutto")}
            />
            <span>Tutto</span>
          </label>
        </div>
      </div>

      {!filteredItems.length ? (
        <div className="p-4">Nessun record trovato.</div>
      ) : (
        filteredItems.map(([idPreventivo, gruppo]) => {
          const p = gruppo.preventivo;

          return (
            <div className="flex lg:flex-row flex-col gap-2" key={idPreventivo}>
              <Link
                href={`/manager/work/preventivi/${idPreventivo}`}
                className="flex-1 block rounded-xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md bg-white dark:bg-neutral-900"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="text-base font-semibold">
                        {p?.cliente?.nome || "-"} {p?.cliente?.cognome || "-"}
                      </h2>

                      <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                        #{idPreventivo}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div className="truncate">
                        <span className="font-medium">Tel:</span>{" "}
                        {p?.cliente?.telefono || "-"}
                      </div>

                      <div className="truncate">
                        <span className="font-medium">Email:</span>{" "}
                        {p?.cliente?.email || "-"}
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
              </Link>

              <div className="flex lg:flex-col flex-row items-center lg:justify-between justify-end gap-1 rounded-lg bg-neutral-100 px-2 py-2 text-sm font-semibold dark:bg-neutral-950">
                <div>
                  <IconBooleanField
                    nomeTabella="preventivi"
                    nomeCampo="accettato"
                    uuidRecord={idPreventivo}
                    icona={AiFillDollarCircle}
                    colore="green"
                  />
                </div>

                <div>
                  <IconBooleanField
                    nomeTabella="preventivi"
                    nomeCampo="archiviato"
                    uuidRecord={idPreventivo}
                    icona={RiArchiveDrawerFill}
                    colore="yellow"
                    setUpdate={setUpdate}
                  />
                </div>
                {p.accettato &&
                <div>
                  <DownloadContrattoPdfButton idPreventivo={idPreventivo} />
                </div>
                }
                <div>
                  <DeleteRecordWithCheck
                    nomeTabella="preventivi"
                    uuidRecord={idPreventivo}
                    campoData="data_evento"
                    accettato="accettato"
                    setUpdate={setUpdate}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}