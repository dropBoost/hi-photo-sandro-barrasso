"use client";

import { useEffect, useState } from "react";
import { insertGalleryVideoEventAction } from "../../add-items-event/action/linkVideoEvent.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function COMPuploadLinkVideoEvent() {
  const [open, setOpen] = useState(false);

  const [albumQuery, setAlbumQuery] = useState("");
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // fetch albums (debounce)
  useEffect(() => {
    const t = setTimeout(async () => {
      const res = await fetch(`/api/list-event?q=${encodeURIComponent(albumQuery)}`, { cache: "no-store" });
      const json = await res.json();
      setAlbums(json?.data || []);
    }, 250);
    return () => clearTimeout(t);
  }, [albumQuery]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!selectedAlbum?.uuid) {
      setMsg("Seleziona una gallery.");
      return;
    }
    if (!link.trim()) {
      setMsg("Inserisci un link valido.");
      return;
    }

    setLoading(true);
    try {
      await insertGalleryVideoEventAction({
        uuid_event: selectedAlbum.uuid,
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
        <Label>Eventi</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between">
              {selectedAlbum?.title || "Seleziona un Evento..."}
              <span className="opacity-60">⌄</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Cerca per titolo..."
                value={albumQuery}
                onValueChange={setAlbumQuery}
              />
              <CommandList>
                <CommandEmpty>Nessun risultato.</CommandEmpty>
                <CommandGroup>
                  {albums.map((g) => (
                    <CommandItem
                      key={g.uuid}
                      value={g.title}
                      onSelect={() => {
                        setSelectedAlbum(g);
                        setOpen(false);
                      }}
                      className={cn(selectedAlbum?.uuid === g.uuid && "bg-muted")}
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