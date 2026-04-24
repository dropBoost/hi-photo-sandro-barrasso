"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FormUpdateCategory({ category }) {
  const supabase = createSupabaseBrowserClient();

  const [id, setId] = useState("");
  const [alias, setAlias] = useState("");
  const [color, setColor] = useState("#000000");
  const [active, setActive] = useState(false);
  const [imgCover, setImgCover] = useState(null);
  const [file, setFile] = useState(null);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDeleteImage, setLoadingDeleteImage] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    setId(category.id ?? "");
    setAlias(category.alias ?? "");
    setColor(category.color ?? "#000000");
    setActive(Boolean(category.active));
    setImgCover(category.img_cover ?? null);
  }, [category]);

  const imagePreview = useMemo(() => {
    if (!imgCover) return null;
    return publicUrl(imgCover);
  }, [imgCover]);

  function publicUrl(path) {
    if (!path) return null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return null;

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${supabaseUrl}/storage/v1/object/public/assets/${path}`;
  }

  function getFileExtension(filename) {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
  }

  function normalizeStoragePath(path) {
    if (!path) return null;

    if (!path.includes("/storage/v1/object/public/")) {
      return path.replace(/^\/+/, "");
    }

    const marker = "/storage/v1/object/public/assets/";
    const index = path.indexOf(marker);

    if (index !== -1) {
      return path.slice(index + marker.length).replace(/^\/+/, "");
    }

    return path.replace(/^\/+/, "");
  }

  async function deleteCurrentImage() {
    if (!imgCover) return;

    setError(null);
    setMessage(null);
    setLoadingDeleteImage(true);

    try {
      const pathToDelete = normalizeStoragePath(imgCover);

      const { error: storageError } = await supabase.storage
        .from("assets")
        .remove([pathToDelete]);

      if (storageError) throw new Error(storageError.message);

      const { error: dbError } = await supabase
        .from("category")
        .update({ img_cover: null })
        .eq("id", id);

      if (dbError) throw new Error(dbError.message);

      setImgCover(null);
      setMessage("Immagine eliminata correttamente.");
    } catch (err) {
      setError(err.message || "Errore durante l'eliminazione dell'immagine.");
    } finally {
      setLoadingDeleteImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoadingSave(true);
    setError(null);
    setMessage(null);

    try {
      let finalImgPath = imgCover;

      if (file) {
        if (imgCover) {
          const oldPath = normalizeStoragePath(imgCover);

          const { error: removeOldError } = await supabase.storage
            .from("assets")
            .remove([oldPath]);

          if (removeOldError) throw new Error(removeOldError.message);
        }

        const ext = getFileExtension(file.name);
        const cleanAlias = (alias || "category")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");

        const filePath = `category_cover/${id}-${cleanAlias}-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw new Error(uploadError.message);

        finalImgPath = filePath;
      }

      const payload = {
        alias: (alias || "").trim().toLowerCase(),
        color: color || "#000000",
        active: Boolean(active),
        img_cover: finalImgPath || null,
      };

      const { error: updateError } = await supabase
        .from("category")
        .update(payload)
        .eq("id", id);

      if (updateError) throw new Error(updateError.message);

      setImgCover(finalImgPath || null);
      setFile(null);
      setMessage("Categoria aggiornata correttamente.");
    } catch (err) {
      setError(err.message || "Errore durante l'aggiornamento.");
    } finally {
      setLoadingSave(false);
    }
  }

  if (!category) {
    return <div className="p-4 text-sm">Caricamento dati categoria...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Aggiorna categoria</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="id">ID</Label>
            <Input id="id" value={id} readOnly disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="alias">Alias</Label>
            <Input
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value.toLowerCase())}
              placeholder="es. matrimoni"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="color">Colore</Label>

            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-20 p-1"
              />

              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#000000"
                className="max-w-45"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="grid gap-1">
              <Label htmlFor="active">Attiva</Label>
            </div>

            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="img_cover">Immagine cover</Label>

            {imagePreview && (
              <div className="flex flex-col gap-3 rounded-lg border p-4">
                <img
                  src={imagePreview}
                  alt="Cover categoria"
                  className="h-40 w-full max-w-sm rounded-md object-cover border"
                />

                <div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={deleteCurrentImage}
                    disabled={loadingDeleteImage}
                  >
                    {loadingDeleteImage ? "Eliminazione..." : "Elimina immagine"}
                  </Button>
                </div>
              </div>
            )}

            <Input
              id="img_cover"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
              {message}
            </div>
          )}

          <div>
            <Button type="submit" disabled={loadingSave}>
              {loadingSave ? "Salvataggio..." : "Aggiorna categoria"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}