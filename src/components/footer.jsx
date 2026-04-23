import { getSettings } from "@/lib/setting";
import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { socialLink } from "@/lib/social-link";
import { Separator } from "./ui/separator";

export default async function Footer () {

  const s = await getSettings();
  const supabase = await createSupabaseServerClient()
  const socials = await socialLink()

  const { data: category, error } = await supabase
    .from("category")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return <div>Errore: {error.message}</div>;
  }
  
  return (
    <div className="flex flex-col items-center mt-10">
    <div className="flex flex-row bg-brand w-full items-center justify-center gap-1 p-2 text-xs text-neutral-200 dark:text-neutral-950">
      <span className="font-bold">{s?.companyName}</span>
      <span className="uppercase font-light">{s?.payoff}</span>
    </div>
    <div className="flex flex-col items-center justify-center max-w-7xl  bg-neutral-300 dark:bg-neutral-950 gap-6 w-full p-10">
      <div className="flex flex-row items-center md:gap-8 gap-2 lg:min-h-30 min-h-14">
        {category?.map((c,i) => (
          <Link key={c.id} href={`/portfolio/${c.id}`} className="text-neutral-500 uppercase text-xs font-semibold hover:text-neutral-50 px-3 py-1 rounded-lg" >{c.alias}</Link>
        ))}
      </div>
      {socials?.length > 0 ? <Separator/> : null}
      {socials?.length > 0 ?
      <div className="flex flex-row items-center gap-5">
        {socials?.map((s) => (
        <a className="flex flex-row items-center gap-2 text-sm hover:text-brand transition-all" key={s.key} href={s.link}>
          <span className="">{s.icon}</span>
        </a>
      ))}
      </div> : null }
    </div>
    <Link href={`https://www.dropboost.it`} target="_blank" className="dark:bg-neutral-900 w-full">
      <div className="flex items-center justify-center py-4 h-12">
        <span className="text-xs">{s?.poweredBy}</span>
      </div>
    </Link>
    </div>
  )
}