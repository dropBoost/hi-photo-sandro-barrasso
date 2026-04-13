"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QrCodeDownloadOnly({ link, fileName = "qrcode.png" }) {
  const qrRef = useRef(null);

  function downloadQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas || !link) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  }

  return (
    <div className="flex flex-col gap-3">
      {/* QR nascosto */}
      <div ref={qrRef} className="hidden">
        <QRCodeCanvas
          value={link}
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />
      </div>

      <button
        type="button"
        onClick={downloadQR}
        disabled={!link}
        className="rounded-md bg-black px-4 py-2 text-[0.6rem] hover:bg-muted text-white disabled:opacity-50 uppercase"
      >
        Scarica QR Code
      </button>
    </div>
  );
}