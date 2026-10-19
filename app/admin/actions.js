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

export async function gantiPassword(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const isActionState = maybeFormData instanceof FormData;

  const passwordBaru = formData?.get ? formData.get("password_baru")?.toString() : "";
  const konfirmasiPassword = formData?.get ? formData.get("konfirmasi_password")?.toString() : "";

  // 1. Verifikasi admin sudah login di server
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    if (isActionState) return { error: "Sesi telah berakhir. Silakan login kembali." };
    redirect("/admin/login?error=" + encodeURIComponent("Silakan login terlebih dahulu."));
  }

  // 2. Validasi input di server
  if (!passwordBaru || !konfirmasiPassword) {
    const msg = "Semua kolom password wajib diisi.";
    if (isActionState) return { error: msg };
    redirect(`/admin/password?error=${encodeURIComponent(msg)}`);
  }

  if (passwordBaru.length < 8) {
    const msg = "Password baru minimal 8 karakter.";
    if (isActionState) return { error: msg };
    redirect(`/admin/password?error=${encodeURIComponent(msg)}`);
  }

  if (passwordBaru !== konfirmasiPassword) {
    const msg = "Password baru dan konfirmasi password tidak sama.";
    if (isActionState) return { error: msg };
    redirect(`/admin/password?error=${encodeURIComponent(msg)}`);
  }

  // 3. Update password di Supabase Auth
  const { error: updateError } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (updateError) {
    const msg = updateError.message;
    if (isActionState) return { error: msg };
    redirect(`/admin/password?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/admin/password");
  if (isActionState) return { sukses: "Password berhasil diganti." };
  redirect("/admin/password?sukses=" + encodeURIComponent("Password berhasil diganti."));
}

export { gantiPassword as ubahPassword };
