import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '../store/authStore';
import { NAV_ITEMS, ROLE_LABELS } from '../utils/navConfig';
import { Button } from '../atoms/Button';

export function AppShell() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-56 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <span className="text-lg font-semibold text-brand-700">TransitOps</span>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'block rounded-md px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div />
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-slate-600">
                {user.fullName} <span className="text-slate-400">· {ROLE_LABELS[user.role]}</span>
              </span>
            )}
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
