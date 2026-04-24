"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DeleteSingleRecordButton from "@/components/deleteRecord/DeleteSingleRecordButton";
import { Button } from "@/components/ui/button";

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
      <div className="flex w-full items-center justify-center rounded-xl border">
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
    <div className="flex flex-col gap-3">
      <Button onClick={() => setUpdate(count => count+1)} className={`w-fit text-[0.6rem] p-2 h-fit bg-brand hover:bg-brand/50 uppercase`}>Aggiorna</Button>
      <div className="grid 2xl:grid-cols-2 gap-3">
        {records.map((item) => (
          <div key={item.uuid || `${item.nome_servizio}-${item.categoria}`} className="flex flex-row border rounded-2xl p-3 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex flex-col gap-2 items-start justify-between w-full h-full">
              <div className="flex flex-col items-start w-full gap-1">
                <div className="flex flex-col items-start justify-start gap-1">
                  <Badge className={`bg-brand text-[0.6rem]`}>{item.categoria}</Badge>
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
    </div>
  );
}