import FormCreateCategory from "@/components/createCategory/FormCreateCategory"
import COMPlistCategory from "./components/list-category"
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb"

export default function PAGEcategoryManagement () {
  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex 2xl:flex-row flex-col gap-4 h-full p-2">
      <div className="lg:order-1 order-2 basis-4/6">
        <COMPlistCategory/>
      </div>
      <div className="lg:order-2 order-1 flex flex-col gap-3 items-center px-8 py-5 basis-2/6 dark:bg-neutral-900 bg-neutral-200 rounded-xl">
        <h3 className="text-xs font-bold">AGGIUNGI NUOVA CATEGORIA</h3>
        <FormCreateCategory/>
      </div>
    </div>
    </>
  )
}