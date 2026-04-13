"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createPreventivoItemAction } from "./createPreventivoItemAction";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormCreatePreventiviItem({ preventivi = [], servizi = [] }) {
  const [isPending, startTransition] = useTransition();

  const [idPreventivo, setIdPreventivo] = useState("");
  const [idServizio, setIdServizio] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [sconto, setSconto] = useState("");

  function resetForm() {
    setIdPreventivo("");
    setIdServizio("");
    setPrezzo("");
    setSconto("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id_preventivi", idPreventivo);
    formData.append("id_servizio", idServizio);
    formData.append("prezzo", prezzo);
    formData.append("sconto", sconto);

    startTransition(async () => {
      const res = await createPreventivoItemAction(formData);

      if (!res?.success) {
        toast.error(res?.error || "Errore durante il salvataggio.");
        return;
      }

      toast.success(res.message || "Salvataggio completato.");
      resetForm();
    });
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Nuova voce preventivo</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label>Preventivo</Label>
            <Select value={idPreventivo} onValueChange={setIdPreventivo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona un preventivo" />
              </SelectTrigger>
              <SelectContent>
                {preventivi.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {`${item.cliente.nome || ""} ${item.cliente.cognome || ""} - ${item.data_evento}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Servizio</Label>
            <Select value={idServizio} onValueChange={setIdServizio}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona un servizio" />
              </SelectTrigger>
              <SelectContent>
                {servizi.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {`${item.nome_servizio}${item.categoria ? ` (${item.categoria})` : ""}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prezzo">Prezzo</Label>
            <Input
              id="prezzo"
              name="prezzo"
              type="number"
              step="0.01"
              value={prezzo}
              onChange={(e) => setPrezzo(e.target.value)}
              placeholder="Es. 100.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sconto">Sconto (%)</Label>

            <div className="relative">
              <Input
                id="sconto"
                name="sconto"
                type="number"
                min="0"
                max="100"
                step="1"
                value={sconto}
                onChange={(e) => setSconto(e.target.value)}
                placeholder="Es. 10"
                className="pr-8"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvataggio..." : "Salva"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}