"use client";

import { useState, useTransition } from "react";
import { createPreventivoAnagraficaAction } from "./createPreventivoAnagraficaAction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categoriePredefinite = [
  "fotografia",
  "video",
  "stampa",
  "pacchetti",
  "altro",
];

export default function FormAnagraficaServizi() {
  const [isPending, startTransition] = useTransition();

  const [nomeServizio, setNomeServizio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setMsg("");
    setError("");

    startTransition(async () => {
      const res = await createPreventivoAnagraficaAction({
        nome_servizio: nomeServizio,
        categoria,
        descrizione,
      });

      if (!res?.success) {
        setError(res?.error || "Errore durante il salvataggio.");
        return;
      }

      setMsg("Servizio inserito con successo.");
      setNomeServizio("");
      setCategoria("");
      setDescrizione("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="nome_servizio">Nome servizio</Label>
        <Input
          id="nome_servizio"
          value={nomeServizio}
          onChange={(e) => setNomeServizio(e.target.value)}
          placeholder="Es. Realizzazione sito vetrina"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleziona una categoria" />
          </SelectTrigger>
          <SelectContent>
            {categoriePredefinite.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="descrizione">Descrizione</Label>
        <Textarea
          id="descrizione"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          placeholder="Descrivi il servizio..."
          className="min-h-32"
        />
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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvataggio..." : "Aggiungi servizio"}
        </Button>
      </div>
    </form>
  );
}