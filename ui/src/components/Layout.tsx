import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, MessageSquare, Settings, LogOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth, logout } from '@/src/lib/api';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  // Chat page manages its own full-bleed layout
  const isChat = location.pathname === '/chat';

  React.useEffect(() => {
    if (!auth.isAuthenticated()) navigate('/login', { replace: true });
  }, [navigate]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ListTodo,        label: 'Issues',    path: '/issues' },
    { icon: MessageSquare,   label: 'Chat',      path: '/chat' },
    { icon: Settings,        label: 'Settings',  path: '/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen w-full bg-apple-bg overflow-hidden">
      {/* Global nav sidebar — always visible */}
      <aside className="w-64 flex-shrink-0 border-r border-apple-border/50 bg-apple-card/50 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-apple-blue flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">PM Bot</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-apple-blue/10 text-apple-blue'
                    : 'text-apple-text-muted hover:bg-black/5 hover:text-apple-text',
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-apple-border/50">
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-apple-blue/10 border border-apple-blue/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-semibold text-apple-blue">WS</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-apple-text truncate">Workspace</p>
                <p className="text-xs text-apple-text-muted truncate">PM Bot</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex-shrink-0 flex items-center justify-center w-7 h-7 text-apple-text-muted hover:text-apple-text rounded-lg hover:bg-black/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {isChat
          /* Chat page: no padding, no max-width — Chat.tsx owns its full height layout */
          ? <div className="flex-1 flex min-h-0"><Outlet /></div>
          /* All other pages: standard scrollable padded container */
          : (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-5xl mx-auto">
                <Outlet />
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
