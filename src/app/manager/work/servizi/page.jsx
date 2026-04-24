import { Separator } from "@/components/ui/separator"
import ElencoAnagraficaServizi from "./ElencoAnagraficaServizi"
import FormAnagraficaServizi from "./FormAnagraficaServizio"
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb"
import { DialogNeutral } from "@/components/dialogNeutral/dialogNeutral"

export default function PAGEpreventiviAnagrafica () {
  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex xl:flex-row flex-col h-full w-full gap-4">
      <div className="flex flex-col gap-3 bg-neutral-100 dark:bg-neutral-900 p-4 px-5 rounded-2xl border w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <span className="text-xs uppercase font-bold">Anagrafica Servizi</span>
          <DialogNeutral label="Aggiungi Servizio" title="Aggiungi Servizio" description="Inserisci un nuovo servizio nell'anagrafica" data={<FormAnagraficaServizi/>} className={`w-fit`}/>
        </div>
        <Separator/>
        <ElencoAnagraficaServizi/>
      </div>
    </div>
    </>
  )
}