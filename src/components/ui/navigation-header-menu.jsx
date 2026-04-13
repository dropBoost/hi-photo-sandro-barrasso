import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaBars } from "react-icons/fa6";
import { ToggleDarkMode } from "./toggle-dark-mode";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Separator } from "./separator";

export async function NavigationHeaderMenu() {
  const supabase = await createSupabaseServerClient();

  const { data: category, error } = await supabase
    .from("category")
    .select("*")
    .eq("active", true);

  if (error) {
    console.log(error);
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <FaBars />
      </DrawerTrigger>

      <DrawerContent className="h-screen max-h-screen rounded-none">
        <DrawerHeader className="hidden">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

        <div className="flex h-full w-full flex-col p-6 gap-5">
          <div className="flex flex-row items-center">
            <ToggleDarkMode />
          </div>
          <div className="flex w-fit h-fit flex-col">
            {category?.map((c) => {
              return (
                <DrawerClose asChild key={c?.id}>
                  <Link href={`/portfolio/${c?.id}`} className="w-fit text-6xl uppercase text-neutral-300 transition-all hover:text-brand">
                    {c?.alias}
                  </Link>
                </DrawerClose>
              );
            })}
          </div>
          <Separator className={`m-0 p-0`}/>
          <div className="flex w-fit flex-col overflow-y-auto">
            <DrawerClose asChild>
              <Link href={`/about`} className="w-fit text-2xl uppercase text-neutral-300 transition-all hover:text-brand">
                ABOUT US
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link href={`/event`} className="w-fit text-2xl uppercase text-neutral-300 transition-all hover:text-brand">
                EVENT
              </Link>
            </DrawerClose>
          </div>

          <DrawerFooter className="border-t">
            <DrawerClose asChild>
              <Button variant="ghost">Chiudi</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}