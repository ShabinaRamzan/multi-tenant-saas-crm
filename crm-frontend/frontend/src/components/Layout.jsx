import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[290px_1fr]">
        <Sidebar />
        <main className="flex min-h-screen flex-col bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
