"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { deleteSingleRecordAction } from "./deleteSingleRecordAction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DialogConfirm from "../dialogConfirm/dialogConfirm";
import DialogInfo from "../dialogInfo/dialogInfo";

export default function DeleteSingleRecordButton({
  tableName,
  columnName,
  uuid,
  label = "Elimina",
  askConfirm = true,
  refreshOnDelete = true,
  onDeleted,
  setUpdate,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleDelete() {

    setMessage("");

    startTransition(async () => {
      const result = await deleteSingleRecordAction({
        tableName,
        columnName,
        uuid,
      });

      setMessage(result.message);

      if (result.success) {
        if (onDeleted) onDeleted(result);
        if (refreshOnDelete) router.refresh();
        if (setUpdate) setUpdate(prev => prev+1);
        toast.success(result.message || "Eliminato");
      }

    });
  }

  return (
    <div className="flex flex-col gap-2">
      <DialogConfirm title={"Vuoi eliminare questo elemento?"} description={"Questa azione è irreversibile, se confermi non potrà più essere recuperato"} labelCancel={"Annulla"} labelConfirm={"Elimina"}
      loading={isPending} onConfirm={handleDelete} trigger={
        <Button
          type="button"
          size="xs"
          disabled={isPending}
          className="flex items-center gap-2 text-xs bg-red-500"
        >
        {isPending ? "Eliminazione..." : <FaTrash className=""/>}
        </Button>
      }/>
      <DialogInfo title={"Erorre"} description={message} open={!!message} onOpenChange={(open) => {if (!open) setMessage("")}}/>
    </div>
  );
}