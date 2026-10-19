import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default function HalamanTambahProduk() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Tambah produk</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Tambahkan produk baru ke dalam katalog toko Anda.
        </p>
      </div>
      <FormProduk action={tambahProduk} labelTombol="Simpan produk" />
    </div>
  );
}
