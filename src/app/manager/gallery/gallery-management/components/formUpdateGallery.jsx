"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateGalleryAction } from "../action/updateGalleryAction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function FormUpdateGallery({
  gallery,
  revalidate = [],
}) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!gallery?.uuid) return;

    setTitle(gallery?.title || "");
    setDescription(gallery?.description || "");
    setLocation(gallery?.location || "");
    setEventDate(
      gallery?.event_date ? String(gallery.event_date).slice(0, 10) : ""
    );
    setActive(Boolean(gallery?.active));
  }, [gallery]);

  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateGalleryAction({
        uuid: gallery?.uuid,
        title,
        description,
        location,
        event_date: eventDate || null,
        active,
        revalidate,
      });

      if (!res?.ok) {
        toast.error(res?.error || "Errore durante l'aggiornamento.");
        return;
      }

      toast.success("Gallery aggiornata correttamente.");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Titolo</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo gallery"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Luogo evento"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="event_date">Data evento</Label>
          <Input
            id="event_date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione gallery"
          className="min-h-32"
        />
      </div>

      <div className="flex flex-row items-center justify-between rounded-xl border p-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Gallery attiva</span>
          <span className="text-xs text-muted-foreground">
            Abilita o disabilita la visibilità della gallery
          </span>
        </div>

        <Switch checked={active} onCheckedChange={setActive} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !gallery?.uuid}>
          {isPending ? "Salvataggio..." : "Aggiorna gallery"}
        </Button>
      </div>
    </form>
  );
}