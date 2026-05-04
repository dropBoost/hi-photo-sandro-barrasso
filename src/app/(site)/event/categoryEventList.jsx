'use client'

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import Link from "next/link";
import { PiHandTap } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { TbMoodCry } from "react-icons/tb";

export default function COMPcategoryEventList({ settings, selectedDate, selectedCategory }) {
  const [coverList, setCoverList] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(null);

  const BUCKET = "albumevents";
  
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchData() {
      try {
        setLoading(true);
        setErrorPage(null);

        let query = supabase
          .from("event_album")
          .select(`
            *,
            category:category!event_album_category_id_fkey(id, alias, active, color)
          `)
          .eq("category.active", true)
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (selectedCategory) {
          query = query.eq("category_id", selectedCategory);
        }

        if (selectedDate) {
          query = query.eq("event_date", selectedDate);
        }

        const { data: eventAlbums, error: errorAlbums } = await query;

        if (errorAlbums) throw new Error(errorAlbums.message);
        if (eventAlbums) setAlbumList(eventAlbums);
      } catch (err) {
        setErrorPage(err.message || "Errore nel caricamento dati");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedDate, selectedCategory]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchData() {
      try {
        const { data: cover, error: errorCover } = await supabase
          .from("event_photo")
          .select(`*`)
          .eq("cover", true)
          .order("created_at", { ascending: false });

        if (errorCover) throw new Error(errorCover.message);
        if (cover) setCoverList(cover);
      } catch (err) {
        setErrorPage(err.message || "Errore nel caricamento cover");
      }
    }

    fetchData();
  }, []);

  function publicUrl(path) {
    if (!path) return null;
    const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!domain) return null;
    return `${domain}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  if (loading) {
    return (
      <div className="flex flex-col bg-neutral-200 font-sans dark:bg-neutral-950 justify-start items-center w-full h-full">
        <div className="flex flex-col gap-4 w-full max-w-7xl p-5">
          <div className="text-sm text-neutral-500">Caricamento...</div>
        </div>
      </div>
    );
  }

  if (errorPage) {
    return (
      <div className="flex flex-col bg-neutral-200 font-sans dark:bg-neutral-950 justify-start items-center w-full h-full">
        <div className="flex flex-col gap-4 w-full max-w-7xl p-5">
          <div className="text-sm text-red-500">{errorPage}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {albumList.length > 0 ? (
        <div className="grid w-full max-w-7xl grid-cols-2 gap-3 md:grid-cols-3 p-5 min-h-200">
          {albumList?.map((g) => {
            const coverOk = coverList?.find((c) => c.uuid_event == g.uuid);
            const coverUrl = publicUrl(coverOk?.link);

            return (
              <Link className="group relative block h-fit" key={g?.uuid} href={`/event/${g?.uuid}`}>
                <div className="p-5 border rounded-sm">
                  {/* IMMAGINE BACKGR */}
                  <div
                    className="aspect-square overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url("${coverUrl}")` }}
                  />

                  {/* OVERLAY BADGE */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-sm">
                    <div className="flex h-full w-full flex-col items-end justify-start gap-2 pt-10 text-white">
                      <Badge className="rounded-r-none text-[0.6rem]" style={{ backgroundColor: `${g?.category?.color}` }}>
                        {g?.category?.alias}
                      </Badge>
                    </div>
                  </div>

                  {/* LAYER OVERLAY */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/90 opacity-0 transition-opacity group-hover:opacity-80">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <PiHandTap />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-1">
                    <div className="flex flex-row gap-1 text-xs">
                      <span className="font-extralight uppercase">
                        {g?.title}
                      </span>
                      <span className="font-extralight uppercase">-</span>
                      <span className="font-extralight lowercase italic">
                        {g?.location}
                      </span>
                    </div>
                    <span className="text-[0.6rem] font-extralight">
                      {g?.event_date}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="flex flex-col items-center gap-4 font-extralight p-20 border border-brand rounded-lg">
            <span className="text-3xl"><TbMoodCry /> </span>
            <span>sorry, nessun album disponibile</span>
          </div>
        </div>
      )}
    </>
  );
}