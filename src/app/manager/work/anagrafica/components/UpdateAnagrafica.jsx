"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function COMPupdateAnagrafica({ data, setOnUpdate }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    cap: "",
    citta: "",
    codice_fiscale: "",
    cognome: "",
    email: "",
    indirizzo: "",
    nome: "",
    provincia: "",
    telefono: "",
  });

  useEffect(() => {
    if (!data) return;

    setForm({
      cap: data.cap || "",
      citta: data.citta || "",
      codice_fiscale: data.codice_fiscale || "",
      cognome: data.cognome || "",
      email: data.email || "",
      indirizzo: data.indirizzo || "",
      nome: data.nome || "",
      provincia: data.provincia || "",
      telefono: data.telefono || "",
    });
  }, [data]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!data?.id) {
      toast.error("ID cliente non trovato");
      return;
    }

    const codiceFiscalePulito = form.codice_fiscale.trim();

    if (codiceFiscalePulito && codiceFiscalePulito.length !== 16) {
      toast.error("Il codice fiscale deve contenere esattamente 16 caratteri");
      return;
    }

    try {
      setSaving(true);

      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase
        .from("clienti_anagrafica")
        .update({
          cap: form.cap,
          citta: form.citta,
          codice_fiscale: form.codice_fiscale,
          cognome: form.cognome,
          email: form.email,
          indirizzo: form.indirizzo,
          nome: form.nome,
          provincia: form.provincia,
          telefono: form.telefono,
        })
        .eq("id", data.id);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Cliente aggiornato con successo");
      setOpen(false);

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Errore durante l'aggiornamento");
    } finally {
      setSaving(false);
      setOnUpdate(count => count+1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="icon" size="xs" className={`bg-amber-600 hover:bg-amber-700`}>
          <Pencil className="text-neutral-100"/>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-175">
        <DialogHeader>
          <DialogTitle>Modifica cliente</DialogTitle>
          <DialogDescription>
            Aggiorna i dati anagrafici del cliente selezionato.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                <Input
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cognome">Cognome</FieldLabel>
                <Input
                  id="cognome"
                  name="cognome"
                  value={form.cognome}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="codice_fiscale">Codice fiscale</FieldLabel>
                <Input
                  id="codice_fiscale"
                  name="codice_fiscale"
                  value={form.codice_fiscale}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="telefono">Telefono</FieldLabel>
                <Input
                  id="telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="indirizzo">Indirizzo</FieldLabel>
                <Input
                  id="indirizzo"
                  name="indirizzo"
                  value={form.indirizzo}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="citta">Città</FieldLabel>
                <Input
                  id="citta"
                  name="citta"
                  value={form.citta}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="provincia">Provincia</FieldLabel>
                <Input
                  id="provincia"
                  name="provincia"
                  value={form.provincia}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cap">CAP</FieldLabel>
                <Input
                  id="cap"
                  name="cap"
                  value={form.cap}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  "Salva modifiche"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}