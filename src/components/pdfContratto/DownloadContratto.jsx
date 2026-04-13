"use client";

import { Button } from "@/components/ui/button";
import { MdCloudDownload } from "react-icons/md";

export default function DownloadContrattoPdfButton({ idPreventivo }) {
  function handleDownload() {
    window.open(`/api/pdf-contratto?id=${idPreventivo}`, "_blank");
  }

  return (
    <Button type="button" variant="ghost" size="xs" onClick={handleDownload} className=" hover:text-sky-600">
      <MdCloudDownload />
    </Button>
  );
}