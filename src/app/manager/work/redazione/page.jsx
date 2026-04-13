import FormCreatePreventivo from "./FormCreatePreventivo"
import FormCreatePreventiviItem from "./FormCreatePreventiviItem"
import { createSupabaseServerClient } from "@/utils/supabase/server";
import ElencoPreventivoItem from "./ElencoPreventivoItems";
import BreadcrumbCOMP from "@/components/headerBreadcrumb/breadcrumb";

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
    <div className="flex lg:flex-row flex-col h-full gap-4">
      <div className="basis-2/6">
        <FormCreatePreventivo/>
      </div>
      <div className="basis-2/6">
        <FormCreatePreventiviItem
          preventivi={preventivi || []}
          servizi={servizi || []}
        />
      </div>
      <div className="basis-2/6 border rounded-2xl p-5 overflow-auto">
        <ElencoPreventivoItem/>
      </div>
    </div>
    </>
  )
}