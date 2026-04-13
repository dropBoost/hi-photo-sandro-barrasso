"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPencilAlt, FaCircle } from "react-icons/fa";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import DeleteMotherContentButton from "@/components/deleteGallery/DeleteMotherContentButton";
import QrCodeLink from "@/components/qrcodeGen/QrCodeLink";
import QrCodeDownloadOnly from "@/components/qrcodeGen/QrCodeLinkDownload";

const BUCKET = "albumevents";

function publicUrl(path) {
  if (!path) return null;
  const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!domain) return null;
  return `${domain}/storage/v1/object/public/${BUCKET}/${path}`;
}

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return String(d);
  }
}

export default function COMPlistEvent() {

  const [data, setData] = useState([]);
  const [coverList, setCoverList] = useState([])
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const pathname = usePathname()
  const [update, setUpdate] = useState(0)

  useEffect(() => {

    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch("/api/list-event", { cache: "no-store" });
        const json = await res.json();

        if (!res.ok || json?.ok === false) {
          throw new Error(json?.message || `Errore fetch (${res.status})`);
        }

        if (alive) setData(Array.isArray(json?.data) ? json.data : []);
      } catch (e) {
        if (alive) setErr(e?.message || "Errore");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };

  }, [update]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((g) => {
      return (
        (g.title || "").toLowerCase().includes(s) ||
        (g.location || "").toLowerCase().includes(s) ||
        (g.description || "").toLowerCase().includes(s)
      );
    });
  }, [data, q, update]);

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
  }, [data]);

  if (loading) return <div>Caricamento...</div>;
  if (err) return <div className="text-red-500">Errore: {err}</div>;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">ELENCO ALBUM CREATI</h2>

        <div className="w-full sm:w-[320px]">
          <Input
            placeholder="Cerca per titolo / luogo / descrizione..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div>Nessuna gallery trovata</div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-2 xl:grid-cols-5">
          {filtered.map((g) => {

            const coverOk = coverList.find(c => c.uuid_event == g.uuid)
            const cover = publicUrl(coverOk?.link);

            return (
              <Card key={g.uuid} className="overflow-hidden">
                <div className="relative w-full aspect-video bg-muted">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={g.title || "cover"}
                      fill
                      quality={75}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                      Nessuna cover
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-2">
                  <div className="line-clamp-1 flex items-start justify-between gap-2 truncate">
                    <CardTitle className="text-base leading-tight truncate">
                      {g.title || "Senza titolo"}
                    </CardTitle>
                      {g.active ? <FaCircle className="text-green-600 text-xs"/> : <FaCircle className="text-red-600 text-xs"/>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  {g.category_id ? (
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>{" "}
                      <span className="uppercase">{g.category?.alias}</span>
                    </div>
                  ) : null}

                  {g.location ? (
                    <div>
                      <span className="text-muted-foreground">Location:</span>{" "}
                      {g.location}
                    </div>
                  ) : null}

                  {g.event_date ? (
                    <div>
                      <span className="text-muted-foreground">Data evento:</span>{" "}
                      {formatDate(g.event_date)}
                    </div>
                  ) : null}

                  {g.description ? (
                    <div className="line-clamp-1 text-muted-foreground truncate">
                      {g.description}
                    </div>
                  ) : null}
                </CardContent>

                <CardFooter className={`flex flex-row gap-1 items-center justify-between`}>
                  <div className="">
                  <QrCodeDownloadOnly link={`${process.env.NEXT_PUBLIC_SITE_URL}/event/wdg/${g.uuid}`} fileName={`${g.title}-${g.event_date}-${g.uuid}`}/>
                  </div>
                  <div className="flex flex-row gap-2">
                  <Link  href={`${pathname}/${g.uuid}`}>
                    <Button className={`hover:bg-red-500`} size="xs"><FaPencilAlt/></Button>
                  </Link>
                  <DeleteMotherContentButton
                    uuid={g.uuid}
                    bucket="albumevents"
                    motherTable="event_album"
                    contentTable="event_photo"
                    motherIdColumn="uuid"
                    contentForeignKeyColumn="uuid_event"
                    setUpdate={setUpdate}
                  />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}