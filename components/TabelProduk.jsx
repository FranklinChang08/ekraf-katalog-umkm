"use client";

import { useState, useTransition, useEffect } from "react";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk = [] }) {
  const [list, setList] = useState(daftarProduk);
  const [produkUntukDihapus, setProdukUntukDihapus] = useState(null);
  const [notifikasi, setNotifikasi] = useState(null);
  const [sedangMenghapus, startTransition] = useTransition();

  useEffect(() => {
    setList(daftarProduk);
  }, [daftarProduk]);

  const handleKonfirmasiHapus = () => {
    if (!produkUntukDihapus) return;

    const id = produkUntukDihapus.id;
    startTransition(async () => {
      try {
        const res = await hapusProduk(id);
        if (res?.error) {
          setNotifikasi({ tipe: "error", pesan: res.error });
        } else {
          setList((prev) => prev.filter((p) => p.id !== id));
          setNotifikasi({
            tipe: "sukses",
            pesan: res?.pesan || `Produk "${produkUntukDihapus.nama}" berhasil dihapus.`,
          });
          setProdukUntukDihapus(null);
        }
      } catch (err) {
        setNotifikasi({
          tipe: "error",
          pesan: err?.message || "Terjadi kesalahan saat menghapus produk.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {notifikasi && (
        <div
          className={`flex items-center justify-between rounded-xl border border-garis bg-permukaan p-3.5 text-sm ${
            notifikasi.tipe === "sukses" ? "font-medium text-utama" : "text-bahaya"
          }`}
        >
          <span>{notifikasi.pesan}</span>
          <button
            type="button"
            onClick={() => setNotifikasi(null)}
            className="text-xs text-teks-lembut hover:text-teks"
          >
            Tutup
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-garis bg-permukaan/40 py-16 text-center">
          <p className="text-base font-semibold text-teks">Belum ada produk</p>
          <p className="mt-1 text-sm text-teks-lembut">
            Tabel produk masih kosong. Tambahkan produk baru untuk menampilkannya di katalog toko.
          </p>
          <div className="mt-5">
            <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
          </div>
        </div>
      ) : (
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
              {list.map((produk) => (
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
                      <Tombol
                        href={`/admin/produk/${produk.id}/ubah`}
                        varian="garis"
                        className="text-xs px-3 py-1.5"
                      >
                        Ubah
                      </Tombol>
                      <Tombol
                        type="button"
                        varian="bahaya"
                        className="text-xs px-3 py-1.5"
                        onClick={() => setProdukUntukDihapus(produk)}
                      >
                        Hapus
                      </Tombol>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog Konfirmasi Hapus Produk */}
      {produkUntukDihapus && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-hapus-judul"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-garis bg-latar p-6 shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex flex-col gap-1">
              <h2 id="dialog-hapus-judul" className="text-lg font-bold text-teks">
                Hapus Produk?
              </h2>
              <p className="text-sm text-teks-lembut">
                Apakah Anda yakin ingin menghapus produk ini? Data yang dihapus tidak dapat dipulihkan.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-garis bg-permukaan p-3">
              {produkUntukDihapus.foto_url ? (
                <img
                  src={produkUntukDihapus.foto_url}
                  alt=""
                  className="h-12 w-12 rounded-lg border border-garis bg-latar object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-garis bg-latar text-sm font-bold text-teks-lembut">
                  {produkUntukDihapus.nama?.charAt(0) || "?"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-teks">{produkUntukDihapus.nama}</span>
                <span className="text-xs text-teks-lembut">
                  {produkUntukDihapus.kategori || "Umum"} &bull; {formatRupiah(produkUntukDihapus.harga)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Tombol
                type="button"
                varian="garis"
                disabled={sedangMenghapus}
                onClick={() => setProdukUntukDihapus(null)}
              >
                Batal
              </Tombol>
              <Tombol
                type="button"
                varian="bahaya"
                disabled={sedangMenghapus}
                onClick={handleKonfirmasiHapus}
                className="gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sedangMenghapus && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {sedangMenghapus ? "Menghapus..." : "Ya, hapus"}
              </Tombol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
