"use client";

import { useEffect, useMemo, useState } from "react";
import { insertEventPhotosAction } from "../action/createEventPhoto.action";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

function sanitizeFilename(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export default function COMPuploadPhotoEvent() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [open, setOpen] = useState(false);
  const [albumsQuery, setAlbumsQuery] = useState("");
  const [albums, setAlbums] = useState([]);
  const [selectAlbum, setSelectedAlbum] = useState(null);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // fetch albums (con debounce “semplice”)
  useEffect(() => {
    const t = setTimeout(async () => {
      const res = await fetch(`/api/list-event?q=${encodeURIComponent(albumsQuery)}`, { cache: "no-store" });
      const json = await res.json();
      setAlbums(json?.data || []);
    }, 250);
    return () => clearTimeout(t);
  }, [albumsQuery]);

  function onPickFiles(e) {
    setMsg("");
    const picked = Array.from(e.target.files || []);
    if (picked.length > 10) {
      setMsg("Puoi selezionare massimo 10 immagini.");
      setFiles(picked.slice(0, 10));
      return;
    }
    setFiles(picked);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!selectAlbum?.uuid) {
      setMsg("Seleziona un Evento.");
      return;
    }
    if (!files.length) {
      setMsg("Seleziona almeno un'immagine.");
      return;
    }
    if (files.length > 10) {
      setMsg("Massimo 10 immagini.");
      return;
    }

    setLoading(true);
    try {
      const uploadedLinks = [];

      for (const file of files) {
        // (opzionale) check tipo
        if (!file.type?.startsWith("image/")) {
          throw new Error(`File non immagine: ${file.name}`);
        }

        const safe = sanitizeFilename(file.name || "image");
        const ext = safe.includes(".") ? safe.split(".").pop() : "jpg";
        const base = safe.replace(/\.[^/.]+$/, "");

        const path = `${selectAlbum.uuid}/${base}-${Date.now()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from("albumevents")
          .upload(path, file, { upsert: false, contentType: file.type });

        if (upErr) throw new Error(upErr.message);

        // link “dal bucket in poi” = path
        uploadedLinks.push(path);
      }

      // insert DB via server action
      await insertEventPhotosAction({
        uuid_event: selectAlbum.uuid,
        links: uploadedLinks,
      });

      setMsg("Caricamento completato ✅");
      setFiles([]);
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
              {selectAlbum?.title || "Seleziona un Evento..."}
              <span className="opacity-60">⌄</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Cerca per titolo..."
                value={albumsQuery}
                onValueChange={setAlbumsQuery}
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
                      className={cn(selectAlbum?.uuid === g.uuid && "bg-muted")}
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

      {/* File input */}
      <div className="space-y-2">
        <Label>Immagini (max 10)</Label>
        <Input type="file" accept="image/*" multiple onChange={onPickFiles} />
        <div className="text-sm opacity-80">
          Selezionate: {files.length}/10
        </div>
      </div>

      {msg ? <div className="text-sm">{msg}</div> : null}

      <Button disabled={loading} type="submit" className="w-full">
        {loading ? "Carico..." : "Carica e salva"}
      </Button>
    </form>
  );
}