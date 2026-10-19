import NavAdmin from "@/components/NavAdmin";

export default function LoadingAdmin() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-permukaan" />
        <div className="h-10 w-36 animate-pulse rounded-lg bg-permukaan" />
      </div>
      <div className="rounded-2xl border border-garis bg-latar p-12">
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-teks-lembut">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-garis border-t-utama" />
          <p>Memuat daftar produk...</p>
        </div>
      </div>
    </div>
  );
}

