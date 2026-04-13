import Image from "next/image"
import Link from "next/link";
import { NavigationHeaderMenu } from "./ui/navigation-header-menu";
import { getSettings } from "@/lib/setting";

export default async function Header () {

  const s = await getSettings();
  
  return (
    <>
    <div className="sticky top-0 z-50 flex flex-row items-center justify-between px-6 py-8 bg-neutral-950/80 backdrop-blur h-14">
      <Link href={`/`}>
        <div className="flex flex-row items-center gap-2">
            <Image src={s?.logo} width={50} height={50} quality={75} alt="logo" className="h-10"/>
          <div className="flex flex-row gap-2">
            <span className="text-xs font-bold text-brand">{s?.companyName}</span>
            {s?.payoff ? <span className="text-xs font-extralight uppercase">/</span> : null}
            {s?.payoff ? <span className="text-xs font-extralight uppercase">{s?.payoff}</span> : null}
          </div>
        </div>
      </Link>
      <div className="flex flex-row gap-2">
        <NavigationHeaderMenu />
      </div>
    </div>
    </>
  )
}