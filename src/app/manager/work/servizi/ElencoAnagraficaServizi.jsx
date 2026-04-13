"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DeleteSingleRecordButton from "@/components/deleteRecord/DeleteSingleRecordButton";

export default function ElencoAnagraficaServizi() {
  const [records, setRecords] = useState([]);
  const [update, setUpdate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchRecords() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("preventivi_servizi")
        .select("*")
        .order("nome_servizio", { ascending: true });

      if (error) {
        setError(error.message);
        setRecords([]);
      } else {
        setRecords(data || []);
      }

      setLoading(false);
    }

    fetchRecords();
  }, [update]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border p-6">
        <span className="text-sm text-muted-foreground">
          Caricamento servizi...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
        Errore durante il caricamento: {error}
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        Nessun record presente nella tabella preventivi_servizi.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap">
      {records.map((item) => (
        <div key={item.uuid || `${item.nome_servizio}-${item.categoria}`} className="flex flex-row basis-2/6 p-2">
          <div className="flex flex-col gap-6 items-start justify-between w-full h-full border rounded-2xl p-5">
            <div className="flex flex-col items-start w-full gap-2">
              <div className="flex flex-col items-start justify-start gap-1">
                <Badge variant="secondary">{item.categoria}</Badge>
                <p className="font-semibold runcate overflow-hidden">{item.nome_servizio}</p>
              </div>
              <Separator/>
              <div className="text-sm max-h-70 text-muted-foreground whitespace-pre-line overflow-auto pe-5 text-justify">
                {item.descrizione || "Nessuna descrizione disponibile."}
              </div>
            </div>
            <div className={`flex flex-row justify-end w-full px-3 py-1`}>
              <DeleteSingleRecordButton tableName={"preventivi_servizi"} columnName={"id"} uuid={item.id} setUpdate={setUpdate}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}