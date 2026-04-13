import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import LogoutButton from "@/app/(site)/admin/user/LogoutButton";
import UserInfo from "@/app/(site)/admin/user/UserInfo";

export default async function PAGETest() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  
  const { data: profilo, error } = await supabase
    .from("utenti")
    .select("*")
    .eq("uuid", user.id)
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  return <span className="text-white">{profilo?.name}<LogoutButton/><UserInfo user={user} profilo={profilo}/></span>;
}