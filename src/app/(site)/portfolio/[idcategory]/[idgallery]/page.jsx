import { createSupabaseServerClient } from "@/utils/supabase/server";
import GalleryGridLightbox from "./GalleryGridLightbox";

export default async function PAGEGallery({ params }) {
  
  const supabase = await createSupabaseServerClient();
  const { idgallery } = await params;
  const BUCKET = "photogallery";

  const { data: galleryPhoto, error } = await supabase
    .from("gallery_photo")
    .select(`*`)
    .eq("uuid_gallery", idgallery)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  function publicUrl(path) {
    if (!path) return null;
    const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!domain) return null;
    // NOTA: se NEXT_PUBLIC_SUPABASE_URL è tipo "https://xxxx.supabase.co" va bene così
    return `${domain}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  const photos = (galleryPhoto || [])
    .filter((g) => g?.link)
    .map((g) => ({
      key: g?.uuid,
      src: publicUrl(g?.link),
      title: "g.title",
      location: "g.location",
      event_date: "g.event_date",
    }));

  return (
    <div className="flex flex-col bg-neutral-200 font-sans dark:bg-neutral-900 justify-start w-full h-full">
      <GalleryGridLightbox photos={photos} />
    </div>
  );
}