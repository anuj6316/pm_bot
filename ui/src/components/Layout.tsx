import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  User as UserIcon, 
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/contexts/AuthContext';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from './ui/Dropdown';
import { ProjectSelector } from './ProjectSelector';
import { Logo } from './Logo';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();

  // Chat requires full height, others scroll normally.
  const isChat = location.pathname === '/chat';

  React.useEffect(() => {
    if (!isLoading && !user) navigate('/login', { replace: true });
  }, [navigate, user, isLoading]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Issues',    path: '/issues' },
    { label: 'Chat',      path: '/chat' },
  ];

  const adminItems = [
    { label: 'Users', path: '/users' },
    { label: 'Settings', path: '/settings' },
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
    <div className="flex h-screen w-full flex-col bg-[var(--color-canvas)] text-[var(--color-ink)] overflow-hidden font-sans">

      {/* Global Nav - Top Row - Pure Black */}
      <nav className="h-[44px] bg-[var(--color-surface-black)] text-[var(--color-on-dark)] flex-shrink-0 z-50 flex items-center px-[32px]">
        <div className="flex-1 flex items-center gap-[32px]">
          <div onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80 transition-opacity">
            <Logo className="w-5 h-5 text-[var(--color-on-dark)]" />
          </div>

          <div className="hidden md:flex items-center gap-[24px]">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'text-nav-link transition-colors',
                    isActive ? 'text-[var(--color-on-dark)]' : 'text-[var(--color-body-muted)] hover:text-[var(--color-on-dark)]'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {/* Admin items separated slightly */}
            <div className="w-[1px] h-[12px] bg-[var(--color-ink-muted-80)] mx-[8px]" />
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'text-nav-link transition-colors',
                    isActive ? 'text-[var(--color-on-dark)]' : 'text-[var(--color-body-muted)] hover:text-[var(--color-on-dark)]'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-[16px]">
          <button className="text-[var(--color-body-muted)] hover:text-[var(--color-on-dark)] transition-colors">
            <HelpCircle className="w-[14px] h-[14px]" />
          </button>
          
          <Dropdown
            trigger={
              <button className="w-[20px] h-[20px] rounded-full bg-[var(--color-surface-tile-1)] flex items-center justify-center hover:bg-[var(--color-surface-tile-2)] transition-colors overflow-hidden">
                {user ? (
                  <span className="text-[9px] font-semibold text-[var(--color-on-dark)]">{getUserInitials()}</span>
                ) : (
                  <UserIcon className="w-[10px] h-[10px] text-[var(--color-on-dark)]" />
                )}
              </button>
            }
          >
            <DropdownLabel>Account</DropdownLabel>
            <div className="px-[12px] py-[8px] mb-[4px]">
              <p className="text-body-strong truncate max-w-[150px]">{getUserDisplayName()}</p>
              <p className="text-caption text-[var(--color-body-muted)] truncate max-w-[150px]">{user?.email}</p>
            </div>
            <DropdownSeparator />
            <DropdownItem onClick={() => navigate('/profile')}>
              Profile
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem onClick={handleLogout} variant="danger">
              <LogOut className="w-[14px] h-[14px]" />
              Sign out
            </DropdownItem>
          </Dropdown>
        </div>
      </nav>

      {/* Sub Nav - Frosted Row */}
      <div className="h-[52px] bg-[var(--color-canvas-parchment)] border-b border-[var(--color-hairline)] flex-shrink-0 z-40 flex items-center justify-between px-[32px]">
        {/* Dynamic Title based on route, or Project Selector */}
        <div className="flex items-center gap-[16px]">
           <ProjectSelector />
        </div>

        <div className="flex items-center">
            {/* Primary Action (CTA) goes here, depending on page. We leave a placeholder or handle it per-page via portal/context later. */}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[var(--color-canvas)]">
        {isChat ? (
           <div className="h-full flex flex-col"><Outlet /></div>
        ) : (
           <div className="min-h-full flex flex-col">
             <Outlet />
           </div>
        )}
      </main>
    </div>
  );
}
