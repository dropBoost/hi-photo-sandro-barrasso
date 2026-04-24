"use client";

import { useMemo, useState, useTransition } from "react";
import { createCategoryAction } from "./createCategoryAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function generateCategoryId(alias) {
  if (!alias) return "";

  const clean = alias
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();

  const consonants = clean.replace(/[AEIOU]/g, "");
  const vowels = clean.replace(/[^AEIOU]/g, "");

  let result = (consonants + vowels).slice(0, 3);

  while (result.length < 3) {
    result += "X";
  }

  return result;
}

export default function FormCreateCategory() {
  const [alias, setAlias] = useState("");
  const [color, setColor] = useState("#000000");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [isPending, startTransition] = useTransition();

  const autoId = useMemo(() => generateCategoryId(alias), [alias]);

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  }

  function handleSubmit(formData) {
    setMsg("");
    setErr("");

    startTransition(async () => {
      const result = await createCategoryAction(formData);

      if (!result?.ok) {
        setErr(result?.error || "Si è verificato un errore.");
        return;
      }

      setMsg(result.message || "Categoria creata con successo.");
      setAlias("");
      setColor("#000000");
      setFile(null);
      setPreview(null);

      const fileInput = document.getElementById("img_cover");
      if (fileInput) fileInput.value = "";
    });
  }

  return (
    <form
      action={handleSubmit}
      className="w-full space-y-6 rounded-2xl border p-6 dark:shadow-sm bg-neutral-100 dark:bg-neutral-900"
    >
      <div className="grid gap-2">
        <Label htmlFor="alias">Alias</Label>
        <Input
          id="alias"
          name="alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Es. Bambino"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="id_preview">ID generato automaticamente</Label>
        <Input
          id="id_preview"
          value={autoId}
          readOnly
          className="bg-muted"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="color">Colore</Label>
        <div className="flex items-center gap-3">
          <Input
            id="color"
            name="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-12 w-20 cursor-pointer p-1"
            required
          />
          <Input
            value={color}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="img_cover">Immagine di copertina</Label>
        <Input
          id="img_cover"
          name="img_cover"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </div>

      {preview && (
        <div className="overflow-hidden rounded-xl border">
          <img
            src={preview}
            alt="Preview copertina"
            className="h-60 w-full object-cover"
          />
        </div>
      )}

      {err && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {err}
        </div>
      )}

      {msg && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
          {msg}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Salvataggio..." : "Crea categoria"}
      </Button>
    </form>
  );
}