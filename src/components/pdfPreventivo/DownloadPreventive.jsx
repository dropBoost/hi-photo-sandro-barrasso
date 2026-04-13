"use client";

import { Button } from "@/components/ui/button";
import { MdCloudDownload } from "react-icons/md";

export default function DownloadPreventivoPdfButton({ idPreventivo }) {
  function handleDownload() {
    window.open(`/api/pdf-preventivo?id=${idPreventivo}`, "_blank");
  }

  return (
    <Button
      type="button"
      className="aspect-square h-fit w-8 hover:bg-sky-600"
      onClick={handleDownload}
    >
      <MdCloudDownload />
    </Button>
  );
}