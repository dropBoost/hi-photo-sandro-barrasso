"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export async function registerUserAction(prevState, formData) {
  try {
    const name = formData.get("name")?.toString().trim();
    const surname = formData.get("surname")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const phone = formData.get("phone")?.toString().trim();
    const role = formData.get("role")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const confirmPassword = formData.get("confirmPassword")?.toString().trim();

    if (!name || !surname || !email || !phone || !role || !password || !confirmPassword) {
      return {
        success: false,
        message: "Compila tutti i campi.",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "La password deve contenere almeno 6 caratteri.",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Le password non coincidono.",
      };
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          name,
          surname,
          phone,
          role,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    revalidatePath("/admin/register");

    return {
      success: true,
      message: "Registrazione completata. Controlla la tua email per confermare l'account.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Errore durante la registrazione.",
    };
  }
}