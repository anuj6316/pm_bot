import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/src/components/Logo';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-tile-1)] p-4 text-[var(--color-on-dark)]">
      <div className="w-full max-w-md flex flex-col items-center">

        <div className="mb-[64px] flex flex-col items-center">
          <Logo className="w-[80px] h-[80px] text-[var(--color-on-dark)] mb-[24px]" />
          <h1 className="text-display-lg text-center">PM.ai</h1>
          <p className="text-lead mt-[16px] text-[var(--color-body-muted)] text-center">The intelligent workspace.</p>
        </div>

        <div className="w-full">
          <form onSubmit={handleLogin} className="space-y-[16px]">
            {error && (
              <div className="text-body-default text-red-400 text-center mb-[24px]">
                {error}
              </div>
            )}

            <div className="space-y-[16px]">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[var(--color-surface-tile-2)] text-[var(--color-on-dark)] text-body-default rounded-[100px] px-[24px] h-[52px] border-none placeholder:text-[var(--color-ink-muted-48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-on-dark)]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[var(--color-surface-tile-2)] text-[var(--color-on-dark)] text-body-default rounded-[100px] px-[24px] h-[52px] border-none placeholder:text-[var(--color-ink-muted-48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-on-dark)]"
              />
            </div>

            <div className="pt-[24px] flex justify-center">
              <Button type="submit" variant="primary" className="min-w-[140px]" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
