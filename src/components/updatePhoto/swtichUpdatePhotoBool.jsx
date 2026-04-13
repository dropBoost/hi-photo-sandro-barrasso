"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default function UpdateBooleanSwitch({
  table,
  field,
  uuid,
  value = false,
  onUpdated,
  size = "sm",
}) {
  const [checked, setChecked] = useState(!!value);
  const [loading, setLoading] = useState(false);

  async function handleChange(newValue) {
    const oldValue = checked;

    setChecked(newValue);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from(table)
      .update({ [field]: newValue })
      .eq("uuid", uuid);

    if (error) {
      console.error(error.message);
      setChecked(oldValue);
    } else {
      if (onUpdated) onUpdated(newValue);
    }

    setLoading(false);
  }

  return (
    <Switch
      size={size}
      checked={checked}
      disabled={loading}
      onCheckedChange={handleChange}
    />
  );
}