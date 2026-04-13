"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default function IconBooleanField({ nomeTabella, nomeCampo, uuidRecord, icona, colore, setUpdate }) {

  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const colorVariants = {
    brand: "text-brand bg-brand/10",
    green: "text-green-400 bg-green-400/10",
    red: "text-red-400 bg-red-400/10",
    yellow: "text-yellow-400 bg-yellow-400/10",
    blue: "text-blue-400 bg-blue-400/10",
  };

  useEffect(() => {
    async function fetchValue() {
      if (!nomeTabella || !nomeCampo || !uuidRecord) {
        setLoading(false);
        return;
      }

      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from(nomeTabella)
        .select(nomeCampo)
        .eq("id", uuidRecord)
        .single();

      if (error) {
        console.error(error.message);
        setChecked(false);
      } else {
        setChecked(Boolean(data?.[nomeCampo]));
      }

      setLoading(false);
    }

    fetchValue();
  }, [nomeTabella, nomeCampo, uuidRecord]);

  async function handleToggle() {
    const newValue = !checked;

    setChecked(newValue);
    setSaving(true);

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from(nomeTabella)
      .update({ [nomeCampo]: newValue })
      .eq("id", uuidRecord);

    if (error) {
      console.error(error.message);
      setChecked(!newValue);
    }

    setSaving(false);

    if (setUpdate) {
      setUpdate(count => count+1)
    }

  }

  if (loading) {
    return (
      <div className="h-9 w-9 rounded-md border border-brand/40 bg-muted animate-pulse" />
    );
  }

  const Icon = icona || Star;
  const activeColor = colorVariants[colore] || colorVariants.brand;

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      onClick={handleToggle}
      disabled={saving}
      className={`transition-all
        ${checked ? activeColor : "text-muted-foreground"}
        ${saving ? "opacity-60" : ""}
      `}
    >
      <Icon
        className={`
          h-5 w-5 transition-all
          ${checked ? "fill-current" : ""}
        `}
      />
    </Button>
  );
}