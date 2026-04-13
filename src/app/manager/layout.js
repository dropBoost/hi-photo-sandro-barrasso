import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { getSettings } from "@/lib/setting";

export default async function LAYOUTmanager({children}) {

  const supabase = await createSupabaseServerClient();
  const settings = await getSettings()

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) { redirect(`/admin/login`) }
  
  const { data: profilo, error } = await supabase
    .from("utenti")
    .select("*")
    .eq("uuid", user.id)
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  return (
    <SidebarProvider>
      {/* MODIFICARE QUESTO COMPONENTE PER IL MENU LATERLAE */}
      <AppSidebar profilo={profilo} settings={settings}/>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-2 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
