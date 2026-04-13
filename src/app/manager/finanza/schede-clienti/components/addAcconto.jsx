"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

const initialForm = {
  acconto: "",
  nota: "",
};

export default function COMPaddPreventivoAcconto({ idpreventivo, setUpdate, restaTotale }) {

  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "acconto") {
      nextValue = value.replace(",", ".");
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function validateForm() {

    const acconto = Number(form.acconto);
    const maxAcconto = Number(restaTotale);

    if (!idpreventivo) {
      toast.error("ID preventivo non valido");
      return false;
    }

    if (!acconto || isNaN(Number(acconto))) {
      toast.error("Inserisci un importo valido per l'acconto");
      return false;
    }

    if (Number(acconto) <= 0) {
      toast.error("L'acconto deve essere maggiore di zero");
      return false;
    }

    if (Number(acconto) > maxAcconto) {
      toast.error(`puoi inserire un acconto massimo di €${maxAcconto.toFixed(2)} al saldo`)
      return false
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
        id_preventivo: idpreventivo,
        acconto: Number(form.acconto),
        nota: form.nota.trim(),
      };

      const { data, error } = await supabase
        .from("preventivi_acconti")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("Errore Supabase:", error);
        toast.error(error.message || "Errore durante il salvataggio dell'acconto");
        return;
      }

      toast.success("Acconto salvato correttamente");

      setForm(initialForm);
      setOpenDialog(false);

    } catch (err) {
      console.error(err);
      toast.error("Si è verificato un errore imprevisto");
    } finally {
      setUpdate(count => count+1)
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(value) => {
        setOpenDialog(value);

        if (!value) {
          setForm(initialForm);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className={`text-xs hover:bg-muted hover:text-white`} size="xs">
          <Plus className=" h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nuovo acconto preventivo</DialogTitle>
          <DialogDescription>
            Inserisci i dati dell'acconto per questo preventivo
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none p-5">
          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <Label htmlFor="acconto">Acconto</Label>
                <Input
                  id="acconto"
                  name="acconto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.acconto}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
                <span>max. €{restaTotale}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nota">Nota</Label>
                <Textarea
                  id="nota"
                  name="nota"
                  value={form.nota}
                  onChange={handleChange}
                  placeholder="Inserisci una nota"
                  rows={5}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="min-w-40">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    "Salva acconto"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}