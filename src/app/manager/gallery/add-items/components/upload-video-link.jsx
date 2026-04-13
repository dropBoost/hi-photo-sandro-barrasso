"use client";

import { useEffect, useState } from "react";
import { insertGalleryVideoAction } from "../action/linkVideoGallery.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function COMPuploadLinkVideo() {
  const [open, setOpen] = useState(false);

  const [galleryQuery, setGalleryQuery] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);

  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // fetch galleries (debounce)
  useEffect(() => {
    const t = setTimeout(async () => {
      const res = await fetch(`/api/list-gallery?q=${encodeURIComponent(galleryQuery)}`, { cache: "no-store" });
      const json = await res.json();
      setGalleries(json?.data || []);
    }, 250);
    return () => clearTimeout(t);
  }, [galleryQuery]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!selectedGallery?.uuid) {
      setMsg("Seleziona una gallery.");
      return;
    }
    if (!link.trim()) {
      setMsg("Inserisci un link valido.");
      return;
    }

    setLoading(true);
    try {
      await insertGalleryVideoAction({
        uuid_gallery: selectedGallery.uuid,
        link,
      });

      setMsg("Video salvato ✅");
      setLink("");
    } catch (err) {
      setMsg(err?.message || "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Gallery select */}
      <div className="space-y-2">
        <Label>Gallery</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between">
              {selectedGallery?.title || "Seleziona una gallery..."}
              <span className="opacity-60">⌄</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Cerca per titolo..."
                value={galleryQuery}
                onValueChange={setGalleryQuery}
              />
              <CommandList>
                <CommandEmpty>Nessun risultato.</CommandEmpty>
                <CommandGroup>
                  {galleries.map((g) => (
                    <CommandItem
                      key={g.uuid}
                      value={g.title}
                      onSelect={() => {
                        setSelectedGallery(g);
                        setOpen(false);
                      }}
                      className={cn(selectedGallery?.uuid === g.uuid && "bg-muted")}
                    >
                      {g.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Link input */}
      <div className="space-y-2">
        <Label>Link video</Label>
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=... o link mp4"
        />
      </div>

      {msg ? <div className="text-sm">{msg}</div> : null}

      <Button disabled={loading} type="submit" className="w-full">
        {loading ? "Salvo..." : "Salva video"}
      </Button>
    </form>
  );
}