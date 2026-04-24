import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb"
import COMPelencoClientiAnagrafica from "./elencoAnagrafica"

export default function PAGEanagrafica () {
  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex lg:flex-row flex-col h-full gap-4">
      <div className="basis-6/6 bg-white dark:bg-neutral-900 p-6 rounded-2xl overflow-auto">
      <COMPelencoClientiAnagrafica/>
      </div>
    </div>
    </>
  )
}