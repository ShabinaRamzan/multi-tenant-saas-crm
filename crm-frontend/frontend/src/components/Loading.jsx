export default function Loading() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-slate-500 shadow-soft">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"></div>
        <span>Loading…</span>
      </div>
    </div>
  );
}
