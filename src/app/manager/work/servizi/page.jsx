import ElencoAnagraficaServizi from "./ElencoAnagraficaServizi"
import FormAnagraficaServizi from "./FormAnagraficaServizio"
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb"

export default function PAGEpreventiviAnagrafica () {
  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex lg:flex-row flex-col h-full w-full gap-4">
      <div className="flex-1 bg-neutral-300 dark:bg-neutral-900 p-6 rounded-2xl">
        <ElencoAnagraficaServizi/>
      </div>
      <div className="basis-2/6">
        <FormAnagraficaServizi/>
      </div>
    </div>
    </>
  )
}