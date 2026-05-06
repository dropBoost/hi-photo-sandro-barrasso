import { createSupabaseServerClient } from "@/utils/supabase/server";
import GalleryGridLightbox from "./GalleryGridLightbox";
import { Separator } from "@/components/ui/separator";
import YouTubePlayer from "@/components/youtubePlayer";

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

  const { data: eventVideo, error: videoError } = await supabase
    .from("event_video")
    .select(`*`)
    .eq("uuid_event", idalbumevent)
    .order("created_at", { ascending: true });

  if (videoError) throw new Error(videoError.message);
  
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
    console.log(eventInfo)
  return (
    <div className="flex flex-col items-center gap-3 bg-neutral-200 font-sans dark:bg-neutral-900 justify-start w-full h-full">
      <div className="flex flex-col bg-neutral-200 font-sans dark:bg-neutral-900 justify-start w-full h-full">
        <div className="flex flex-col items-center justify-center w-full bg-neutral-300 dark:bg-neutral-800 lg:min-h-50 min-h-30 transition-all">
          <div className="flex flex-col items-center w-full max-w-7xl p-5 px-7">
            <span className="uppercase text-neutral-700 dark:text-neutral-300 text-sm">{eventInfo.title}</span>
            <span className="font-light text-neutral-500 dark:text-neutral-400 text-xs italic">{eventInfo.location} / {eventInfo.event_date}</span>
          </div>
        </div>
        <GalleryGridLightbox photos={photos} />
      </div>
      {eventVideo.length > 0 ?
      <div className="flex flex-col items-center w-full bg-neutral-950 lg:pb-20 pb-10">
        <div className="flex flex-row items-center my-10 justify-between w-full max-w-6xl gap-4">
          <Separator className={`flex-1`}/>
          <span className="tracking-widest font-light">VIDEO</span>
          <Separator className={`flex-1`}/>
        </div>
        <div className="flex flex-col gap-5 bg-neutral-200 font-sans dark:bg-neutral-900 justify-start w-full max-w-7xl h-full">
          {eventVideo.map((v,i) => (
            <YouTubePlayer link={v.link}/>
          ))}
        </div>
      </div> : null }
    </div>
  );
}