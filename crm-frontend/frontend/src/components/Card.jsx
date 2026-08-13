export default function Card({ title, value, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
      {children}
    </div>
  );
}
