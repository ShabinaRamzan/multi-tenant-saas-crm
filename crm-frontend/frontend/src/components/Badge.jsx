export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${className}`}>{children}</span>
  );
}
