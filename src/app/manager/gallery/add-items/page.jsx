import { Separator } from "@/components/ui/separator";
import COMPuploadPhotoGallery from "./components/upload-photo-gallery";
import COMPuploadLinkVideo from "./components/upload-video-link";
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb";

export default function PAGEaddPhoto() {
  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex xl:flex-row flex-col gap-4 h-full">
      <div className="flex flex-col gap-4 p-8 basis-3/6 border rounded-xl">
        <h3 className="font-bold">AGGIUNGI FOTO</h3>
        <Separator/>
        <COMPuploadPhotoGallery />
      </div>
      <div className="flex flex-col gap-4 p-8 basis-3/6 dark:bg-neutral-900 bg-neutral-300 rounded-xl">
        <h3 className="font-bold">AGGIUNGI VIDEO</h3>
        <Separator/>
        <COMPuploadLinkVideo />
      </div>
    </div>
    </>
  );
}