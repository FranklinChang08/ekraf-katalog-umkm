"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";

export async function login(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const isActionState = maybeFormData instanceof FormData;

  const email = formData?.get ? formData.get("email")?.toString().trim() : "";
  const password = formData?.get ? formData.get("password")?.toString() : "";

  if (!email || !password) {
    const errorMsg = "Email dan password wajib diisi.";
    if (isActionState) return { error: errorMsg };
    redirect(`/admin/login?error=${encodeURIComponent(errorMsg)}`);
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorMsg =
      error.message === "Invalid login credentials"
        ? "Email atau password salah."
        : error.message;
    if (isActionState) return { error: errorMsg };
    redirect(`/admin/login?error=${encodeURIComponent(errorMsg)}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

