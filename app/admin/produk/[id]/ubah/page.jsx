import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createSessionClient } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  const supabase = await createSessionClient();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  const ubahProdukWithId = ubahProduk.bind(null, produk.id);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Ubah produk</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Perbarui informasi produk di katalog toko Anda.
        </p>
      </div>
      <FormProduk
        action={ubahProdukWithId}
        produk={produk}
        labelTombol="Simpan perubahan"
      />
    </div>
  );
}
