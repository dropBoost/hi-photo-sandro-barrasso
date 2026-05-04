'use client'

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function COMPeventHomePage ( { settings } ) {

  const [event, setEvent] = useState([])
  const [coverList, setCoverList] = useState([])

  //PASSARE I DATI CLIENT ATTRAVERSO PAGE PROPS
  const s = settings;
  const BUCKET = "albumevents";

  useEffect(() => {

    const supabase = createSupabaseBrowserClient();

    async function fetchData() {

      const { data, error } = await supabase
        .from("event_album")
        .select(`*,
          category:category!event_album_category_id_fkey(id, alias, active, color)`)
        .eq("active", true)
        .eq("category.active", true)
        .limit(Number(s?.limitEventHomePage))
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error.message);
        setEvent([]);
      } else {
        setEvent(data || []);
      }

    }

    fetchData();
  }, []);

  useEffect(() => {

    const supabase = createSupabaseBrowserClient();

    async function fetchData() {

      const { data, error } = await supabase
        .from("event_photo")
        .select("*")
        .eq("cover", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.log(error.message);
        setCoverList([]);
      } else {
        setCoverList(data || []);
      }

    }

    fetchData();
  }, [event]);

  function publicUrl(path) {
    if (!path) return null;
    const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!domain) return null;
    return `${domain}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  return (
    <>
    <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
      {event.map(ea => {

        const coverOk = coverList.find(c => c.uuid_event == ea.uuid)
        const cover = publicUrl(coverOk?.link);

        return (
        <Link key={ea?.uuid} href={`/event/${ea?.uuid}`} className="aspect-4/5 flex flex-col gap-2 border p-4 pb-10 rounded-md hover:border-brand transition-all h-full max-w-full">
            <div className={`flex flex-col items-end flex-1 bg-cover bg-center bg-no-repeat p-3`} style={{ backgroundImage: `url("${cover}")` }}>
              <span className={`text-[0.6rem] rounded-full px-2 py-1`} style={{ background: `${ea?.category?.color}` }}>{ea?.category?.alias}</span>
            </div>
            <div className={`flex flex-col p-2 rounded-md gap-0 overflow-hidden`}>
              <div className="flex lg:flex-row flex-col gap-1 lg:items-center items-start">
                <span className="text-xs dark:text-neutral-300 text-neutral-700 font-bold truncate">{ea?.title}</span>
                <span className="text-xs text-neutral-500 italic lg:flex hidden truncate">-</span>
                <span className="text-xs text-neutral-500 italic truncate">{ea?.location}</span>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <span className="text-xs text-neutral-500 italic">{ea?.event_date}</span>
              </div>
            </div>
        </Link>
      )})}
      <Link href={`/event`} className="aspect-4/5 flex flex-col gap-2 bg-brand p-4 rounded-md h-full max-w-full">
        <div className="flex flex-row items-center justify-start h-full">
          <span className="flex items-center gap-2 text-xs hover:border-b border-neutral-50 transition-all p-1 text-white"><FaArrowRight className="text-[0.6rem]"/> vedi tutti gli eventi</span>
        </div>
      </Link>
    </div>
    </>
  )
}