import "server-only";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import {
  FaWhatsappSquare,
  FaPhoneSquareAlt,
  FaEnvelope,
  FaInstagramSquare,
  FaFacebookSquare,
  FaTiktok,
} from "react-icons/fa";

const iconMap = {
  socialFacebook: <FaFacebookSquare />,
  socialInstagram: <FaInstagramSquare />,
  socialTikTok: <FaTiktok />,
  socialMail: <FaEnvelope />,
  socialWhatsapp: <FaWhatsappSquare />,
  socialTel: <FaPhoneSquareAlt />,
};

export async function socialLink() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("setting")
    .select("key, value, group")
    .eq("group", "social")
    .order("key", { ascending: true });

  if (error) {
    console.log(error);
    return [];
  }

  return data
    .filter((item) => item.value && item.value !== "#")
    .map((item) => ({
      key: item.key,
      link: item.value,
      icon: iconMap[item.key] || null,
    }));
}