import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createSessionClient } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin({ searchParams }) {
  const params = (await searchParams) || {};
  const pesanSukses = params.sukses || params.berhasil;

  let daftarProduk = [];
  let error = null;

  try {
    const supabase = await createSessionClient();
    const { data, error: queryError } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (queryError) {
      error = queryError.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    error = err.message || "Gagal mengambil data produk dari database.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-extrabold">Produk</h1>
          {!error && (
            <span className="text-sm text-teks-lembut">
              ({daftarProduk.length} produk)
            </span>
          )}
        </div>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanSukses && (
        <div className="rounded-xl border border-garis bg-permukaan p-3.5 text-sm font-medium text-utama">
          {pesanSukses}
        </div>
      )}

      {error ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm">
          <p className="font-semibold text-bahaya">Gagal memuat produk</p>
          <p className="mt-1 text-teks-lembut">{error}</p>
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
