import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users2, ClipboardList, CheckSquare2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Customers', path: '/customers', icon: Users2 },
  { label: 'Leads', path: '/leads', icon: ClipboardList },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare2 },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-full max-w-xs flex-col bg-slate-950 text-slate-100 shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-700 text-2xl font-bold text-white">S</div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">SaaS CRM</p>
          <p className="text-lg font-semibold">Tenant Workspace</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active ? 'bg-slate-800 text-white shadow-soft' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800 px-6 py-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Signed in as</p>
          <p className="text-sm font-semibold">{user?.name || 'Unknown User'}</p>
          <p className="text-sm text-slate-400">{user?.role || 'Role not set'}</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
