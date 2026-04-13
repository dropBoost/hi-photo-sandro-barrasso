"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge"
import DeleteSingleRecordButton from "@/components/deleteRecord/DeleteSingleRecordButton";
import { GrPowerCycle } from "react-icons/gr";
import { Separator } from "@/components/ui/separator";
import { FaRectangleList } from "react-icons/fa6";
import { MdCloudDownload } from "react-icons/md";
import DownloadPreventivoPdfButton from "@/components/pdfPreventivo/DownloadPreventive";
import { useSettings } from "@/settings/settingsProvider";


export default function ElencoPreventivoItem() {

  const [preventivi, setPreventivi] = useState([]);
  const [idPreventivo, setIdPreventivo] = useState("");
  const [items, setItems] = useState([]);
  const [updateItems, setUpdateItems] = useState(0);
  const [loadingPreventivi, setLoadingPreventivi] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState("");
  const [openPreventivo, setOpenPreventivo] = useState(false);
  const [totalePreventivo, setTotalePreventivo] = useState(0);
  const [totalePreventivoScontato, setTotalePreventivoScontato] = useState(0);
  const settings = useSettings();

  useEffect(() => {
    async function fetchPreventivi() {
      setLoadingPreventivi(true);
      setError("");

      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("preventivi")
        .select(`*,
          cliente:clienti_anagrafica(*)`)
        .order("id", { ascending: true });

      if (error) {
        setError(error.message);
        setPreventivi([]);
      } else {
        setPreventivi(data || []);
      }

      setLoadingPreventivi(false);
    }

    fetchPreventivi();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      if (!idPreventivo) {
        setItems([]);
        setTotalePreventivo(0)
        setTotalePreventivoScontato(0);
        return;
      }

      setLoadingItems(true);
      setError("");

      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("preventivi_item")
        .select(`
          *,
          intestatario:preventivi(*),
          preventivi_servizi (
            id,
            nome_servizio,
            categoria,
            descrizione
          )
        `)
        .eq("id_preventivi", idPreventivo)
        .order("id", { ascending: true });

      if (error) {
        setError(error.message);
        setItems([]);
        setTotalePreventivo(0)
        setTotalePreventivoScontato(0);
      } else {
        const rows = data || [];
        setItems(rows);

        const sommaPrezziScontato = rows.reduce((tot, item) => {
          return tot + (item.prezzo - ((item.sconto/100)*item.prezzo));
        }, 0);

        const sommaPrezzi = rows.reduce((tot, item) => {
          return tot + (item.prezzo || 0);
        }, 0);

        setTotalePreventivo(sommaPrezzi.toFixed(2))
        setTotalePreventivoScontato(sommaPrezziScontato.toFixed(2));
      }

      setLoadingItems(false);
    }

    fetchItems();
  }, [idPreventivo, updateItems]);


  function ricaricaItems() {
    setUpdateItems((prev) => prev + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-2 h-fit">
        <label className="flex items-center justify-center text-xs font-medium aspect-square h-fit w-8 bg-sky-600 rounded-lg"><FaRectangleList/></label>
        <Popover open={openPreventivo} onOpenChange={setOpenPreventivo}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openPreventivo}
              className="w-[320px] justify-between flex-1 h-full"
            >
              {idPreventivo
                ? (() => {
                    const selected = preventivi.find(
                      (p) => String(p.id) === String(idPreventivo)
                    );
                    return selected
                      ? `${selected.cliente.nome} ${selected.cliente.cognome} ${selected.data_evento}`
                      : "Seleziona un ID";
                  })()
                : "Seleziona un ID"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[320px] p-0">
            <Command>
              <CommandInput placeholder="Cerca preventivo..." />
              <CommandList>
                <CommandEmpty>Nessun preventivo trovato.</CommandEmpty>
                <CommandGroup>
                  {preventivi.map((p) => {
                    const valueLabel = `${p.cliente.nome} ${p.cliente.cognome} ${p.data_evento}`;

                    return (
                      <CommandItem
                        key={p.id}
                        value={`${p.id} ${p.nome} ${p.cognome} ${p.data_evento}`}
                        onSelect={() => {
                          setIdPreventivo(String(p.id));
                          setOpenPreventivo(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            String(idPreventivo) === String(p.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {valueLabel}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button className={`aspect-square h-fit w-8`} onClick={() => ricaricaItems()}><GrPowerCycle className=""/></Button>
        {items.length > 0 ?
        <DownloadPreventivoPdfButton
          idPreventivo={items[0]?.id_preventivi}
        /> : null }
      </div>

      {loadingPreventivi && (
        <div className="p-4 text-sm">Caricamento preventivi...</div>
      )}

      {loadingItems && (
        <div className="p-4 text-sm">Caricamento elementi...</div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-500">Errore: {error}</div>
      )}

      {!loadingItems && idPreventivo && !items.length && !error && (
        <div className="p-4 text-sm">Nessun elemento trovato.</div>
      )}
      <Separator/>
      {totalePreventivo > 0 ?
      <div className="flex items-end justify-end">
        <div className="flex flex-row items-end justify-between gap-2 w-full rounded-xl border bg-white p-2 px-4 shadow-sm dark:bg-neutral-900/10">
          <Badge size="xs" className={`text-[0.6rem]`}>Totale</Badge>
          <div className="flex flex-row items-end justify-end gap-3">
              <span className="text-sm line-through decoration-2 decoration-red-500"> {totalePreventivo}€ </span>
              <span className="font-bold text-sm"> {totalePreventivoScontato == 0 ? "OMAGGIO" : `${totalePreventivoScontato}€`} </span>
          </div>
        </div>
      </div> : null }

      {!!items.length && (
        <div className="space-y-4">
          {items.map((item) => {
            const prezzo = Number(item.prezzo || 0);
            const percentuale = Number(item.sconto || 0);
            const prezzoScontato = prezzo - ((percentuale/100)*prezzo);

            return (
              <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm dark:bg-neutral-900">
                <div className="flex flex-row justify-between">
                  <Badge size="xs" className={`text-[0.6rem]`}>{item.preventivi_servizi?.categoria || "-"}</Badge>
                  <DeleteSingleRecordButton tableName="preventivi_item" columnName="id" uuid={item.id} setUpdate={setUpdateItems}/>
                </div>
                <div className="flex flex-row justify-between gap-2">
                  <div className="flex flex-row gap-3">
                    <div>
                      <span className="text-xs text-neutral-500">Servizio</span>
                      <p className="font-medium text-sm">
                        {item.preventivi_servizi?.nome_servizio || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500">(€) Prezzo</span>
                      <p className="text-sm">€ {prezzo.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500">(%) Sconto</span>
                      <p className="font-medium text-sm text-red-500">{percentuale}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-end">
                    <span className="text-xs text-neutral-500">Totale</span>
                    <span className="font-bold text-sm"> {prezzoScontato == 0 ? "OMAGGIO" : `${prezzoScontato.toFixed(2)}€`} </span>
                  </div>
                </div>
                {item.preventivi_servizi?.descrizione ? 
                <div className="flex flex-row justify-between gap-2">
                  <span className="text-xs text-neutral-500">{item.preventivi_servizi?.descrizione}</span>
                </div> : null }
              </div>
            );

          })}
        </div>
      )}
    </div>
  );
}