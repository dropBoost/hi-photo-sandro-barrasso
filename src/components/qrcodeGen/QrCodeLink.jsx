"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaDownload } from "react-icons/fa";

export default function QrCodeLink({ link, size = 200 }) {
  const qrRef = useRef(null);

  function downloadQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  }

  if (!link) {
    return <p className="text-sm text-red-500">Link non valido</p>;
  }

  return (
    <div ref={qrRef} className="flex lg:flex-col flex-row items-center justify-between gap-4 w-full">
      <QRCodeCanvas
        value={link}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        includeMargin={true}
      />

      <button
        type="button"
        onClick={downloadQR}
        className="flex flex-row items-center gap-2 rounded-md bg-neutral-700 hover:bg-muted px-4 py-2 text-sm text-white"
      >
        <FaDownload/> SCARICA QR CODE
      </button>
    </div>
  );
}