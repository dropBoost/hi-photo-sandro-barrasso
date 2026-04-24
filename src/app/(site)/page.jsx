import COMPgalleryHomePage from "@/components/gallery-home-page";
import COMPeventHomePage from "@/components/event-home-page";
import { getSettings } from "@/lib/setting";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import COMPvideoHomePage from "@/components/video-home-page";
import GoogleMap from "@/components/maps";
import FormSiteContact from "./contact/formSiteContact";

export default async function PAGEHome() {

  const settings= await getSettings()
    
  return (
    <div className="flex min-h-screen items-center justify-centerfont-sans">
      <main className="flex min-h-screen w-full flex-col items-center">
        {/* IMMAGINE BANNER */}
        <div className="flex items-center justify-center w-full h-220 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${settings?.homeBanner}")` }}>
            <h3 className="dark:bg-neutral-950 bg-neutral-100 px-3 py-1">{settings?.homeBannerTitle}</h3>
        </div>
        <div className="flex flex-col items-center justify-start gap-3 bg-neutral-200 dark:bg-black w-full md:py-16 p-5">
          <div className="max-w-7xl">
            <COMPgalleryHomePage/>
          </div>
        </div>
        {/* CONTENITORE PRINCIPALE BODY */}
        <div className="flex flex-col lg:gap-7 gap-5 w-full max-w-7xl p-5">
          <div className="flex flex-row items-center gap-3">
            <Label className={`bg-brand text-white px-2 py-1 text-xs font-extralight`}>ABOUT US</Label>
            <Separator className="flex-1" />
          </div>
          <div className="flex flex-col gap-5 bg-neutral-200 dark:bg-white dark:text-neutral-950 text-neutral-600 border p-20 text-sm rounded-md">
            <div className="w-full text-sm text-neutral-500" dangerouslySetInnerHTML={{ __html: settings?.bioHome || "" }} />
            <Link className="bg-brand text-xs text-white px-2 w-fit" href="/about">continua a leggere</Link>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Label className={`bg-brand text-white px-2 py-1 text-xs font-extralight`}>FILMMAKING</Label>
            <Separator className="flex-1" />
          </div>
          <div className="flex flex-row border p-5 rounded-md">
            <COMPvideoHomePage/>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Label className={`bg-brand text-white px-2 py-1 text-xs font-extralight`}>EVENT</Label>
            <Separator className="flex-1" />
          </div>
          <div className="flex flex-col items-start justify-start gap-3">
            <COMPeventHomePage settings={settings}/>
          </div>

        </div>
        <div className="flex flex-col items-center justify-center bg-neutral-300  border w-full lg:p-10 p-5 gap-6">
          <div className="flex flex-row items-center gap-3 w-full max-w-7xl">
            <Label className={`bg-brand text-white px-2 py-1 text-xs font-extralight`}>CONTATTACI</Label>
            <Separator className="flex-1" />
          </div>
          <div className="min-h-139 flex lg:flex-row flex-col w-full max-w-7xl bg-neutral-100 dark:text-neutral-950 text-neutral-600 border text-sm rounded-md gap-3 lg:p-5">
            <div className="lg:order-1 order-2 lg:basis-3/6 basis-2/6">
              <GoogleMap address={`${ settings?.aboutMaps }`}/>
            </div>
            <div className="lg:order-2 order-1 lg:basis-3/6 basis-4/6 p-10">
              <FormSiteContact/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
