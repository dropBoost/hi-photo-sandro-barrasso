import { getSettings } from "@/lib/setting";
import Image from "next/image";
import Link from "next/link";

export default async function Footer () {

  const s = await getSettings();
  
  return (
    <>
    <div className="flex flex-col items-center dark:bg-muted bg-neutral-300 min-h-100 mt-10">
      <div className="flex flex-row bg-brand w-full items-center justify-center gap-1 p-2 text-xs text-neutral-200 dark:text-neutral-900">
        <span className="font-bold">{s?.companyName}</span>
        <span className="uppercase font-light">{s?.payoff}</span>
      </div>
      <div className="flex flex-row max-w-7xl w-full p-6">
        <div className="basis-2/6">
          <span className="text-xs">MENU</span>
        </div>
      </div>
    </div>
    <Link href={`https://www.dropboost.it`} target="_blank">
      <div className="flex items-center justify-center py-4 h-12 border-t">
        <span className="text-xs">{s?.poweredBy}</span>
      </div>
    </Link>
    </>
  )
}