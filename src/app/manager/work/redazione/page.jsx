import FormCreatePreventivo from "./FormCreatePreventivo"
import FormCreatePreventiviItem from "./FormCreatePreventiviItem"
import { createSupabaseServerClient } from "@/utils/supabase/server";
import ElencoPreventivoItem from "./ElencoPreventivoItems";
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb";
import { DialogNeutral } from "@/components/dialogNeutral/dialogNeutral";
import { Separator } from "@/components/ui/separator";

export default async function PAGEpreventiviRedazione () {

  const supabase = await createSupabaseServerClient();

  const [{ data: preventivi, error: errorPreventivi }, { data: servizi, error: errorServizi }] =
    await Promise.all([
      supabase
        .from("preventivi")
        .select(`*,
          cliente:clienti_anagrafica(*)`)
        .order("id", { ascending: false }),

      supabase
        .from("preventivi_servizi")
        .select("*")
        .order("nome_servizio", { ascending: true }),
    ]);

  if (errorPreventivi) {
    console.log(errorPreventivi.message);
  }

  if (errorServizi) {
    console.log(errorServizi.message);
  }

  return (
    <>
    <BreadcrumbCOMP/>
    <div className="flex xl:flex-col flex-col h-full gap-4 w-full">
      <Separator/>
      <div className="flex flex-row justify-center w-full">
        <DialogNeutral data={<FormCreatePreventivo/>} className={`bg-neutral-950/30 w-full h-full lg:p-20 p-5 border-none rounded-none`} label="Aggiungi Preventivo"/>
      </div>
      <Separator/>
      <div className="flex xl:flex-row flex-col gap-5 w-full rounded-2xl">
        <div className="basis-3/6">
          <FormCreatePreventiviItem
            preventivi={preventivi || []}
            servizi={servizi || []}
          />
        </div>
        <div className="basis-3/6">
          <ElencoPreventivoItem/>
        </div>
      </div>
    </div>
    </>
  )
}