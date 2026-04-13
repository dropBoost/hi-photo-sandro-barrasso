import FormCreateCategory from "@/components/createCategory/FormCreateCategory"
import COMPlistCategory from "./components/list-category"
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb"

export default function PAGEcategoryManagement () {
  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex xl:flex-row flex-col gap-4 h-full p-2">
      <div className="basis-4/6">
        <COMPlistCategory/>
      </div>
      <div className="px-8 py-5 basis-2/6 bg-neutral-900 rounded-xl">
        <h3>AGGIUNGI NUOVA CATEGORIA</h3>
        <FormCreateCategory/>
      </div>
    </div>
    </>
  )
}