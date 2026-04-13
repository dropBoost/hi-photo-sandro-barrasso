import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ToggleDarkMode } from "@/components/ui/toggle-dark-mode";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function PAGEPortfolio() {
  const supabase = await createSupabaseServerClient();

  const { data: categories, error } = await supabase
    .from("category")
    .select("*")
    .order("alias", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  // BISOGNA FARE LA PAGINA DI TUTTE LE CATEOGIRE
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-200 font-sans dark:bg-neutral-900">
      <main className="flex min-h-screen w-full flex-col items-center gap-4 bg-white dark:bg-black">
        <div className="flex h-220 w-full items-center justify-center border bg-[url('/hero.webp')] bg-cover bg-center bg-no-repeat">
          <h3 className="bg-neutral-100 px-3 py-1 dark:bg-neutral-950">
            when dream make a photo
          </h3>
        </div>

        <div className="flex w-full max-w-7xl items-start justify-start border px-22">
          <Button>Click me</Button>
          <ToggleDarkMode />
        </div>

        <div className="w-full max-w-7xl border px-22">
          <pre>{JSON.stringify(categories, null, 2)}</pre>
        </div>
      </main>
    </div>
  );
}