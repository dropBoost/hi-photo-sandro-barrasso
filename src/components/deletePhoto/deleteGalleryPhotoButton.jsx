"use client";

import { useTransition } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteGalleryPhotoAction } from "./deleteGalleryPhotoAction";
import { reorderGalleryPhotosAction } from "@/app/manager/gallery/gallery-management/action/reorderGalleryPhoto.action";
import { reorderEventPhotosAction } from "@/app/manager/event/event-management/action/reorderEventPhoto.action";
import DialogConfirm from "../dialogConfirm/dialogConfirm";

export default function DeleteGalleryPhotoButton({
  uuid,
  uuidGallery,
  uuidEvent,
  bucket,
  link,
  revalidate = [],
  size = "xs",
  children,
  tablePhoto,
  onDeleted,
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    
    startTransition(async () => {
      const res = await deleteGalleryPhotoAction({
        uuid,
        link,
        revalidate,
        bucket,
        tablePhoto,
      });

      if (!res?.ok) {
        toast.error(res?.error || "Errore durante l'eliminazione.");
        return;
      }

      if (tablePhoto === "gallery_photo" && uuidGallery) {
        const reorderRes = await reorderGalleryPhotosAction(uuidGallery);

        if (!reorderRes?.success) {
          toast.error(reorderRes?.error || "Errore nel riordino automatico.");
          return;
        }
      }

      if (tablePhoto === "event_photo" && uuidEvent) {
        const reorderRes = await reorderEventPhotosAction(uuidEvent);

        if (!reorderRes?.success) {
          toast.error(reorderRes?.error || "Errore nel riordino automatico.");
          return;
        }
      }

      if (onDeleted) {
        onDeleted(uuid);
      }

      toast.success("Immagine eliminata correttamente.");
    });
  };

  return (
    <DialogConfirm title="Vuoi Eliminare questa foto?" description={"Eliminando questa foto non potrai più recuperarla"} labelCancel={"Annulla"} labelConfirm={"Elimina"} onConfirm={handleDelete} loading={isPending} trigger={
      <Button
        className="flex flex-row items-center gap-1 border bg-red-500 hover:text-red-800"
        variant="ghost"
        size={size}
      >
        <span className="text-[0.9rem]">
          <FaTrash className="text-white hover:text-red-800" />
        </span>
      </Button>
    }/>
  );
}