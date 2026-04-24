import COMPmenuManager from "@/components/menuManager/menuManager";
import { Separator } from "@/components/ui/separator";
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb";

export default function PAGEmanager() {

  return (
    <>
    <BreadcrumbCOMP/>
    <div className="border rounded-xl p-5 h-full">
      <COMPmenuManager/>
    </div>
    </>
  );

}