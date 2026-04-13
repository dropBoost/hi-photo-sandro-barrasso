"use client";

import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PiHandTap } from "react-icons/pi";

export default function GalleryGridLightbox({ photos = [] }) {
  const [index, setIndex] = useState(-1);

  const slides = useMemo(
    () =>
      photos.map((p) => ({
        src: p.src,
        alt: `${p.title} / ${p.event_date} / ${p?.location}` || "",
      })),
    [photos]
  );

  return (
    <>
      <div className="grid md:grid-cols-3 grid-cols-2 h-full">
        {photos.map((g, i) => (
          <button key={g.key || g.src || i} type="button" onClick={() => setIndex(i)} className="group relative text-left">
            {/* la tua tile */}
            <div className="aspect-4/5 flex flex-col gap-2 transition-all bg-cover bg-center overflow-hidden h-full" style={{ backgroundImage: `url("${g.src}")` }}/>
            {/* overlay */}
            <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2 items-center justify-center w-full h-full px-3">
                <div className="flex flex-col p-2 items-center rounded border hover:bg-brand/30 hover:border-0">
                  <PiHandTap />
                  <span className="text-[0.6rem]">open</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
      />
    </>
  );
}