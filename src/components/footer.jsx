import { getSettings } from "@/lib/setting";
import Link from "next/link";

export default async function Footer () {

  const s = await getSettings();
  
  return (
    <>
    <Link href={`https://www.dropboost.it`} target="_blank">
      <div className="flex items-center justify-center py-4 h-12 border-t">
        <span className="text-xs">{s?.poweredBy}</span>
      </div>
    </Link>
    </>
  )
}