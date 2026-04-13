"use client";

import { Button } from "@/components/ui/button";
import { MdCloudDownload } from "react-icons/md";

export default function DownloadSchedaAcconti({ idPreventivo }) {
  function handleDownload() {
    if (!idPreventivo) return;

    window.open(
      `/api/pdf-acconti?id=${idPreventivo}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <Button
      aria-label="Scarica scheda acconti"
      size="xs"
      type="button"
      className="aspect-square h-fit hover:bg-muted"
      onClick={handleDownload}
      disabled={!idPreventivo}
    >
      <MdCloudDownload />
    </Button>
  );
}