"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createGalleryAction } from "@/app/manager/gallery/create-gallery/action/createGallery.action";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSchema = z.object({
  title: z.string().min(2, "Titolo troppo corto"),
  description: z.string().min(2, "Descrizione troppo corta"),
  location: z.string().min(2, "Location troppo corta"),
  event_date: z.string().min(10, "Data non valida"),
  category_id: z.string().trim().min(3, "Categoria non valida"),
});

const initialState = { ok: false, message: "", fieldErrors: {} };

export default function COMPcreateGallery() {
  const [state, formAction, pending] = useActionState(createGalleryAction, initialState);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      event_date: "",
      category_id: "",
    },
    mode: "onTouched",
  });

  const {
    register,
    setValue,
    formState: { errors },
    reset,
    watch,
    setError,
  } = form;

  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(true);

  const categoryValue = watch("category_id");
  
  // carica categorie via API
  useEffect(() => {
    let mounted = true;

    async function loadCats() {
      try {
        setLoadingCat(true);
        const res = await fetch("/api/category-gallery", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json?.message || "Errore nel caricamento categorie");
        if (mounted) setCategories(json.data || []);
      } catch (e) {
        toast.error(e.message || "Errore");
      } finally {
        if (mounted) setLoadingCat(false);
      }
    }

    loadCats();
    return () => {
      mounted = false;
    };
  }, []);

  // gestisci risposta server action
  useEffect(() => {
    if (!state) return;

    if (state.ok) {
      toast.success(state.message || "Creato");
      reset();
      return;
    }

    if (state.message) toast.error(state.message);

    if (state.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([key, msgs]) => {
        if (msgs?.[0]) setError(key, { type: "server", message: msgs[0] });
      });
    }
  }, [state, reset, setError]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crea Gallery</CardTitle>
        <CardDescription>Compila i campi e crea una nuova raccolta.</CardDescription>
      </CardHeader>

      <CardContent>
        {/* ✅ Server Action direttamente sul form */}
        <form action={formAction} className="grid grid-cols-1 gap-4">
          {/* TITLE */}
          <div className="grid gap-2">
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              placeholder="Titolo..."
              {...register("title")}
              name="title"
            />
            {errors.title?.message ? (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          {/* DESCRIPTION */}
          <div className="grid gap-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              placeholder="Descrizione..."
              className="min-h-30"
              {...register("description")}
              name="description"
            />
            {errors.description?.message ? (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            ) : null}
          </div>

          {/* LOCATION */}
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Es. Milano"
              {...register("location")}
              name="location"
            />
            {errors.location?.message ? (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            ) : null}
          </div>

          {/* EVENT DATE */}
          <div className="grid gap-2">
            <Label htmlFor="event_date">Data evento</Label>
            <Input
              id="event_date"
              type="date"
              {...register("event_date")}
              name="event_date"
            />
            {errors.event_date?.message ? (
              <p className="text-sm text-destructive">{errors.event_date.message}</p>
            ) : null}
          </div>

          {/* CATEGORY */}
          <div className="grid gap-2">
            <Label>Categoria</Label>

            <Select
              value={categoryValue}
              onValueChange={(val) => setValue("category_id", val, { shouldValidate: true })}
              disabled={loadingCat}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingCat ? "Caricamento..." : "Seleziona una categoria"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.alias}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* ✅ questo è quello che viene davvero inviato alla Server Action */}
            <input type="hidden" name="category_id" value={categoryValue || ""} />

            {errors.category_id?.message ? (
              <p className="text-sm text-destructive">{errors.category_id.message}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvataggio..." : "Salva"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={pending}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}