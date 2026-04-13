import { getSettings } from "@/lib/setting";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import FormSiteContact from "./formSiteContact";

export default async function PAGEcontact () {

  const s = await getSettings()

  return (
    <>
    <div className="flex flex-col bg-neutral-200 font-sans dark:bg-neutral-950 justify-center items-center w-full h-full p-5">
        <div className="flex lg:flex-row flex-col gap-4 max-w-7xl border lg:rounded-2xl rounded-none">
          <div className="basis-2/6">
            <Image className="h-full object-cover object-center lg:rounded-2xl rounded-none" src={s?.aboutPhoto} width={600} height={600} quality={70} alt="foto-bio"></Image>
          </div>
          <div className="flex flex-col basis-4/6 p-10 gap-4">
           <FormSiteContact/>
          </div>
        </div>
    </div>
    </>
  )
}