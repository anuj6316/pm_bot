import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, MessageSquare, Settings, LogOut, User as UserIcon, Users, UserCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/contexts/AuthContext';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();
  const isChat = location.pathname === '/chat';

  React.useEffect(() => {
    if (!isLoading && !user) navigate('/login', { replace: true });
  }, [navigate, user, isLoading]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ListTodo,        label: 'Issues',    path: '/issues' },
    { icon: MessageSquare,   label: 'Chat',      path: '/chat' },
    { icon: UserCircle,      label: 'Profile',   path: '/profile' },
    ...(user?.role === 'admin' || user?.role === 'consultant' || user?.is_superuser
      ? [{ icon: Users, label: 'Users', path: '/users' }] 
      : []),
    { icon: Settings,        label: 'Settings',  path: '/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const first = user.first_name?.charAt(0)?.toUpperCase() || '';
    const last = user.last_name?.charAt(0)?.toUpperCase() || '';
    return first + last || user.username?.charAt(0)?.toUpperCase() || '?';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user.username || user.email;
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
              {user ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-apple-blue/10 border border-apple-blue/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-semibold text-apple-blue">{getUserInitials()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-apple-text truncate">{getUserDisplayName()}</p>
                    <p className="text-xs text-apple-text-muted truncate">{user.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-apple-text truncate">Loading...</p>
                  </div>
                </>
              )}
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
          ? <div className="flex-1 flex min-h-0"><Outlet /></div>
          : (
            <div className="flex-1 overflow-y-auto p-8 w-full">
              <Outlet />
            </div>
          )}
      </main>
    </div>
  );
}