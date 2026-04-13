import { getSettings } from "@/lib/setting";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import GoogleMap from "@/components/maps";

export default async function PAGEabout () {

  const s = await getSettings()

  return (
    <>
    <div className="flex flex-col bg-neutral-200 font-sans dark:bg-neutral-950 justify-start items-center w-full h-full">
        <div className="flex lg:flex-row flex-col gap-4 max-w-7xl">
          <div className="basis-2/6">
            <Image className="h-full object-cover object-center" src={s?.aboutPhoto} width={600} height={600} quality={70} alt="foto-bio"></Image>
          </div>
          <div className="flex flex-col basis-4/6 p-10 gap-4">
            <div className="flex flex-row items-center gap-3">
              <Label className={`bg-brand px-2 py-1 text-xs font-extralight`}>ABOUT</Label>
            </div>
            <div className="text-[0.8rem]" dangerouslySetInnerHTML={{ __html: s?.aboutBio || "" }} />
            <Link href="/contact" className={`flex items-center justify-start w-full `}>
            <span className="bg-brand px-2 py-1 text-xs font-extralight ">CONTATTACI</span>
            </Link>
          </div>
        </div>
        <div className="w-full text-[0.8rem]">
          <GoogleMap address={`${s?.aboutMaps}`}/>
        </div>
    </div>
    </>
  )
}