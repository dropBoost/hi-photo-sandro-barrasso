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
} from "@/components/ui/dialog";

export default function DialogInfo({
  open,
  onOpenChange,
  title,
  description,
  body,
  labelClose,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || "Titolo"}</DialogTitle>
          <DialogDescription>
            {description || "Descrizione"}
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <p className="mb-4 leading-normal">{body || null}</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {labelClose || "Chiudi"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}