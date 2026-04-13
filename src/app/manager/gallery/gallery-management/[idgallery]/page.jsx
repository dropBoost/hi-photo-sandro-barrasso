"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import YouTubePlayer from "@/components/youtubePlayer";
import FormUpdateGallery from "../components/formUpdateGallery";
import ListPhotoGallery from "../components/listPhotoGallery";
import DeleteSingleRecordButton from "@/components/deleteRecord/DeleteSingleRecordButton";
import BooleanSwitchCell from "@/components/updateSwitch/BooleanSwitchCell";

export default function PAGEeventGallery() {

  const params = useParams();
  const idgallery = params.idgallery;
  const [update, setUpdate] = useState(0);
  const [gallery, setGallery] = useState({});
  const [photo, setPhoto] = useState([]);
  const [video, setVideo] = useState([]);
  const [errorGallery, setErrorGallery] = useState(null);
  const [errorPhoto, setErrorPhoto] = useState(null);
  const [errorVideo, setErrorVideo] = useState(null);

  const BUCKET = "photogallery";

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchGallery() {
      setErrorGallery(null);

      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("uuid", idgallery)
        .maybeSingle();

      if (error) {
        setErrorGallery(error.message);
        setGallery(null);
      } else {
        setGallery(data);
      }
    }

    if (idgallery) {
      fetchGallery();
    }
  }, [idgallery]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchPhoto() {
      setErrorPhoto(null);

      const { data, error } = await supabase
      .from("gallery_photo")
      .select("*")
      .eq("uuid_gallery", idgallery)
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });

      if (error) {
        setErrorPhoto(error.message);
        setPhoto([]);
      } else {
        setPhoto(data || []);
      }
    }

    if (idgallery) {
      fetchPhoto();
    }
  }, [idgallery, update]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchVideo() {
      setErrorVideo(null);

      const { data, error } = await supabase
        .from("gallery_video")
        .select("*")
        .eq("uuid_gallery", idgallery)
        .order("created_at", { ascending: true });

      if (error) {
        setErrorVideo(error.message);
        setVideo([]);
      } else {
        setVideo(data || []);
      }
    }

    if (idgallery) {
      fetchVideo();
    }
  }, [idgallery, update]);

  return (
    <div className="flex flex-col items-start justify-start gap-4 bg-neutral-200 font-sans dark:bg-neutral-950 w-full h-full p-5">
      <div className="flex flex-row items-center gap-3 w-full">
        <span>DATI ALBUM</span>
      </div>

      <div className="flex flex-col justify-start bg-neutral-200 font-sans dark:bg-neutral-900 w-full h-full p-5 rounded-xl">
        <h3 className="text-white">{gallery?.title}</h3>
        <p className="text-red-500 text-sm">{errorGallery}</p>
        <FormUpdateGallery
          gallery={gallery}
          revalidate={[
            `/manager/gallery/gallery-management/${idgallery}`,
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
          <ListPhotoGallery photo={photo} bucket={BUCKET} setUpdate={setUpdate}/>
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

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-3">
            {video.map((v) => (
              <div className="flex flex-col border rounded-2xl h-fit p-3 gap-3" key={v.uuid}>
                <div className="">
                  <YouTubePlayer link={v.link} />
                </div>
                <div className="flex flex-row items-center justify-between">
                <DeleteSingleRecordButton tableName="gallery_video" columnName="uuid" uuid={v.uuid} setUpdate={setUpdate}/>
                <BooleanSwitchCell tableName="gallery_video" fieldName="highlights" idColumn="uuid" idValue={v.uuid}/>
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