"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { updateBooleanFieldAction } from "./updateBooleanFiledAction";

export default function BooleanSwitchCell({
  tableName,
  idColumn,
  idValue,
  fieldName,
  initialValue = false,
  refreshOnUpdate = true,
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(Boolean(initialValue));
  const [isPending, startTransition] = useTransition();

  function handleChange(nextValue) {
    const previousValue = checked;
    setChecked(nextValue);

    startTransition(async () => {
      const result = await updateBooleanFieldAction({
        tableName,
        idColumn,
        idValue,
        fieldName,
        value: nextValue,
      });

      if (!result.success) {
        setChecked(previousValue);
        alert(result.message);
        return;
      }

      if (refreshOnUpdate) router.refresh();
    });
  }
  
  return (
    <Switch
      size="sm"
      checked={checked}
      onCheckedChange={handleChange}
      disabled={isPending}
      className="scale-75"
    />
  );
}