import Link from "next/link";

export default function LoadingDetailProduk() {
  return (
    <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12 animate-pulse">
      <div className="aspect-square w-full rounded-2xl border border-garis bg-permukaan" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-32 rounded bg-permukaan" />
        <div className="h-4 w-20 rounded bg-permukaan" />
        <div className="h-8 w-3/4 rounded-lg bg-permukaan" />
        <div className="h-8 w-28 rounded-md bg-permukaan" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded bg-permukaan" />
          <div className="h-4 w-5/6 rounded bg-permukaan" />
          <div className="h-4 w-2/3 rounded bg-permukaan" />
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="h-5 w-28 rounded bg-permukaan" />
          <div className="h-10 w-36 rounded-lg bg-permukaan" />
          <div className="h-12 w-full rounded-lg bg-permukaan sm:w-52" />
        </div>
      </div>
    </article>
  );
}

