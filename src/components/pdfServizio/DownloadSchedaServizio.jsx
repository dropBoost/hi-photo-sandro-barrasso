"use client";

import { Button } from "@/components/ui/button";
import { MdCloudDownload } from "react-icons/md";

export default function DownloadSchedaServizio({ idServizio }) {
  function handleDownload() {
    if (!idServizio) return;

    window.open(
      `/api/pdf-servizio/?id=${idServizio}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <Button
      aria-label="Scarica scheda servizio"
      size="xs"
      type="button"
      className="aspect-square h-fit hover:bg-muted"
      onClick={handleDownload}
      disabled={!idServizio}
    >
      <MdCloudDownload />
    </Button>
  );
}