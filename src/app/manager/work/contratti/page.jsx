import ElencoContratti from "./ElencoContratti"
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb"

export default function PAGEcontratti () {
  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex lg:flex-row flex-col h-full gap-4">
      <div className="basis-6/6 bg-neutral-200 dark:bg-neutral-900 p-6 rounded-2xl">
      <ElencoContratti/>
      </div>
    </div>
    </>
  )
}