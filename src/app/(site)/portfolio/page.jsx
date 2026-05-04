import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ToggleDarkMode } from "@/components/ui/toggle-dark-mode";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { FaCaretRight, FaCircle } from "react-icons/fa";

export default async function PAGEPortfolio() {
  const supabase = await createSupabaseServerClient();
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const BUCKET = "assets";

  const { data: categories, error } = await supabase
    .from("category")
    .select("*")
    .order("alias", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  // BISOGNA FARE LA PAGINA DI TUTTE LE CATEOGIRE
  return (
  <div className="flex min-h-screen w-full items-center justify-center bg-neutral-100 font-sans">
    <main className="flex min-h-screen w-full flex-col items-center">
      <div className="w-full flex flex-col items-center justify-center font-light h-50 bg-brand">
        <h2 className="tracking-widest text-neutral-200">PORTFOLIO</h2>
      </div>
      <div className="w-full max-w-6xl lg:pb-20 lg:pt-10 p-5">
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 w-full gap-2">
          {categories.map((c, i) => {
          
          const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${c.img_cover}`;
          
          return (
            <div key={i} className="w-full aspect-square border lg:p-5 p-5 bg-cover bg-center" style={{backgroundImage:`url(${imageUrl})`}}>
              <div className="flex flex-row items-end justify-end gap-1 h-full w-full" >
                <div className="flex flex-row items-center bg-white px-2">
                  <FaCaretRight className={`text-xs`} style={{color:c?.color}}/><h3 className="font-bold tracking-wider text-neutral-800 text-xl">{c?.alias}</h3>
                </div>
              </div>
            </div>
          )})}

        </div>
      </div>
    </main>
  </div>
  );
}