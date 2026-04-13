"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Separator } from "@/components/ui/separator";
import { FormatDate } from "@/components/formatDate";
import COMPaddPreventivoAcconto from "../components/addAcconto";
import DeleteAcconto from "@/components/deleteAcconto/deleteAcconto";
import DownloadSchedaAcconti from "@/components/pdfSchedaAcconti/DownloadSchedaAcconti";

export default function PreventivoAcconti({ idpreventivo }) {

  const [items, setItems] = useState([]);
  const [acconti, setAcconti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totale, setTotale] = useState(0);
  const [loadingAcconti, setLoadingAcconti] = useState(true);
  const [error, setError] = useState("");
  const [errorAcconti, setErrorAcconti] = useState("");
  const [update, setUpdate] = useState(0)

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

  const { groupedItems, totaleMap } = useMemo(() => {
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

    return {
      groupedItems: Object.entries(grouped),
      totaleMap: grouped,
    };
  }, [items]);

  useEffect(() => {
    async function fetchAcconti() {
      setLoadingAcconti(true);
      setErrorAcconti("");

      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("preventivi_acconti")
        .select("*")
        .eq("id_preventivo", idpreventivo)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorAcconti(error.message);
        setAcconti([]);
      } else {
        setAcconti(data || []);
      }

      setLoadingAcconti(false);
    }

    if (idpreventivo) {
      fetchAcconti();
    }
  }, [idpreventivo, update]);

  const totalePreventivo = useMemo(() => {
    return Number(totaleMap?.[idpreventivo]?.totale || 0);
  }, [totaleMap, idpreventivo]);

  const totaleAcconti = useMemo(() => {
    return acconti.reduce((totale, item) => {
      return totale + Number(item.acconto || 0);
    }, 0);
  }, [acconti]);

  const restaTotale = useMemo(() => {
    return totalePreventivo - totaleAcconti;
  }, [totalePreventivo, totaleAcconti]);
  
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
    <div className="flex flex-col gap-6 xl:max-w-6xl w-full border h-full rounded-lg">
      {groupedItems.map(([id, gruppo]) => {
        const p = gruppo.preventivo;

        return (
        <div key={id} className="flex flex-col gap-5 rounded-lg p-6">
          {/* DATI EVENTO */}
          <div className="flex flex-col gap-5">
            <div className="bg-brand flex flex-row items-center justify-between p-2 rounded-lg">
              <div className="flex flex-row gap-1 items-center">
                <DownloadSchedaAcconti idPreventivo={id}/>
                <h2 className="text-xs font-semibold">SCHEDA ACCONTI</h2>
              </div>
              <COMPaddPreventivoAcconto idpreventivo={id} setUpdate={setUpdate} restaTotale={restaTotale}/>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 bg-muted w-full text-sm">
              <div className="flex xl:flex-row flex-col xl:gap-5 gap-1">
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Nome:</span>{" "}
                  {p?.cliente?.nome || "-"}
                </div>
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Cognome:</span>{" "}
                  {p?.cliente?.cognome || "-"}
                </div>
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Email:</span>{" "}
                  {p?.cliente?.email || "-"}
                </div>
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Telefono:</span>{" "}
                  {p?.cliente?.telefono || "-"}
                </div>
              </div>
              <Separator/>
              <div className="flex xl:flex-row flex-col xl:gap-5 gap-1">
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Oggetto:</span>{" "}
                  {p?.oggetto || "-"}
                </div>
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Evento:</span>{" "}
                  {p?.evento || "-"}
                </div>
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Location:</span>{" "}
                  {p?.location || "-"}
                </div>
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Città location:</span>{" "}
                  {p?.location_citta || "-"}
                </div>
                <div className="flex flex-row items-center justify-start gap-1">
                  <span className="font-semibold">Data evento:</span>{" "}
                  {p?.data_evento
                    ? new Date(p.data_evento).toLocaleDateString("it-IT")
                    : "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-xs bg-muted px-5 py-1 rounded-full">SERVIZI</span>
            <Separator className={`flex-1`}/>
          </div>
          {/* DATI SERVIZI */}
          <div className="flex flex-col gap-2">
            {gruppo.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-lg border border-neutral-400 p-3">
                <div className="flex flex-row gap-5 items-center justify-between">
                  <div className="text-xs font-semibold truncate"> {item.preventivi_servizi?.nome_servizio || "-"} </div>
                  <div className="text-xs text-neutral-500 truncate"> Categoria: {item.preventivi_servizi?.categoria || "-"} </div>
                </div>
                <Separator/>
                <div className="flex flex-row items-start justify-between gap-2 text-sm">
                  <div className="flex flex-row gap-2">
                    <div className="flex lg:flex-row flex-col gap-1 items-start justify-start">
                      <span className="font-semibold">Prezzo:</span>
                      <span className="">€{Number(item.prezzo || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex lg:flex-row flex-col gap-1 items-start justify-start">
                      <span className="font-semibold">Sconto:</span>
                      {Number(item.sconto || 0).toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex lg:flex-row flex-col gap-1 items-end justify-start">
                    <span className="font-semibold">Totale servizio:</span>
                    € {item.totaleRiga.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* TOTALE PREVENTIVO */}
          <div className="flex justify-end rounded-lg bg-neutral-950 px-5 py-3 font-semibold text-white w-full text-sm">
            Totale preventivo: € {gruppo.totale.toFixed(2)}
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-xs bg-muted px-5 py-1 rounded-full">ACCONTI</span>
            <Separator className={`flex-1`}/>
          </div>
          {/* ELENCO ACCONTI */}
          <div className="flex flex-col justify-start gap-3">
            {acconti.map((a,idx) => {
              return (
                <div key={idx} className="flex flex-row items-center gap-1">
                  <div className="flex flex-col flex-1 border rounded-lg px-5 py-3">
                    <div className="flex flex-row gap-2 text-sm">
                      <div className="flex flex-row gap-1">
                        <span>Acconto:</span>
                        <span className="font-semibold">€{a.acconto.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-row gap-1">
                        <span>Data:</span>
                        <span className="font-semibold">{FormatDate(a.created_at)}</span>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {a.nota}
                    </span>
                  </div>
                  <div>
                    <DeleteAcconto idRecord={a.id} nomeTabella="preventivi_acconti" nomeCampoId="id" setUpdate={setUpdate}/>
                  </div>
                </div>
            )
            })}
            {/* TOTALE ACCONTI / SALDO */}
            <div className="flex flex-row justify-between rounded-lg bg-neutral-950 px-5 py-3 font-semibold text-white w-full text-sm">
              <div>
                Totale Acconti: € {totaleAcconti.toFixed(2)}
              </div>
              <div>
                Saldo: € {restaTotale.toFixed(2)}
              </div>
            </div>
          <div className="flex flex-col justify-start gap-3">
        </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}