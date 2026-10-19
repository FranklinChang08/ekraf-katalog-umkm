export default function LoadingKatalog() {
  return (
    <>
      <section className="py-10 sm:py-14 animate-pulse">
        <div className="h-10 w-2/3 max-w-md rounded-lg bg-permukaan sm:h-12" />
        <div className="mt-3 h-5 w-4/5 max-w-lg rounded-lg bg-permukaan" />
        <div className="mt-4 h-4 w-40 rounded-lg bg-permukaan" />
      </section>

      <section aria-label="Memuat katalog produk" className="flex flex-col gap-6 pb-12">
        <div className="flex items-center justify-between">
          <div className="h-7 w-36 rounded-lg bg-permukaan animate-pulse" />
        </div>

        {/* Skeleton Pencarian & Filter */}
        <div className="flex flex-col gap-3">
          <div className="h-11 w-full rounded-xl bg-permukaan animate-pulse" />
          <div className="flex gap-2 overflow-hidden py-1">
            <div className="h-8 w-20 rounded-full bg-permukaan animate-pulse" />
            <div className="h-8 w-24 rounded-full bg-permukaan animate-pulse" />
            <div className="h-8 w-24 rounded-full bg-permukaan animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-permukaan animate-pulse" />
            <div className="h-8 w-24 rounded-full bg-permukaan animate-pulse" />
          </div>
        </div>

        {/* Skeleton Grid Produk */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar animate-pulse"
            >
              <div className="aspect-square w-full bg-permukaan" />
              <div className="flex flex-1 flex-col gap-2.5 p-3">
                <div className="h-3 w-16 rounded bg-permukaan" />
                <div className="h-5 w-4/5 rounded bg-permukaan" />
                <div className="mt-auto h-6 w-24 rounded-md bg-permukaan" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

