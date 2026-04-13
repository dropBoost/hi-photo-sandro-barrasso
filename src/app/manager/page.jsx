import COMPmenuManager from "@/components/menuManager/menuManager";
import { Separator } from "@/components/ui/separator";
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb";

export default function PAGEmanager() {

  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex xl:flex-row flex-col gap-4 h-full">
      <div className="flex flex-col gap-4 p-8 basis-2/6 rounded-xl bg-neutral-100/10">
        <COMPmenuManager/>
      </div>
    </div>
    </>
  );

}