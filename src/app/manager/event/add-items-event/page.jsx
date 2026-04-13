import COMPuploadPhotoEvent from "./components/upload-photo-event";
import COMPuploadLinkVideoEvent from "./components/upload-video-link-event";
import { Separator } from "@/components/ui/separator";
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb";

export default function PAGEaddPhotoEvent() {
  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex xl:flex-row flex-col gap-4 h-full">
      <div className="flex flex-col gap-4 p-8 basis-3/6 border rounded-xl">
        <h3 className="font-bold">AGGIUNGI FOTO EVENTO</h3>
        <Separator/>
        <COMPuploadPhotoEvent />
      </div>
      <div className="flex flex-col gap-4 p-8 basis-3/6 bg-neutral-300 dark:bg-neutral-900 rounded-xl">
        <h3 className="font-bold">AGGIUNGI VIDEO EVENTO</h3>
        <Separator/>
        <COMPuploadLinkVideoEvent />
      </div>
    </div>
    </>
  );
}