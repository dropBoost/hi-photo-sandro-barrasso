"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import DialogConfirm from "../dialogConfirm/dialogConfirm";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default function DeleteAcconto({ idRecord, nomeTabella, className = "", disabled = false, setUpdate }) {
  
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!idRecord || !nomeTabella) {
      toast.error("Parametri mancanti per l'eliminazione");
      return;
    }

    try {
      setLoading(true);

      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase
        .from(nomeTabella)
        .delete()
        .eq("id", idRecord);

      if (error) {
        toast.error(error.message || "Errore durante l'eliminazione");
        return;
      }

      toast.success("Acconto eliminato con successo");
      setUpdate((count) => count + 1);
    } catch (err) {
      toast.error("Errore imprevisto durante l'eliminazione");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogConfirm title="Elimina acconto" description="Vuoi davvero eliminare questo acconto?" labelCancel="Annulla" labelConfirm="Elimina" onConfirm={handleDelete} loading={loading}
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={loading || disabled}
          className={`border-brand/30 text-brand hover:bg-brand hover:text-white disabled:opacity-50 ${className}`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FaTrash />
          )}
        </Button>
      }
    />
  );
}