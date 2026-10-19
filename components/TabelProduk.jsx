import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";

export default function TabelProduk({ daftarProduk = [] }) {
  if (!daftarProduk || daftarProduk.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-garis bg-permukaan/40 py-16 text-center">
        <p className="text-base font-semibold text-teks">Belum ada produk</p>
        <p className="mt-1 text-sm text-teks-lembut">
          Tabel produk masih kosong. Tambahkan produk baru untuk menampilkannya di katalog toko.
        </p>
        <div className="mt-5">
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-garis bg-latar">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-garis bg-permukaan text-xs font-semibold text-teks-lembut">
          <tr>
            <th className="px-5 py-3.5">Produk</th>
            <th className="px-5 py-3.5">Kategori</th>
            <th className="px-5 py-3.5">Harga</th>
            <th className="px-5 py-3.5 text-right">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-garis">
          {daftarProduk.map((produk) => (
            <tr key={produk.id} className="transition-colors hover:bg-permukaan/30">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3.5">
                  {produk.foto_url ? (
                    <img
                      src={produk.foto_url}
                      alt={produk.nama || ""}
                      className="h-11 w-11 rounded-lg border border-garis bg-permukaan object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-garis bg-permukaan text-xs font-bold text-teks-lembut">
                      {produk.nama?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-teks">{produk.nama}</span>
                    {produk.deskripsi && (
                      <span className="line-clamp-1 max-w-xs text-xs text-teks-lembut">
                        {produk.deskripsi}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center rounded-md bg-permukaan px-2.5 py-1 text-xs font-medium text-teks-lembut">
                  {produk.kategori || "Umum"}
                </span>
              </td>
              <td className="px-5 py-4 font-semibold text-teks">
                {formatRupiah(produk.harga)}
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  {/* US-09 dan US-10 (bonus): ubah dan hapus produk */}
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis" className="text-xs px-3 py-1.5">
                    Ubah
                  </Tombol>
                  <Tombol type="button" varian="bahaya" className="text-xs px-3 py-1.5">
                    Hapus
                  </Tombol>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
