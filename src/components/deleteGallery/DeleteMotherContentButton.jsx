"use client";

import { useTransition } from "react";
import { deleteMotherContentAction } from "./deleteMotherContentAction";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import DialogConfirm from "../dialogConfirm/dialogConfirm";

export default function DeleteMotherContentButton({

  uuid,
  bucket,
  motherTable,
  contentTable,
  motherIdColumn,
  contentForeignKeyColumn,
  onDeleted,
  setUpdate

}) {

  const [pending, startTransition] = useTransition();

  function handleDelete() {

    startTransition(async () => {

      const res = await deleteMotherContentAction({

        uuid,
        bucket,

        motherTable,
        contentTable,

        motherIdColumn,
        contentForeignKeyColumn,

      });

      if (res.success) {
        if (onDeleted) onDeleted();
        setUpdate(prev => prev+1)
      } else {
        alert(res.message);
      }

    });


  }

  return (

    <DialogConfirm title="Elimina Gallery"
    description="Vuoi eliminare definitivamente tutta la gallery? Questa azione è irreversibile. Gli eventuali eventi con QR code associati non saranno più accessibili."
    labelCancel="Annulla" labelConfirm="Conferma" onConfirm={handleDelete} loading={pending}
      trigger={
        <Button
          size="xs"
          disabled={pending}
          className={`bg-red-500`}
        >
          {pending ? "Eliminazione..." : <FaTrash className="text-xs"/>}
        </Button>
      }
    />

  );

}