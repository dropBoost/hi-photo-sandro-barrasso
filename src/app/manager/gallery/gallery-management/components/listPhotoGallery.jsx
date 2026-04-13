"use client";

import { useTransition, useState } from "react";
import DeleteGalleryPhotoButton from "@/components/deletePhoto/deleteGalleryPhotoButton";
import Image from "next/image";
import UpdateBooleanSwitch from "@/components/updatePhoto/swtichUpdatePhotoBool";
import { Button } from "@/components/ui/button";
import { moveGalleryPhotoOrderAction } from "../action/updateGalleryPhotoOrder.action";

export default function ListPhotoGallery({ photo, bucket, setUpdate }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  function publicUrl(path) {
    if (!path) return null;
    const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!domain) return null;
    return `${domain}/storage/v1/object/public/${bucket}/${path}`;
  }

  function handleDeletedPhoto() {
    setUpdate((prev) => prev + 1);
  }

  function handleUpdatedSwitch() {
    setUpdate((prev) => prev + 1);
  }

  function handleMove(uuid, direction) {
    setMsg("");

    startTransition(async () => {
      const res = await moveGalleryPhotoOrderAction({ uuid, direction });

      if (!res?.success) {
        setMsg(res?.error || "Errore durante il riordino");
        return;
      }

      setUpdate((prev) => prev + 1);
    });
  }

  return (
    <>
      {msg ? <div className="mb-3 text-sm text-red-500">{msg}</div> : null}

      <div className="grid xl:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-3">
        {photo?.map((p, index) => (
          <div className="flex flex-col border rounded-md p-3 gap-3" key={p.uuid}>
            <Image
              className="w-full aspect-square object-cover rounded-md"
              src={publicUrl(p.link)}
              width={300}
              height={300}
              quality={75}
              alt=""
            />

            <div className="flex flex-col gap-2">
              <div className="text-xs opacity-70">
                Ordine: {p.order}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending || index === 0}
                  onClick={() => handleMove(p.uuid, "up")}
                >
                  Su
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending || index === photo.length - 1}
                  onClick={() => handleMove(p.uuid, "down")}
                >
                  Giù
                </Button>
              </div>

              <div className="flex flex-row justify-between items-center pt-1">
                <DeleteGalleryPhotoButton
                  uuid={p.uuid}
                  uuidGallery={p.uuid_gallery}
                  link={p.link}
                  bucket={bucket}
                  tablePhoto="gallery_photo"
                  onDeleted={handleDeletedPhoto}
                />
                <UpdateBooleanSwitch
                  table="gallery_photo"
                  field="cover"
                  uuid={p.uuid}
                  value={p.cover}
                  onUpdated={handleUpdatedSwitch}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}