import { getSettings } from "@/lib/setting";
import COMPcategoryEventList from "./categoryEventList";
import FilterBar from "@/components/filterBar/FilterBar";
import { Separator } from "@/components/ui/separator";

export default async function PAGEEventCategory({ searchParams }) {
  const settings = await getSettings();

  const sp = await searchParams;
  const selectedDate = sp?.date || "";
  const selectedCategory = sp?.category || "";

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-start bg-neutral-100 font-sans dark:bg-neutral-950">
        <div className="flex flex-col items-center py-10 bg-brand w-full">
          <span className="uppercase font-extralight tracking-[1em]">
            EVENT GALLERY
          </span>
        </div>

        <div className="flex flex-col items-center py-5 w-full max-w-7xl">
          <FilterBar />
        </div>

        <Separator className="max-w-7xl dark:bg-neutral-900 bg-neutral-300" />

        <COMPcategoryEventList
          settings={settings}
          selectedDate={selectedDate}
          selectedCategory={selectedCategory}
        />
      </div>
    </>
  );
}