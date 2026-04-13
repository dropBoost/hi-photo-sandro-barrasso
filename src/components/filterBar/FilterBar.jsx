"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiReset } from "react-icons/bi";

export default function FilterBar() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(null);

  const selectedDate = searchParams.get("date") || "";
  const selectedCategory = searchParams.get("category") || "";

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setErrorPage(null);

        const { data, error } = await supabase
          .from("category")
          .select("id, alias, active")
          .eq("active", true)
          .order("alias", { ascending: true });

        if (error) throw new Error(error.message);

        setCategories(data || []);
      } catch (err) {
        setErrorPage(err.message || "Errore nel caricamento categorie");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  function updateFilters(key, value) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function resetFilters() {
    router.replace(pathname);
  }

  return (
    <div className="flex flex-row gap-4 rounded-md">
      <div className="flex lg:flex-row flex-col items-center gap-1 lg:gap-3">
        <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Data evento
        </label>

        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => updateFilters("date", e.target.value)}
          className="w-40 text-xs"
        />
      </div>

      <div className="flex lg:flex-row flex-col items-center gap-1 lg:gap-3">
        <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Categoria
        </label>

        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) =>
            updateFilters("category", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="h-8 w-40 rounded-md border border-neutral-200 bg-white text-xs shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <SelectValue placeholder="Tutte le categorie" />
          </SelectTrigger>

          <SelectContent className="rounded-md">
            <SelectItem value="all">Tutte le categorie</SelectItem>

            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.alias}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-8 text-xs"
          onClick={resetFilters}
        >
          <BiReset />
        </Button>
      </div>
    </div>
  );
}