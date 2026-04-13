"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";

const initialForm = {
  nome: "",
  cognome: "",
  codice_fiscale: "",
  indirizzo: "",
  citta: "",
  provincia: "",
  cap: "",
  telefono: "",
  email: "",
};

export default function COMPaddAnagrafica({ onSuccess, setOnUpdate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "codice_fiscale") {
      nextValue = value.toUpperCase().replace(/\s/g, "").slice(0, 16);
    }

    if (name === "provincia") {
      nextValue = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
    }

    if (name === "cap") {
      nextValue = value.replace(/\D/g, "").slice(0, 5);
    }

    if (name === "telefono") {
      nextValue = value.replace(/[^\d+ ]/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function validateForm() {
    if (!form.nome.trim()) {
      toast.error("Il nome è obbligatorio");
      return false;
    }

    if (!form.cognome.trim()) {
      toast.error("Il cognome è obbligatorio");
      return false;
    }

    if (form.codice_fiscale.trim().length !== 16) {
      toast.error("Il codice fiscale deve contenere esattamente 16 caratteri");
      return false;
    }

    if (form.provincia.trim().length !== 2) {
      toast.error("La provincia deve contenere esattamente 2 caratteri");
      return false;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Inserisci un'email valida");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const payload = {
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        codice_fiscale: form.codice_fiscale.trim().toUpperCase(),
        indirizzo: form.indirizzo.trim(),
        citta: form.citta.trim(),
        provincia: form.provincia.trim().toUpperCase(),
        cap: form.cap.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim().toLowerCase(),
      };

      const { data, error } = await supabase
        .from("clienti_anagrafica")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error(error);
        toast.error("Errore durante il salvataggio del cliente");
        return;
      }

      toast.success("Cliente salvato correttamente");
      setForm(initialForm);
      setOpen(false);

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Si è verificato un errore imprevisto");
    } finally {
      setLoading(false);
      setOnUpdate(count => count+1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`text-xs hover:bg-green-900 hover:text-white`} size="xs">
          <Plus className=" h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nuovo cliente</DialogTitle>
          <DialogDescription>
            Inserisci i dati anagrafici del cliente
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Mario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cognome">Cognome</Label>
            <Input
              id="cognome"
              name="cognome"
              value={form.cognome}
              onChange={handleChange}
              placeholder="Rossi"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="codice_fiscale">Codice fiscale</Label>
            <Input
              id="codice_fiscale"
              name="codice_fiscale"
              value={form.codice_fiscale}
              onChange={handleChange}
              placeholder="RSSMRA80A01H501U"
              maxLength={16}
              required
            />
            <p className="text-xs text-muted-foreground">
              Deve contenere esattamente 16 caratteri ed è salvato in maiuscolo.
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="indirizzo">Indirizzo</Label>
            <Input
              id="indirizzo"
              name="indirizzo"
              value={form.indirizzo}
              onChange={handleChange}
              placeholder="Via Roma 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="citta">Città</Label>
            <Input
              id="citta"
              name="citta"
              value={form.citta}
              onChange={handleChange}
              placeholder="Milano"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincia">Provincia</Label>
            <Input
              id="provincia"
              name="provincia"
              value={form.provincia}
              onChange={handleChange}
              placeholder="MI"
              maxLength={2}
              required
            />
            <p className="text-xs text-muted-foreground">
              Deve contenere 2 caratteri ed è salvata in maiuscolo.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cap">CAP</Label>
            <Input
              id="cap"
              name="cap"
              value={form.cap}
              onChange={handleChange}
              placeholder="20100"
              maxLength={5}
              inputMode="numeric"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+39 333 1234567"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="cliente@email.it"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-40">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva cliente"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}