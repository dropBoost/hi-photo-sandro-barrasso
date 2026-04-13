"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { createPreventivoAction } from "./createPreventivoAction";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EVENTI_PREDEFINITI = [
  "matrimonio",
  "compleanno",
  "battesimo",
  "comunione",
  "cresima",
  "festa privata",
  "evento aziendale",
  "cerimonia",
  "laurea",
  "altro",
];

const initialForm = {
  id_cliente: "",
  oggetto: "",
  location: "",
  location_citta: "",
  evento: "",
  descrizione: "",
  data_evento: "",
  scadenza_preventivo: "",
};

export default function FormCreatePreventivo() {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState(initialForm);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [clienti, setClienti] = useState([]);
  const [loadingClienti, setLoadingClienti] = useState(true);
  const [openCliente, setOpenCliente] = useState(false);

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  useEffect(() => {
    async function fetchClienti() {
      setLoadingClienti(true);

      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("clienti_anagrafica")
        .select("id, nome, cognome, email, telefono")
        .order("cognome", { ascending: true })
        .order("nome", { ascending: true });

      if (error) {
        console.error("Errore caricamento clienti:", error.message);
        setClienti([]);
        setLoadingClienti(false);
        return;
      }

      setClienti(data ?? []);
      setLoadingClienti(false);
    }

    fetchClienti();
  }, []);

  const clienteSelezionato = useMemo(() => {
    return clienti.find((cliente) => cliente.id === form.id_cliente) || null;
  }, [clienti, form.id_cliente]);

  function formatClienteLabel(cliente) {
    const nomeCompleto = [cliente?.nome, cliente?.cognome].filter(Boolean).join(" ");
    const dettagli = [cliente?.email, cliente?.telefono].filter(Boolean).join(" • ");

    if (nomeCompleto && dettagli) return `${nomeCompleto} — ${dettagli}`;
    if (nomeCompleto) return nomeCompleto;
    if (dettagli) return dettagli;

    return cliente?.id || "Cliente";
  }

  function handleSubmit(e) {
    e.preventDefault();

    setMsg("");
    setError("");

    startTransition(async () => {
      const res = await createPreventivoAction(form);

      if (!res?.success) {
        setError(res?.error || "Errore durante il salvataggio.");
        return;
      }

      setMsg("Preventivo inserito con successo.");
      setForm(initialForm);
      setOpenCliente(false);
    });
  }

  return (
    <Card className="w-full max-w-4xl rounded-2xl">
      <CardHeader>
        <CardTitle>Nuovo preventivo</CardTitle>
        <CardDescription>
          Compila i campi per inserire un nuovo record nella tabella preventivi.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="cliente">Cliente</Label>

              <Popover open={openCliente} onOpenChange={setOpenCliente}>
                <PopoverTrigger asChild>
                  <Button
                    id="cliente"
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCliente}
                    className="w-full justify-between font-normal"
                    disabled={loadingClienti}
                  >
                    {loadingClienti ? (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Caricamento clienti...
                      </span>
                    ) : clienteSelezionato ? (
                      <span className="truncate">
                        {formatClienteLabel(clienteSelezionato)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Seleziona un cliente
                      </span>
                    )}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput placeholder="Cerca cliente..." />
                    <CommandList>
                      <CommandEmpty>Nessun cliente trovato.</CommandEmpty>

                      <CommandGroup>
                        {clienti.map((cliente) => {
                          const nomeCompleto = [cliente.nome, cliente.cognome]
                            .filter(Boolean)
                            .join(" ");

                          const secondRow = [cliente.email, cliente.telefono]
                            .filter(Boolean)
                            .join(" • ");

                          return (
                            <CommandItem
                              key={cliente.id}
                              value={`${cliente.nome || ""} ${cliente.cognome || ""} ${cliente.email || ""} ${cliente.telefono || ""}`}
                              onSelect={() => {
                                setField("id_cliente", cliente.id);
                                setOpenCliente(false);
                              }}
                              className="flex items-start gap-2 py-3"
                            >
                              <Check
                                className={cn(
                                  "mt-0.5 h-4 w-4 shrink-0",
                                  form.id_cliente === cliente.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />

                              <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-medium">
                                  {nomeCompleto || "Cliente senza nome"}
                                </span>

                                {secondRow ? (
                                  <span className="truncate text-xs text-muted-foreground">
                                    {secondRow}
                                  </span>
                                ) : null}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="oggetto">Oggetto</Label>
              <Input
                id="oggetto"
                value={form.oggetto}
                onChange={(e) => setField("oggetto", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location_citta">Città location</Label>
              <Input
                id="location_citta"
                value={form.location_citta}
                onChange={(e) => setField("location_citta", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="evento">Evento</Label>
              <Select
                value={form.evento}
                onValueChange={(value) => setField("evento", value)}
              >
                <SelectTrigger id="evento" className="w-full">
                  <SelectValue placeholder="Seleziona un evento" />
                </SelectTrigger>
                <SelectContent>
                  {EVENTI_PREDEFINITI.map((evento) => (
                    <SelectItem key={evento} value={evento}>
                      {evento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="data_evento">Data evento</Label>
              <Input
                id="data_evento"
                type="date"
                value={form.data_evento}
                onChange={(e) => setField("data_evento", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scadenza_preventivo">Scadenza preventivo</Label>
              <Input
                id="scadenza_preventivo"
                type="date"
                value={form.scadenza_preventivo}
                onChange={(e) => setField("scadenza_preventivo", e.target.value)}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="descrizione">Descrizione</Label>
              <Textarea
                id="descrizione"
                value={form.descrizione}
                onChange={(e) => setField("descrizione", e.target.value)}
                className="min-h-36"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {msg ? (
            <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
              {msg}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || loadingClienti}>
              {isPending ? "Salvataggio..." : "Salva preventivo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}