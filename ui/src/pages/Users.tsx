import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Search, Shield, Globe, Key, Trash2, Check, X, Copy } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { api } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';

interface UserData {
  id: number;
  email: string;
  username: string;
  role: string;
  projects: string[];
}

interface Project {
  id: string;
  name: string;
  identifier: string;
}

export function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'developer',
    selected_projects: [] as string[],
  });

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [usersData, projectsData] = await Promise.all([
        api.get<UserData[]>('/user/list_users/'),
        api.get<Project[]>('/user/projects/')
      ]);
      setUsers(usersData);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err: any) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const projectMap = (Array.isArray(projects) ? projects : []).reduce((acc, p) => ({ ...acc, [p.id.toLowerCase()]: p.name }), {} as Record<string, string>);

  const canManage = (currentUser as any)?.role === 'admin' || (currentUser as any)?.role === 'consultant' || (currentUser as any)?.is_superuser;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        projects: formData.selected_projects,
      };

      await api.post('/user/create-user/', payload);
      toast.success('User created successfully!');
      setIsModalOpen(false);
      setFormData({
        email: '',
        username: '',
        password: '',
        role: 'developer',
        selected_projects: [],
      });
      fetchInitialData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'Failed to create user';
      toast.error(errorMsg);
    }
  };

  const copyCredentials = () => {
    const text = `Email: ${formData.email}\nPassword: ${formData.password}`;
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard');
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full bg-[var(--color-canvas-parchment)]">
      {/* Light Hero Header */}
      <section className="bg-[var(--color-canvas)] border-b border-[var(--color-divider-soft)] px-[32px] py-[48px] flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-[var(--color-ink)]">Team.</h1>
          <p className="text-lead mt-[8px] text-[var(--color-ink-muted-80)]">
             {canManage ? 'Manage team roles and project access.' : 'View your project colleagues.'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-[16px]">
          {canManage && (
            <Button onClick={() => setIsModalOpen(true)} variant="primary">
              Add New User
            </Button>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 px-[32px] py-[48px] flex flex-col items-center">
        <div className="w-full max-w-5xl">

          <div className="mb-[32px]">
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
             <CardContent className="p-0">
                <div className="divide-y divide-[var(--color-divider-soft)]">
                  {isLoading ? (
                    <div className="py-[64px] text-center text-[var(--color-body-muted)]">Loading users...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-[64px] text-center text-[var(--color-body-muted)]">No users found.</div>
                  ) : (
                    filteredUsers.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-[24px] hover:bg-[var(--color-canvas-parchment)] transition-colors group">
                        <div className="flex items-center gap-[16px]">
                          <div className="w-[48px] h-[48px] rounded-full bg-[var(--color-surface-chip-translucent)] flex items-center justify-center text-display-md text-[var(--color-ink)] leading-none">
                             {u.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-body-strong text-[var(--color-ink)]">{u.username}</p>
                            <p className="text-caption text-[var(--color-body-muted)]">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-[16px]">
                          <Badge variant="outline">User</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
             </CardContent>
          </Card>
        </div>
      </section>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-surface-black)]/80 backdrop-blur-md p-4">
          <div className="bg-[var(--color-canvas)] rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-product-elevation">
            <div className="px-[24px] py-[24px] border-b border-[var(--color-divider-soft)] flex items-center justify-between">
               <h2 className="text-display-md text-[var(--color-ink)]">Add Team Member</h2>
               <button onClick={() => setIsModalOpen(false)} className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[var(--color-surface-chip-translucent)] hover:bg-[var(--color-divider-soft)] transition-colors">
                 <X className="w-[16px] h-[16px] text-[var(--color-ink)]" />
               </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-[24px] space-y-[24px] overflow-y-auto">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                <div className="space-y-[8px]">
                  <label className="text-body-strong text-[var(--color-ink)]">Username</label>
                  <Input
                    required
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. jdoe"
                  />
                </div>
                <div className="space-y-[8px]">
                  <label className="text-body-strong text-[var(--color-ink)]">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[var(--color-canvas)] text-[var(--color-ink)] text-body-default rounded-pill px-[20px] h-[44px] border border-[var(--color-hairline)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-focus)]"
                  >
                    <option value="developer">Developer</option>
                    <option value="consultant">Consultant</option>
                    {((currentUser as any)?.role === 'admin' || (currentUser as any)?.is_superuser) && <option value="admin">Admin</option>}
                  </select>
                </div>
              </div>

              <div className="space-y-[8px]">
                <label className="text-body-strong text-[var(--color-ink)]">Email Address</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                />
              </div>

              <div className="space-y-[8px]">
                <div className="flex justify-between items-center">
                  <label className="text-body-strong text-[var(--color-ink)]">Temporary Password</label>
                  <button type="button" onClick={copyCredentials} className="text-caption text-[var(--color-primary)] hover:underline">Copy</button>
                </div>
                <Input
                  required
                  type="text"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="font-mono"
                />
              </div>

              <div className="space-y-[8px]">
                <label className="text-body-strong text-[var(--color-ink)]">Project Assignment</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px] max-h-[200px] overflow-y-auto p-[12px] bg-[var(--color-canvas-parchment)] rounded-lg border border-[var(--color-divider-soft)]">
                  {projects.map((proj) => (
                    <label 
                      key={proj.id} 
                      className={cn(
                        "flex items-center gap-[12px] p-[8px] rounded-sm border transition-all cursor-pointer",
                        formData.selected_projects.includes(proj.id) 
                          ? "bg-[var(--color-canvas)] border-[var(--color-primary)] text-[var(--color-ink)] shadow-sm"
                          : "bg-[var(--color-canvas)] border-transparent hover:border-[var(--color-hairline)]"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.selected_projects.includes(proj.id)}
                        onChange={(e) => {
                          const next = e.target.checked 
                            ? [...formData.selected_projects, proj.id]
                            : formData.selected_projects.filter(id => id !== proj.id);
                          setFormData({ ...formData, selected_projects: next });
                        }}
                      />
                      <div className={cn(
                        "w-[16px] h-[16px] rounded-sm border flex items-center justify-center transition-colors flex-shrink-0",
                        formData.selected_projects.includes(proj.id) ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-[var(--color-hairline)] bg-[var(--color-canvas)]"
                      )}>
                        {formData.selected_projects.includes(proj.id) && <Check className="w-[12px] h-[12px] text-[var(--color-on-primary)]" />}
                      </div>
                      <span className="text-caption font-medium truncate">{proj.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-fine-print text-[var(--color-ink-muted-48)] mt-[4px]">
                  Note: Consultants and Admins automatically have Global access to all projects.
                </p>
              </div>

              <div className="pt-[24px] flex items-center gap-[16px]">
                <Button type="button" variant="secondary-pill" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
