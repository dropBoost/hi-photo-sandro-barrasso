"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, UserRound, Mail, Phone, MapPin, WhatsApp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import COMPupdateAnagrafica from "./components/UpdateAnagrafica";
import COMPaddAnagrafica from "./components/AddAnagrafica";
import Link from "next/link";

export default function COMPelencoClientiAnagrafica() {
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");
  const [search, setSearch] = useState("");
  const [onUpdate, setOnUpdate] = useState(0)
  const linkWhatsapp = "https://api.whatsapp.com/send?phone=39"

  useEffect(() => {
    async function fetchClienti() {
      setLoading(true);
      setErrore("");

      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("clienti_anagrafica")
        .select("*")
        .order("cognome", { ascending: true })
        .order("nome", { ascending: true });

      if (error) {
        console.error(error);
        setErrore("Errore nel caricamento dei clienti");
        setClienti([]);
        setLoading(false);
        return;
      }

      setClienti(data ?? []);
      setLoading(false);
    }

    fetchClienti();
  }, [onUpdate]);

  const clientiFiltrati = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return clienti;

    return clienti.filter((cliente) => {
      const nome = cliente?.nome?.toLowerCase() || "";
      const cognome = cliente?.cognome?.toLowerCase() || "";
      const telefono = cliente?.telefono?.toLowerCase() || "";
      const email = cliente?.email?.toLowerCase() || "";

      return (
        nome.includes(q) ||
        cognome.includes(q) ||
        telefono.includes(q) ||
        email.includes(q)
      );
    });
  }, [clienti, search]);

  return (
    <div className="flex flex-col gap-3 w-full h-full rounded-2xl border-border/60">
      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-lg uppercase font-bold">Clienti anagrafica</span>
          <COMPaddAnagrafica setOnUpdate={setOnUpdate}/>
        </div>

        <div className="flex flex-row items-center gap-2 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca per nome, cognome, telefono o email..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4 lg:p-0 p-2">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Caricamento clienti...
          </div>
        ) : errore ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {errore}
          </div>
        ) : clientiFiltrati.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed">
            <UserRound className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nessun cliente trovato
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto">
            <div className="flex flex-col gap-3">
              {clientiFiltrati.map((cliente) => (
                <div key={cliente.id} className="flex flex-row gap-2 border-border/60 shadow-sm transition hover:shadow-md">
                  <div className="flex xl:flex-row flex-col flex-1 xl:gap-4 gap-2 xl:items-center justify-start border px-3 py-2 rounded-md hover:bg-muted transition-all">
                    {/* NOMINATIVO */}
                    <div className="flex flex-row xl:w-60 w-fit xl:items-start items-center gap-3">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {cliente.nome || "-"} {cliente.cognome || ""}
                      </h3>
                    </div>
                    {/* DATI */}
                    <div className="flex lg:flex-row flex-col lg:items-center items-start xl:gap-5 gap-2">
                      <div className="xl:w-40 flex flex-row w-fit items-center gap-2 min-w-0">
                        {cliente.telefono ? (
                          <Link href={`${linkWhatsapp}${cliente.telefono}`} target={"_blank"}>
                            <Badge variant="secondary" className="shrink-0 font-mono border border-green-600">
                              <FaWhatsapp className="h-3 w-3 text-green-600" />
                              {cliente.telefono}
                            </Badge>
                          </Link>
                        ) : null}
                      </div>
                      <div className="2xl:w-80 w-fit flex flex-row items-center gap-2 min-w-0">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs wrap-break-word">
                          {cliente.indirizzo ? `${cliente.indirizzo}` : ""}
                          {cliente.cap ? ` - ${cliente.cap} ` : ""}
                          {cliente.citta || "-"}
                          {cliente.provincia ? ` (${cliente.provincia})` : ""}
                        </p>
                      </div>
                      <div className="flex flex-row w-fit items-center gap-2 min-w-0">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs break-all">
                          {cliente.email || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center xl:justify-center justify-end xl:border-none border p-2 rounded-md">
                    <COMPupdateAnagrafica data={cliente} setOnUpdate={setOnUpdate}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}