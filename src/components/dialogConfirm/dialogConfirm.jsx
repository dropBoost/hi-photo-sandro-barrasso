"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DialogConfirm({
  title,
  description,
  labelCancel,
  labelConfirm,
  onConfirm,
  trigger,
  loading = false,
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title || "Titolo"}</DialogTitle>
          <DialogDescription>
            {description || "Aggiungi qui la richiesta"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {labelCancel || "Annulla"}
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {labelConfirm || "Conferma"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}