"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import YouTubePlayer from "@/components/youtubePlayer";
import FormUpdateGallery from "../components/formUpdateEvent";
import ListPhotoGallery from "../components/listPhotoGallery";
import DeleteSingleRecordButton from "@/components/deleteRecord/DeleteSingleRecordButton";
import UpdateBooleanSwitch from "@/components/updatePhoto/swtichUpdatePhotoBool";
import BooleanSwitchCell from "@/components/updateSwitch/BooleanSwitchCell";
import FormUpdateEvent from "../components/formUpdateEvent";
import QrCodeDownloadOnly from "@/components/qrcodeGen/QrCodeLinkDownload";
import { Separator } from "@/components/ui/separator";

export default function PAGEeventGallery() {

  const params = useParams();
  const idevent = params.idevent;
  const [update, setUpdate] = useState(0);
  const [event, setEvent] = useState({});
  const [photo, setPhoto] = useState([]);
  const [video, setVideo] = useState([]);
  const [errorEvent, setErrorEvent] = useState(null);
  const [errorPhoto, setErrorPhoto] = useState(null);
  const [errorVideo, setErrorVideo] = useState(null);

  const BUCKET = "albumevents";
  const mainTable = "event_album"
  const tablePhoto = "event_photo"
  const tableVideo = "event_video"

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchEventAlbum() {
      setErrorEvent(null);

      const { data, error } = await supabase
        .from(mainTable)
        .select("*")
        .eq("uuid", idevent)
        .maybeSingle();

      if (error) {
        setErrorEvent(error.message);
        setEvent(null);
      } else {
        setEvent(data);
      }
    }

    if (idevent) {
      fetchEventAlbum();
    }
  }, [idevent]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchPhoto() {
      setErrorPhoto(null);

      const { data, error } = await supabase
      .from(tablePhoto)
      .select("*")
      .eq("uuid_event", idevent)
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });

      if (error) {
        setErrorPhoto(error.message);
        setPhoto([]);
      } else {
        setPhoto(data || []);
      }
    }

    if (idevent) {
      fetchPhoto();
    }
  }, [idevent, update]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchVideo() {
      setErrorVideo(null);

      const { data, error } = await supabase
        .from(tableVideo)
        .select("*")
        .eq("uuid_event", idevent)
        .order("created_at", { ascending: true });

      if (error) {
        setErrorVideo(error.message);
        setVideo([]);
      } else {
        setVideo(data || []);
      }
    }

    if (idevent) {
      fetchVideo();
    }
  }, [idevent, update]);

  return (
    <div className="flex flex-col items-start justify-start gap-4 bg-neutral-200 font-sans dark:bg-neutral-950 w-full h-full p-5">
      <div className="flex flex-row items-center gap-3 w-full">
        <span>DATI ALBUM</span>
      </div>

      <div className="flex flex-col gap-3 justify-start bg-neutral-200 font-sans dark:bg-neutral-900 w-full h-full p-5 rounded-xl">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-white">{event?.title}</h3>
          <QrCodeDownloadOnly link={`${process.env.NEXT_PUBLIC_SITE_URL}/event/wdg/${event.uuid}`} fileName={`${event.title}-${event.event_date}-${event.uuid}`}/>
        </div>
        
        <Separator/>
        {errorEvent ? <p className="text-red-500 text-sm">{errorEvent}</p> : null}
        <FormUpdateEvent
          gallery={event}
          revalidate={[
            `/manager/gallery/gallery-management/${idevent}`,
            "/manager/gallery",
          ]}
        />
      </div>

      <div className="flex flex-row items-center gap-3 w-full">
        <span>FOTO</span>
      </div>

      <div className="flex flex-col justify-start bg-neutral-200 font-sans dark:bg-neutral-900 w-full h-full p-5 rounded-xl">
        {errorPhoto && <p className="text-red-500 text-sm mb-3">{errorPhoto}</p>}

        {photo?.length > 0 ? (
          <ListPhotoGallery photo={photo} bucket={BUCKET} setUpdate={setUpdate} tablePhoto={tablePhoto}/>
        ) : (
          <div>... nessuna foto caricata</div>
        )}
      </div>

      <div className="flex flex-row items-center gap-3 w-full">
        <span>VIDEO</span>
      </div>

      {video.length > 0 ? (
        <div className="flex flex-col justify-start bg-neutral-200 font-sans dark:bg-neutral-900 w-full h-full p-5 rounded-xl">
          {errorVideo && <p className="text-red-500 text-sm mb-3">{errorVideo}</p>}

          <div className="grid grid-cols-6 gap-3">
            {video.map((v) => (
              <div className="flex flex-col border rounded-2xl h-fit" key={v.uuid}>
                <YouTubePlayer link={v.link} />
                <div className="flex flex-row items-center justify-between">
                <DeleteSingleRecordButton tableName="event_video" columnName="uuid" uuid={v?.uuid} setUpdate={setUpdate}/>
                <BooleanSwitchCell tableName="event_video" fieldName="highlights" idColumn="uuid" idValue={v?.uuid}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-start bg-neutral-200 font-sans dark:bg-neutral-900 w-full h-full p-5 rounded-xl">
          ... nessun video caricato
        </div>
      )}
    </div>
  );
}