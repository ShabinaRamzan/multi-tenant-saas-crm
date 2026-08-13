export default function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-slate-500 transition hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="space-y-6 px-6 py-5">{children}</div>
        {footer && <div className="border-t border-slate-200 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
