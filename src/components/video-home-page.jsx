import { createSupabaseServerClient } from "@/utils/supabase/server";
import { getSettings } from "@/lib/setting";
import Image from "next/image";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import YouTubePlayer from "./youtubePlayer";

export default async function COMPvideoHomePage () {

  const s = await getSettings();
  const supabase = await createSupabaseServerClient();

  const { data: video, error } = await supabase
    .from("gallery_video")
    .select(`*,
      gallery:gallery!gallery_video_uuid_gallery_fkey!inner(*)`)
    .eq("gallery.category_id", s?.categoryVideoHomeHighlights )
    .eq("highlights", true)
    .order("created_at", { ascending: false })
    .limit(1)


  if (error) throw new Error(error.message);

  return (
    <>
    {video?.map(v => (
    <div className="aspect-video w-full" key={v.uuid}>
      <YouTubePlayer link={v?.link} />
    </div>
    ))}
    </>
  )
}