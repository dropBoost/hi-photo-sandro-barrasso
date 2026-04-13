"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { insertGalleryPhotosAction } from "../action/createGalleryPhoto.action";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function sanitizeFilename(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export default function COMPuploadPhotoGallery() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const inputFileRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [galleryQuery, setGalleryQuery] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/list-gallery?q=${encodeURIComponent(galleryQuery)}`, {
          cache: "no-store",
        });
        const json = await res.json();
        setGalleries(json?.data || []);
      } catch (error) {
        setGalleries([]);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [galleryQuery]);

  function resetFileInput() {
    setFiles([]);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  }

  function onPickFiles(e) {
    setMsg("");

    const picked = Array.from(e.target.files || []);

    if (!picked.length) {
      setFiles([]);
      return;
    }

    if (picked.length > MAX_FILES) {
      setMsg(`Puoi selezionare massimo ${MAX_FILES} immagini.`);
      setFiles(picked.slice(0, MAX_FILES));
      return;
    }

    const notImages = picked.filter((file) => !file.type?.startsWith("image/"));
    if (notImages.length > 0) {
      setMsg(`Questi file non sono immagini: ${notImages.map((f) => f.name).join(", ")}`);
      resetFileInput();
      return;
    }

    const tooLarge = picked.filter((file) => file.size > MAX_FILE_SIZE);
    if (tooLarge.length > 0) {
      setMsg(`Questi file superano 2MB: ${tooLarge.map((f) => f.name).join(", ")}`);
      resetFileInput();
      return;
    }

    setFiles(picked);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!selectedGallery?.uuid) {
      setMsg("Seleziona una gallery.");
      return;
    }

    if (!files.length) {
      setMsg("Seleziona almeno un'immagine.");
      return;
    }

    if (files.length > MAX_FILES) {
      setMsg(`Massimo ${MAX_FILES} immagini.`);
      return;
    }

    setLoading(true);

    try {
      const uploadedLinks = [];

      for (const file of files) {
        if (!file.type?.startsWith("image/")) {
          throw new Error(`Il file "${file.name}" non è un'immagine.`);
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`Il file "${file.name}" supera il limite di 2MB.`);
        }

        const safe = sanitizeFilename(file.name || "image");
        const ext = safe.includes(".") ? safe.split(".").pop() : "jpg";
        const base = safe.replace(/\.[^/.]+$/, "");

        const path = `${selectedGallery.uuid}/${base}-${Date.now()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from("photogallery")
          .upload(path, file, {
            upsert: false,
            contentType: file.type,
          });

        if (upErr) {
          throw new Error(upErr.message);
        }

        uploadedLinks.push(path);
      }

      const res = await insertGalleryPhotosAction({
        uuid_gallery: selectedGallery.uuid,
        links: uploadedLinks,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      setMsg("Caricamento completato ✅");
      setFiles([]);
      setSelectedGallery(null);
      setGalleryQuery("");

      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    } catch (err) {
      setMsg(err?.message || "Errore durante il caricamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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

      <div className="space-y-2">
        <Label>Immagini (max 10, max 2MB ciascuna)</Label>
        <Input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onPickFiles}
        />
        <div className="text-sm opacity-80">
          Selezionate: {files.length}/{MAX_FILES}
        </div>
      </div>

      {msg ? <div className="text-sm">{msg}</div> : null}

      <Button disabled={loading} type="submit" className="w-full">
        {loading ? "Carico..." : "Carica e salva"}
      </Button>
    </form>
  );
}