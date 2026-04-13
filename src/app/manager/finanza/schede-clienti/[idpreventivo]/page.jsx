import PreventivoAcconti from "./preventivoAcconti"
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb"

export default async function PAGEpreventiviAnagrafica ({params}) {

  const {idpreventivo} = await params

  return (
    <>
    <BreadcrumbCOMP label={`preventivo: ${idpreventivo}`}/>
    <div className="flex flex-col items-center h-full w-full bg-neutral-300 dark:bg-neutral-900 p-6 rounded-2xl">
      <PreventivoAcconti idpreventivo={idpreventivo}/>
    </div>
    </>
  )
}