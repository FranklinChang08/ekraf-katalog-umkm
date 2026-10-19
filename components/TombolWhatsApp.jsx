"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

// Ekstraksi opsi varian dari data produk di database maupun baris deskripsi
export function ekstrakVarian(produk) {
  if (!produk) return [];

  // 1. Cek kolom/properti varian langsung dari record produk jika tersedia di database
  const sumber = produk.varian ?? produk.variants ?? produk.opsi_varian;
  if (Array.isArray(sumber)) {
    return sumber.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof sumber === "string" && sumber.trim()) {
    const teks = sumber.trim();
    if (teks.startsWith("[") && teks.endsWith("]")) {
      try {
        const parsed = JSON.parse(teks);
        if (Array.isArray(parsed)) {
          return parsed.map(String).map((s) => s.trim()).filter(Boolean);
        }
      } catch {
        // Abaikan dan gunakan pemisahan koma
      }
    }
    return teks
      .split(/[,/|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // 2. Cek baris penanda varian/ukuran/warna dari teks deskripsi produk
  if (typeof produk.deskripsi === "string") {
    const match = produk.deskripsi.match(
      /(?:varian|pilihan\s*varian|pilihan\s*rasa|rasa|pilihan\s*ukuran|ukuran|size|warna|opsi)\s*:\s*([^\n\r.]+)/i
    );
    if (match && match[1]) {
      const hasil = match[1]
        .split(/[,/|]/)
        .map((s) => s.trim().replace(/^dan\s+/i, ""))
        .filter(Boolean);
      if (hasil.length > 0) {
        return hasil;
      }
    }
  }

  return [];
}

export default function TombolWhatsApp({ produk }) {
  const varianList = ekstrakVarian(produk);
  const [varianTerpilih, setVarianTerpilih] = useState(varianList[0] || "");
  const [jumlah, setJumlah] = useState(1);
  const [pesanError, setPesanError] = useState("");

  const stokTersedia = typeof produk?.stok === "number" ? produk.stok : null;
  const stokHabis = stokTersedia !== null && stokTersedia <= 0;

  const handleKurang = () => {
    if (stokHabis) return;
    setPesanError("");
    setJumlah((prev) => Math.max(1, prev - 1));
  };

  const handleTambah = () => {
    if (stokHabis) return;
    if (stokTersedia !== null && jumlah >= stokTersedia) {
      setPesanError(`Jumlah pesanan mencapai batas stok maksimal (${stokTersedia}).`);
      return;
    }
    setPesanError("");
    setJumlah((prev) => prev + 1);
  };

  const handleUbahInput = (e) => {
    if (stokHabis) return;
    const nilai = parseInt(e.target.value, 10);
    if (isNaN(nilai) || nilai < 1) {
      setJumlah(1);
      setPesanError("Jumlah minimal pembelian adalah 1.");
      return;
    }
    if (stokTersedia !== null && nilai > stokTersedia) {
      setJumlah(stokTersedia);
      setPesanError(`Jumlah tidak boleh melebihi stok yang tersedia (${stokTersedia}).`);
      return;
    }
    setPesanError("");
    setJumlah(nilai);
  };

  const hargaSatuan = produk?.harga || 0;
  const totalHarga = hargaSatuan * (stokHabis ? 0 : jumlah);

  // Buat pesan WhatsApp dengan informasi varian dan jumlah
  const namaProduk = produk?.nama || "";
  const infoVarian = varianTerpilih ? ` (Varian: ${varianTerpilih})` : "";
  const pesan = `Halo, saya ingin memesan ${namaProduk}${infoVarian} sebanyak ${jumlah} pcs dengan total seharga ${formatRupiah(
    totalHarga
  )}.`;

  const nomor = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  const href = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* Pilihan Varian (jika ada varian) */}
      {varianList.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-teks">
            Pilih varian: <span className="font-normal text-teks-lembut">{varianTerpilih}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {varianList.map((varian) => {
              const isDipilih = varianTerpilih === varian;
              return (
                <button
                  key={varian}
                  type="button"
                  onClick={() => setVarianTerpilih(varian)}
                  aria-pressed={isDipilih}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
                    isDipilih
                      ? "border border-utama bg-utama text-white shadow-xs"
                      : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                  }`}
                >
                  {varian}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Kontrol Jumlah Pembelian */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="jumlah-produk" className="text-sm font-semibold text-teks">
            Jumlah pembelian
          </label>
          {stokTersedia !== null && (
            <span
              className={`text-xs font-semibold ${
                stokHabis ? "text-bahaya" : "text-teks-lembut"
              }`}
            >
              {stokHabis ? "Stok habis" : `Tersedia: ${stokTersedia}`}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center rounded-lg border border-garis bg-latar p-1 shadow-xs">
            <button
              type="button"
              onClick={handleKurang}
              disabled={jumlah <= 1 || stokHabis}
              aria-label="Kurangi jumlah"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-permukaan text-base font-bold text-teks transition-colors hover:bg-garis disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>

            <input
              id="jumlah-produk"
              type="number"
              min={stokHabis ? 0 : 1}
              max={stokTersedia !== null ? stokTersedia : 999}
              value={stokHabis ? 0 : jumlah}
              onChange={handleUbahInput}
              disabled={stokHabis}
              className="w-14 text-center text-sm font-bold text-teks focus:outline-none disabled:bg-transparent"
            />

            <button
              type="button"
              onClick={handleTambah}
              disabled={stokHabis || (stokTersedia !== null && jumlah >= stokTersedia)}
              aria-label="Tambah jumlah"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-permukaan text-base font-bold text-teks transition-colors hover:bg-garis disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          {/* Ringkasan Subtotal */}
          <div className="flex flex-col">
            <span className="text-xs text-teks-lembut">Total harga</span>
            <span className="text-lg font-extrabold text-harga">
              {formatRupiah(totalHarga)}
            </span>
          </div>
        </div>

        {pesanError && <p className="text-xs font-medium text-bahaya">{pesanError}</p>}
      </div>

      {/* Tombol Pesan via WhatsApp */}
      {stokHabis ? (
        <button
          type="button"
          disabled
          className="inline-flex w-full items-center justify-center rounded-lg bg-garis px-5 py-3 font-semibold text-teks-lembut cursor-not-allowed sm:w-auto"
        >
          Stok Habis
        </button>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap sm:w-auto"
        >
          <svg
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.085-1.921-.444-1.286-.53-2.09-1.844-2.155-1.93-.064-.085-.505-.672-.505-1.283 0-.61.319-.908.431-1.03.113-.122.247-.152.33-.152.083 0 .166.002.239.006.077.004.18-.029.28.213.104.252.355.867.386.931.031.065.052.141.009.227-.043.085-.065.138-.129.213-.064.075-.136.168-.194.227-.065.064-.132.134-.057.263.075.129.333.55 1.011 1.055.679.505 1.25.661 1.428.75.178.089.283.077.389-.045.106-.122.455-.53.576-.711.121-.182.243-.152.408-.091.164.061 1.047.494 1.226.584.179.089.299.134.343.209.044.075.044.436-.1.841zM12 2C6.477 2 2 6.477 2 12c0 1.891.523 3.66 1.433 5.176L2 22l4.954-1.398A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.472-4.436-1.288l-.318-.2-2.946.832.839-2.871-.213-.339A8.127 8.127 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z" />
          </svg>
          Pesan via WhatsApp
        </a>
      )}
    </div>
  );
}
