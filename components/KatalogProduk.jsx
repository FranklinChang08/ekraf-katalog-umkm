"use client";

import { useState, useTransition, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogProduk({ daftarProduk = [] }) {
  const [inputKueri, setInputKueri] = useState("");
  const [kueri, setKueri] = useState("");
  const [kategoriDipilih, setKategoriDipilih] = useState("Semua");
  const [isPending, startTransition] = useTransition();

  // Ambil daftar kategori unik dari data produk
  const daftarKategori = useMemo(() => {
    const setKategori = new Set();
    daftarProduk.forEach((item) => {
      if (item.kategori && item.kategori.trim()) {
        setKategori.add(item.kategori.trim());
      }
    });
    return ["Semua", ...Array.from(setKategori)];
  }, [daftarProduk]);

  // Hitung jumlah produk per kategori untuk badge informasi
  const hitungPerKategori = useMemo(() => {
    const counts = { Semua: daftarProduk.length };
    daftarProduk.forEach((item) => {
      const kat = item.kategori?.trim();
      if (kat) {
        counts[kat] = (counts[kat] || 0) + 1;
      }
    });
    return counts;
  }, [daftarProduk]);

  // Filter gabungan: pencarian teks + kategori
  const produkTersaring = useMemo(() => {
    const kataKunci = kueri.trim().toLowerCase();
    return daftarProduk.filter((item) => {
      const cocokKategori =
        kategoriDipilih === "Semua" ||
        item.kategori?.trim().toLowerCase() === kategoriDipilih.toLowerCase();

      if (!cocokKategori) return false;

      if (!kataKunci) return true;

      const nama = item.nama?.toLowerCase() || "";
      const deskripsi = item.deskripsi?.toLowerCase() || "";
      const kategori = item.kategori?.toLowerCase() || "";

      return nama.includes(kataKunci) || deskripsi.includes(kataKunci) || kategori.includes(kataKunci);
    });
  }, [daftarProduk, kategoriDipilih, kueri]);

  const handleKueriChange = (e) => {
    const val = e.target.value;
    setInputKueri(val);
    startTransition(() => {
      setKueri(val);
    });
  };

  const handleClearKueri = () => {
    setInputKueri("");
    startTransition(() => {
      setKueri("");
    });
  };

  const handlePilihKategori = (kat) => {
    startTransition(() => {
      setKategoriDipilih(kat);
    });
  };

  const handleResetSemua = () => {
    setInputKueri("");
    startTransition(() => {
      setKueri("");
      setKategoriDipilih("Semua");
    });
  };

  if (daftarProduk.length === 0) {
    return <p className="text-teks-lembut">Belum ada produk</p>;
  }

  const adaFilterAktif = kueri.trim() !== "" || kategoriDipilih !== "Semua";

  return (
    <div className="flex flex-col gap-6">
      {/* Kontrol Pencarian & Filter Kategori */}
      <div className="flex flex-col gap-3">
        {/* Kolom Pencarian */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-teks-lembut">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="search"
            value={inputKueri}
            onChange={handleKueriChange}
            placeholder="Cari nama produk, kategori, atau deskripsi..."
            aria-label="Cari produk"
            className="w-full rounded-xl border border-garis bg-latar py-2.5 pl-10 pr-10 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none focus:ring-1 focus:ring-utama sm:text-base"
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isPending ? (
              <span
                aria-label="Menyaring hasil..."
                className="h-4 w-4 animate-spin rounded-full border-2 border-garis border-t-utama"
              />
            ) : inputKueri ? (
              <button
                type="button"
                onClick={handleClearKueri}
                aria-label="Hapus teks pencarian"
                className="rounded-full p-1 text-teks-lembut hover:bg-permukaan hover:text-teks"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {/* Filter Kategori Pills */}
        {daftarKategori.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {daftarKategori.map((kat) => {
              const isAktif = kategoriDipilih === kat;
              const jumlah = hitungPerKategori[kat] ?? 0;
              return (
                <button
                  key={kat}
                  type="button"
                  onClick={() => handlePilihKategori(kat)}
                  aria-pressed={isAktif}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                    isAktif
                      ? "bg-utama text-white shadow-xs"
                      : "border border-garis bg-permukaan text-teks hover:border-utama hover:text-utama"
                  }`}
                >
                  <span>{kat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isAktif ? "bg-white/20 text-white" : "bg-latar text-teks-lembut"
                    }`}
                  >
                    {jumlah}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bar Status Filter & Reset */}
        {adaFilterAktif && (
          <div className="flex items-center justify-between text-xs text-teks-lembut sm:text-sm">
            <span>
              Menampilkan {produkTersaring.length} dari {daftarProduk.length} produk
              {kategoriDipilih !== "Semua" && (
                <>
                  {" "}
                  di kategori <span className="font-semibold text-teks">{kategoriDipilih}</span>
                </>
              )}
              {kueri.trim() && (
                <>
                  {" "}
                  untuk &ldquo;<span className="font-semibold text-teks">{kueri.trim()}</span>&rdquo;
                </>
              )}
            </span>
            <button
              type="button"
              onClick={handleResetSemua}
              className="font-semibold text-utama hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      {/* Daftar Produk atau Tampilan Kosong */}
      {produkTersaring.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-garis bg-permukaan/40 px-4 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-permukaan text-teks-lembut">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-teks">Tidak ada produk yang cocok</h3>
          <p className="mt-1 max-w-sm text-sm text-teks-lembut">
            Tidak ditemukan produk dengan kata kunci &ldquo;{kueri}&rdquo;
            {kategoriDipilih !== "Semua" ? ` pada kategori ${kategoriDipilih}` : ""}. Coba kata kunci
            lain atau ubah pilihan kategori.
          </p>
          <button
            type="button"
            onClick={handleResetSemua}
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
          >
            Tampilkan semua produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTersaring.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

