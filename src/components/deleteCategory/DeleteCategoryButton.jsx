"use client";

import { useState, useTransition } from "react";
import { FaTrash } from "react-icons/fa";
import { deleteCategoryAction } from "./deleteCategoryAction";
import { Button } from "../ui/button";
import DialogConfirm from "../dialogConfirm/dialogConfirm";
import DialogInfo from "../dialogInfo/dialogInfo";

export default function DeleteCategoryButton({ id, setUpdate, className = "", disabled = false }) {
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    setError(null);

    startTransition(async () => {
      const res = await deleteCategoryAction({ id });

      if (!res?.success) {
        setError(res?.error || "Errore durante l'eliminazione");
      }

      setUpdate(prev=>prev+1)
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <DialogConfirm title="Elimina Categoria" description="Vuoi davvero eliminare questa categoria?" labelCancel="Annulla" labelConfirm="Elimina" onConfirm={handleDelete} loading={isPending}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={isPending || disabled}
            className={`bg-red-700 hover:bg-red-800 hover:text-white text-white disabled:opacity-50 aspect-square ${className}`}
          >            
          {isPending ? "Eliminazione..." : <FaTrash className="h-4 w-4" />}
          </Button>
        }
      />
      

      <DialogInfo
        open={!!error}
        onOpenChange={(open) => {
          if (!open) setError(null);
        }}
        title="Errore Eliminazione"
        description="Categoria impossibile da eliminare"
        body={error}
        labelClose="Chiudi"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}