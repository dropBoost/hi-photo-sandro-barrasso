"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default function DeleteRecordWithCheck({
  nomeTabella,
  uuidRecord,
  campoData,
  accettato,
  setUpdate,
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!nomeTabella || !uuidRecord || !campoData || !accettato) {
      toast.error("Props mancanti per l'eliminazione.");
      return;
    }

    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
      .from(nomeTabella)
      .select(`id, ${campoData}, ${accettato}`)
      .eq("id", uuidRecord)
      .single();

    if (error) {
      console.error(error);
      toast.error("Errore nel recupero del record.");
      setLoading(false);
      return;
    }

    const dataRecord = data?.[campoData];
    const recordAccettato = data?.[accettato];

    if (recordAccettato === true) {
      toast.error("Questo preventivo non può essere eliminato perché risulta accettato.");
      setLoading(false);
      return;
    }

    if (dataRecord) {
      const oggi = new Date();
      oggi.setHours(0, 0, 0, 0);

      const dataDaControllare = new Date(dataRecord);
      dataDaControllare.setHours(0, 0, 0, 0);

      if (dataDaControllare < oggi) {
        toast.error("Questo preventivo non può essere eliminato perché la data è già passata.");
        setLoading(false);
        return;
      }
    }

    const { error: deleteError } = await supabase
      .from(nomeTabella)
      .delete()
      .eq("id", uuidRecord);

    if (deleteError) {
      console.error(deleteError);
      toast.error("Errore durante l'eliminazione del preventivo.");
    } else {
      toast.success("Preventivo eliminato correttamente.");
    }
    
    if (setUpdate) {
      setUpdate(count => count+1)
    }

    setLoading(false);
    
  }

  return (
    <Button type="button" variant="ghost" size="xs" onClick={handleDelete} disabled={loading}
      className="
        border-brand/30
        text-brand
        hover:bg-brand
        hover:text-white
        disabled:opacity-50
      "
    >
      <Trash2 className="" />
    </Button>
  );
}