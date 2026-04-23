import Link from "next/link";
import { FaBars } from "react-icons/fa6";
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
import { Separator } from "./separator";
import { ToggleDarkMode } from "./toggle-dark-mode";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { socialLink } from "@/lib/social-link";

export async function NavigationHeaderMenu() {
  const supabase = await createSupabaseServerClient();
  const socials = await socialLink();

  const { data: category, error } = await supabase
    .from("category")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: true });

  if (error) {
    console.log(error);
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button type="button" className="cursor-pointer">
          <FaBars />
        </button>
      </DrawerTrigger>

      <DrawerContent className="h-screen max-h-screen rounded-none">
        <DrawerHeader className="hidden">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Navigazione principale</DrawerDescription>
        </DrawerHeader>

        <div className="flex h-full w-full flex-col gap-5 p-6">
          <div className="flex flex-row items-center">
            <ToggleDarkMode />
          </div>

          {socials?.length > 0 && <Separator className="m-0 max-w-50 p-0" />}

          <div className="flex h-fit w-fit flex-row gap-3">
            {socials?.map((s) => (
              <a
                key={s.key}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row items-center gap-2 text-xl transition-all hover:text-brand"
              >
                <span>{s.icon}</span>
              </a>
            ))}
          </div>

          {socials?.length > 0 && <Separator className="m-0 max-w-70 p-0" />}

          <div className="flex h-fit w-fit flex-col">
            {category?.map((c) => (
              <DrawerClose asChild key={c.id}>
                <Link
                  href={`/portfolio/${c.id}`}
                  className="w-fit uppercase text-neutral-300 transition-all hover:text-brand text-6xl"
                >
                  {c.alias}
                </Link>
              </DrawerClose>
            ))}
          </div>

          <Separator className="m-0 p-0" />

          <div className="flex w-fit flex-col overflow-y-auto">
            <DrawerClose asChild>
              <Link
                href="/about"
                className="w-fit text-2xl uppercase text-neutral-300 transition-all hover:text-brand"
              >
                ABOUT US
              </Link>
            </DrawerClose>

            <DrawerClose asChild>
              <Link
                href="/event"
                className="w-fit text-2xl uppercase text-neutral-300 transition-all hover:text-brand"
              >
                EVENT
              </Link>
            </DrawerClose>
          </div>

          <DrawerFooter className="items-end">
            <DrawerClose asChild>
              <Button
                variant="icon"
                className="aspect-square bg-brand p-3 text-xs flex items-center justify-center"
              >
                X
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}