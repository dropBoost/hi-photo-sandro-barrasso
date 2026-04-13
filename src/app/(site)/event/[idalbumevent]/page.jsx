import { createSupabaseServerClient } from "@/utils/supabase/server";
import GalleryGridLightbox from "./GalleryGridLightbox";

export default async function PAGEeventAlbum({ params }) {
  
  const supabase = await createSupabaseServerClient();
  const { idalbumevent } = await params;
  const BUCKET = "albumevents";

  const { data: eventPhoto, error } = await supabase
    .from("event_photo")
    .select(`*`)
    .eq("uuid_event", idalbumevent)
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  
  const { data: eventInfo, error: eventInfoError } = await supabase
    .from("event_album")
    .select(`*`)
    .eq("uuid", idalbumevent)
    .maybeSingle()

  if (eventInfoError) throw new Error(eventInfoError.message);

  function publicUrl(path) {
    if (!path) return null;
    const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!domain) return null;
    return `${domain}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  const photos = (eventPhoto || [])
    .filter((ep) => ep?.link)
    .map((ep) => ({
      key: ep?.uuid,
      src: publicUrl(ep?.link),
      title: eventInfo?.title,
      location: eventInfo?.location,
      event_date: eventInfo?.event_date,
    }));

  return (
    <div className="flex flex-col bg-neutral-200 font-sans dark:bg-neutral-900 justify-start w-full h-full">
      <GalleryGridLightbox photos={photos} />
    </div>
  );
}