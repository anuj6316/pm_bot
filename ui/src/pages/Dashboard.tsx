import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, AlertCircle, Loader2, ChevronDown, X, ExternalLink, Check } from 'lucide-react';
import { fetchSessions, syncSession, approveSession, type Session } from '@/src/lib/api';

// Need to update the UI to use alternating tiles and utility grids
export function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());
  const [sessionsDropdownOpen, setSessionsDropdownOpen] = useState(false);

  // Modals aren't explicitly mentioned in the design, but let's re-style the existing modal code to match
  const [modalConfig, setModalConfig] = useState<{
    type: 'pending' | 'processing' | 'completed';
    title: string;
    sessions: Session[];
  } | null>(null);

  const [approvingIds, setApprovingIds] = useState<Set<number>>(new Set());

  const loadSessions = useCallback(async () => {
    try {
      const data = await fetchSessions();
      setSessions(data.results);
      setError('');
    } catch {
      setError('Failed to load sessions. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 30_000);
    return () => clearInterval(interval);
  }, [loadSessions]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await loadSessions();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncSession = async (sessionId: number) => {
    setSyncingIds((prev) => new Set(prev).add(sessionId));
    try {
      await syncSession(sessionId);
      setTimeout(loadSessions, 1500);
    } catch {
      // ignore
    } finally {
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  const handleApproveSession = async (sessionId: number) => {
    setApprovingIds((prev) => new Set(prev).add(sessionId));
    try {
      await approveSession(sessionId);
      setTimeout(loadSessions, 1000);
    } catch (err) {
      console.error('Failed to approve session:', err);
    } finally {
      setApprovingIds((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const pendingApproval = useMemo(() => sessions.filter((s) => s.status === 'COMPLETED' && !s.is_approved), [sessions]);
  const processing = useMemo(() => sessions.filter((s) => s.status === 'PROCESSING'), [sessions]);
  const completedToday = useMemo(() => sessions.filter((s) => (s.status === 'COMPLETED' || s.status === 'ARCHIVED') && isToday(s.created_at)), [sessions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <Badge variant="translucent">Completed</Badge>;
      case 'PROCESSING': return <Badge variant="default">Processing</Badge>;
      case 'PENDING': return <Badge variant="outline">Pending</Badge>;
      case 'FAILED': return <Badge variant="outline" className="text-red-500 border-red-200">Failed</Badge>;
      case 'ARCHIVED': return <Badge variant="translucent">Archived</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLabelBadge = (label: string | null) => {
    if (!label) return null;
    return <Badge variant="outline">{label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}</Badge>;
  };

  const openModal = (type: 'pending' | 'processing' | 'completed', title: string, filteredSessions: Session[]) => {
    setModalConfig({ type, title, sessions: filteredSessions });
  };
  const closeModal = () => setModalConfig(null);

  const SessionRow = ({ session }: { session: Session }) => (
    <div className="py-[16px] flex items-center justify-between border-b border-[var(--color-divider-soft)] last:border-0 group">
      <div className="flex items-center gap-[16px] min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-[8px]">
            <p className="font-mono text-body-strong truncate">{session.plane_issue_id}</p>
            {getLabelBadge(session.triage_label)}
            {getStatusBadge(session.status)}
          </div>
          <div className="flex items-center gap-[8px] mt-[4px] text-caption text-[var(--color-body-muted)]">
            <span>{new Date(session.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[8px] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {(session.status === 'FAILED' || session.status === 'PENDING') && (
          <Button
            variant="pearl-capsule"
            disabled={syncingIds.has(session.id)}
            onClick={() => handleSyncSession(session.id)}
          >
            {syncingIds.has(session.id) ? 'Retrying...' : 'Retry'}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Light Hero Tile */}
      <section className="bg-[var(--color-canvas)] text-[var(--color-ink)] px-[32px] py-[var(--spacing-section)] flex flex-col items-center text-center border-b border-[var(--color-divider-soft)]">
        <h1 className="text-display-lg max-w-2xl">Project Overview.</h1>
        <p className="text-lead mt-[16px] max-w-2xl text-[var(--color-ink-muted-80)]">
          Monitor agent sessions, track task progression, and manage approvals.
        </p>
        <div className="mt-[32px] flex items-center gap-[16px]">
          <Button onClick={handleSync} disabled={isSyncing} variant={isSyncing ? "secondary-pill" : "primary"}>
            {isSyncing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </section>

      {/* Dark Product Summary Tile */}
      <section className="bg-[var(--color-surface-tile-1)] text-[var(--color-on-dark)] px-[32px] py-[var(--spacing-section)] flex flex-col items-center">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {/* Card 1 */}
          <button
            onClick={() => openModal('pending', 'Pending Approval', pendingApproval)}
            className="flex flex-col items-center justify-center py-[48px] px-[24px] rounded-lg bg-[var(--color-surface-tile-2)] hover:bg-[var(--color-surface-tile-3)] transition-colors cursor-pointer"
          >
            <p className="text-hero-display mb-[8px]">{loading ? '—' : pendingApproval.length}</p>
            <p className="text-body-strong text-[var(--color-body-muted)]">Pending Approval</p>
          </button>

          {/* Card 2 */}
          <button
            onClick={() => openModal('processing', 'Processing', processing)}
            className="flex flex-col items-center justify-center py-[48px] px-[24px] rounded-lg bg-[var(--color-surface-tile-2)] hover:bg-[var(--color-surface-tile-3)] transition-colors cursor-pointer"
          >
            <p className="text-hero-display mb-[8px]">{loading ? '—' : processing.length}</p>
            <p className="text-body-strong text-[var(--color-body-muted)]">Processing</p>
          </button>

          {/* Card 3 */}
          <button
            onClick={() => openModal('completed', 'Completed Today', completedToday)}
            className="flex flex-col items-center justify-center py-[48px] px-[24px] rounded-lg bg-[var(--color-surface-tile-2)] hover:bg-[var(--color-surface-tile-3)] transition-colors cursor-pointer"
          >
            <p className="text-hero-display mb-[8px]">{loading ? '—' : completedToday.length}</p>
            <p className="text-body-strong text-[var(--color-body-muted)]">Completed Today</p>
          </button>
        </div>
      </section>

      {/* Parchment Utility Grid */}
      <section className="bg-[var(--color-canvas-parchment)] flex-1 px-[32px] py-[var(--spacing-section)] flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-between mb-[32px]">
            <h2 className="text-display-md text-[var(--color-ink)]">Recent Sessions</h2>
            <Button variant="ghost" onClick={() => setSessionsDropdownOpen(!sessionsDropdownOpen)}>
              {sessionsDropdownOpen ? 'Collapse' : 'Expand'}
            </Button>
          </div>

          <AnimatePresence initial={false}>
            {(sessionsDropdownOpen || true) && ( // Keeping it open by default in the new design for better visibility
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card>
                  <CardContent className="p-[24px]">
                    {loading ? (
                      <div className="py-[48px] text-center text-body-default text-[var(--color-body-muted)]">Loading...</div>
                    ) : sessions.length === 0 ? (
                      <div className="py-[48px] text-center text-body-default text-[var(--color-body-muted)]">No sessions yet.</div>
                    ) : (
                      <div className="flex flex-col">
                        {sessions.map(session => <SessionRow key={session.id} session={session} />)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Modal Re-style */}
      <AnimatePresence>
        {modalConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-surface-black)]/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[var(--color-canvas)] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="px-[24px] py-[24px] border-b border-[var(--color-divider-soft)] flex items-center justify-between">
                <h3 className="text-display-md text-[var(--color-ink)]">{modalConfig.title}</h3>
                <button onClick={closeModal} className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[var(--color-surface-chip-translucent)] hover:bg-[var(--color-divider-soft)] transition-colors">
                  <X className="w-[16px] h-[16px] text-[var(--color-ink)]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-[24px] py-[16px]">
                {modalConfig.sessions.length === 0 ? (
                  <div className="py-[64px] text-center text-lead text-[var(--color-body-muted)]">
                    No sessions found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-[16px]">
                    {modalConfig.sessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-[16px] flex flex-col gap-[8px]">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-body-strong text-[var(--color-ink)]">{session.plane_issue_id}</span>
                            {getStatusBadge(session.status)}
                          </div>

                          <div className="text-caption text-[var(--color-body-muted)]">
                            {new Date(session.created_at).toLocaleString()}
                          </div>

                          {session.status === 'COMPLETED' && !session.is_approved && (
                            <div className="mt-[8px]">
                              <Button
                                variant="primary"
                                onClick={() => handleApproveSession(session.id)}
                                disabled={approvingIds.has(session.id)}
                              >
                                {approvingIds.has(session.id) ? 'Approving...' : 'Approve Task'}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
