import { createSupabaseServerClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";

export default async function COMPgalleryHomePage () {

  const supabase = await createSupabaseServerClient();
  const BUCKET = "assets"

  const { data: categories, error } = await supabase
    .from("category")
    .select("*")
    .eq("active", true)
    .order("alias", { ascending: true });

  if (error) throw new Error(error.message);

  function publicUrl(path) {
    if (!path) return null;
    const domain = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!domain) return null;
    return `${domain}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  return (
    <>
    <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
      {categories.map(c => (
        <Link key={c?.id} href={`/portfolio/${c?.id}`}>
        <div className="aspect-4/5 flex flex-col gap-2 border border-neutral-300 dark:border-neutral-900 p-4 pb-8 rounded-md hover:border-brand hover:dark:border-brand transition-all hover:shadow-xl">
          <Image className="grayscale hover:grayscale-0 brightness-50 hover:brightness-100 transition-all duration-500 aspect-4/5 object-center object-cover" src={`${publicUrl(c?.img_cover)}`} width={500} height={500} quality={75} alt={`photo - ${c.alias}`}/>
          <div className="flex flex-row items-center text-neutral-600 dark:text-neutral-400">
            <FaCaretRight />
            <span className="text-xs italic pb-1">{c?.alias}</span>
          </div>
        </div>
        </Link>
      ))}
    </div>
    </>
  )
}