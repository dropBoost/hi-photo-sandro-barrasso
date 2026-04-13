import { createSupabaseServerClient } from "@/utils/supabase/server";
import Link from "next/link";
import { PiHandTap } from "react-icons/pi";
import { TbMoodCry } from "react-icons/tb";

export default async function PAGEportfolioGallery({ params }) {

  const { idcategory } = await params;
  const BUCKET = "photogallery";

  const supabase = await createSupabaseServerClient();
  
  const { data: gallery, error: galleryError } = await supabase
    .from("gallery")
    .select(`
      *,
      category:category!gallery_category_id_fkey (alias)
    `)
    .eq("category_id", idcategory)
    .order("created_at", { ascending: true });
  
  if (galleryError) throw new Error(galleryError.message);

  const { data: cover, error: coverError } = await supabase

    .from("gallery_photo")
    .select("*")
    .eq("cover", true)
    .order("created_at", { ascending: true });

  if (coverError) throw new Error(coverError.message);

  function publicUrl(path) {
    if (!path) return null;
    const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!domain) return null;
    return `${domain}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  return (
    <>
    <div className="flex h-full w-full flex-col items-center justify-start bg-neutral-200 font-sans dark:bg-neutral-950">
      {gallery.length > 0 ?
      <div className="flex flex-col items-center border py-10 bg-brand w-full">
        <span className="uppercase font-extralight tracking-[1em]">
          {gallery[0]?.category?.alias}
        </span>
      </div> : null}
      {gallery.length > 0 ?
      <div className="grid w-full max-w-7xl grid-cols-2 gap-3 md:grid-cols-3 p-5">
        {gallery?.map((g) => {

          const coverOk = cover?.find(c => c.uuid_gallery == g.uuid)
          const coverUrl = publicUrl(coverOk?.link);

          return (
          <Link className="group relative block" key={g?.uuid} href={`/portfolio/${idcategory}/${g?.uuid}`}>
            <div className="p-5 border rounded-sm">
              {/* IMMAGINE BACKGR */}
              <div className="aspect-square overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url("${coverUrl}")` }} />
              {/* OVERLAY */}
              <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/90 opacity-0 transition-opacity group-hover:opacity-80">
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <PiHandTap/>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                <div className="flex flex-row gap-1 text-xs ">
                  <span className="font-extralight uppercase">
                    {g?.title}
                  </span>
                  <span className="font-extralight uppercase">
                    -
                  </span>
                  <span className="font-extralight lowercase italic">
                    {g?.location}
                  </span>
                </div>
                <span className="text-[0.6rem] font-extralight">
                  {g?.event_date}
                </span>
              </div>
              {/* FINE OVERLAY */}
            </div>
          </Link>
          )
        })}
      </div>
      : 
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="flex flex-col items-center gap-4 font-extralight p-20 border border-brand rounded-lg">
          <span className="text-3xl"><TbMoodCry /> </span>
          <span>sorry, nessun album disponibile</span>
        </div>
      </div> }
    </div>
    </>
  );
}