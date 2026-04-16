import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { fetchSessions, syncSession, type Session } from '@/src/lib/api';

export function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());

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
    // Poll every 30 seconds so in-progress sessions update automatically
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'PROCESSING': return <RefreshCw className="w-4 h-4 text-apple-blue animate-spin" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'FAILED': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-apple-text-muted" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      case 'PROCESSING': return <Badge variant="default" className="bg-apple-blue">Processing</Badge>;
      case 'PENDING': return <Badge variant="warning">Pending</Badge>;
      case 'FAILED': return <Badge variant="destructive">Failed</Badge>;
      case 'ARCHIVED': return <Badge variant="secondary">Archived</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLabelBadge = (label: string | null) => {
    if (!label) return null;
    switch (label.toUpperCase()) {
      case 'BUG':      return <Badge variant="destructive">Bug</Badge>;
      case 'FEATURE':  return <Badge variant="success">Feature</Badge>;
      case 'QUESTION': return <Badge variant="warning">Question</Badge>;
      case 'TRIAGE':   return (
        <Badge className="bg-violet-500/10 text-violet-700 border border-violet-200">Triage</Badge>
      );
      case 'DECISION': return (
        <Badge className="bg-blue-500/10 text-blue-700 border border-blue-200">Decision</Badge>
      );
      case 'IMPROVEMENT': return (
        <Badge className="bg-cyan-500/10 text-cyan-700 border border-cyan-200">Improvement</Badge>
      );
      default: return (
        <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
          {label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}
        </Badge>
      );
    }
  };

  // Live stats from real data
  const pendingApproval = sessions.filter((s) => s.status === 'COMPLETED' && !s.is_approved).length;
  const processing = sessions.filter((s) => s.status === 'PROCESSING').length;
  const completedToday = sessions.filter((s) => {
    const d = new Date(s.created_at);
    const today = new Date();
    return (
      (s.status === 'COMPLETED' || s.status === 'ARCHIVED') &&
      d.toDateString() === today.toDateString()
    );
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-apple-text-muted mt-1">Monitor agent sessions and approvals.</p>
        </div>
        <Button onClick={handleSync} disabled={isSyncing} variant="secondary">
          {isSyncing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-apple-text-muted">Pending Approval</p>
                <p className="text-3xl font-light mt-2">{loading ? '—' : pendingApproval}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-apple-text-muted">Processing</p>
                <p className="text-3xl font-light mt-2">{loading ? '—' : processing}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-apple-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-apple-text-muted">Completed Today</p>
                <p className="text-3xl font-light mt-2">{loading ? '—' : completedToday}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-apple-border/50 pb-4">
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <div className="divide-y divide-apple-border/50">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-apple-text-muted" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-apple-text-muted text-sm">
              No sessions yet. Celery Beat polls Plane every 5 minutes automatically.
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                    {getStatusIcon(session.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium font-mono text-sm">{session.plane_issue_id}</p>
                      {getLabelBadge(session.triage_label)}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-apple-text-muted">
                      <span>{new Date(session.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(session.status)}
                  {(session.status === 'FAILED' || session.status === 'PENDING') && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={syncingIds.has(session.id)}
                      onClick={() => handleSyncSession(session.id)}
                    >
                      {syncingIds.has(session.id) ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                  {session.status === 'ARCHIVED' && session.is_approved && (
                    <Badge variant="success" className="ml-2 bg-green-500/10 text-green-600 border-0">
                      Approved
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
