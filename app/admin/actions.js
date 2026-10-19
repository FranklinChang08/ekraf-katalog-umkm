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

export async function requireAuth() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login?error=" + encodeURIComponent("Silakan login terlebih dahulu."));
  }

  return { user, supabase };
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

export async function tambahProduk(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const isActionState = maybeFormData instanceof FormData;

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

  // 2. Ambil data dari form
  const nama = formData?.get ? formData.get("nama")?.toString().trim() : "";
  const hargaRaw = formData?.get ? formData.get("harga") : null;
  const kategori = formData?.get ? formData.get("kategori")?.toString().trim() || null : null;
  const fotoUrl = formData?.get ? formData.get("foto_url")?.toString().trim() || null : null;
  const deskripsi = formData?.get ? formData.get("deskripsi")?.toString().trim() || null : null;

  // 3. Validasi input
  if (!nama) {
    const msg = "Nama produk wajib diisi.";
    if (isActionState) return { error: msg };
    redirect(`/admin/produk/baru?error=${encodeURIComponent(msg)}`);
  }

  if (hargaRaw === null || hargaRaw === "" || isNaN(Number(hargaRaw))) {
    const msg = "Harga produk wajib diisi dengan angka.";
    if (isActionState) return { error: msg };
    redirect(`/admin/produk/baru?error=${encodeURIComponent(msg)}`);
  }

  const harga = Number(hargaRaw);
  if (harga < 0) {
    const msg = "Harga produk tidak boleh bernilai negatif.";
    if (isActionState) return { error: msg };
    redirect(`/admin/produk/baru?error=${encodeURIComponent(msg)}`);
  }

  // 4. Simpan ke database Supabase tabel "produk"
  const { error: insertError } = await supabase
    .from("produk")
    .insert([
      {
        nama,
        harga: Math.round(harga),
        kategori,
        foto_url: fotoUrl,
        deskripsi,
      },
    ]);

  if (insertError) {
    const msg = insertError.message || "Gagal menyimpan produk ke database.";
    if (isActionState) return { error: msg };
    redirect(`/admin/produk/baru?error=${encodeURIComponent(msg)}`);
  }

  // 5. Invalidate cache dan alihkan kembali ke /admin dengan notifikasi sukses
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  redirect("/admin?sukses=" + encodeURIComponent("Produk berhasil ditambahkan."));
}

export { gantiPassword as ubahPassword };
