import React, { useEffect, useState, useCallback } from 'react';
import {
  Loader2, RefreshCw, ChevronDown, ChevronRight,
  Folder, AlertCircle, ArrowUp, ArrowDown, Minus, Circle,
  Plus, GitBranch, X, Check, FolderOpen,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import {
  fetchIssuesByProject,
  createIssue,
  createSubtask,
  type ProjectGroup,
  type PlaneIssue,
} from '@/src/lib/api';
import { useProject } from '@/src/contexts/ProjectContext';

// ─── Priority helpers ─────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  urgent: { label: 'Urgent', icon: <AlertCircle className="w-3 h-3" />, cls: 'text-red-500' },
  high:   { label: 'High',   icon: <ArrowUp className="w-3 h-3" />,    cls: 'text-orange-500' },
  medium: { label: 'Medium', icon: <Minus className="w-3 h-3" />,      cls: 'text-yellow-500' },
  low:    { label: 'Low',    icon: <ArrowDown className="w-3 h-3" />,  cls: 'text-blue-500' },
  none:   { label: 'None',   icon: <Circle className="w-3 h-3" />,     cls: 'text-[var(--color-ink-muted-48)]' },
};

const PRIORITY_OPTIONS = ['none', 'low', 'medium', 'high', 'urgent'] as const;

const STATE_GROUP_COLOR: Record<string, string> = {
  backlog:     'bg-[var(--color-ink-muted-48)]',
  unstarted:   'bg-[var(--color-ink-muted-48)]',
  started:     'bg-yellow-500',
  in_progress: 'bg-[var(--color-primary-on-dark)]',
  completed:   'bg-green-500',
  cancelled:   'bg-red-500',
};

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.none;
  return (
    <span className={cn('inline-flex items-center gap-1 text-fine-print flex-shrink-0', cfg.cls)}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function StateDot({ group }: { group: string }) {
  return (
    <span className={cn(
      'w-[8px] h-[8px] rounded-full flex-shrink-0',
      STATE_GROUP_COLOR[group?.toLowerCase()] ?? 'bg-[var(--color-ink-muted-48)]',
    )} />
  );
}

// ─── Inline subtask creation form ────────────────────────────────────────────

function SubtaskForm({
  projectId,
  parentIssueId,
  onCreated,
  onCancel,
}: {
  projectId: string;
  parentIssueId: string;
  onCreated: (issue: PlaneIssue) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<string>('none');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const newIssue = await createSubtask({ project_id: projectId, parent_issue_id: parentIssueId, name: name.trim(), priority });
      onCreated(newIssue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subtask');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[8px] px-[24px] py-[16px] bg-[var(--color-canvas-parchment)] border-b border-[var(--color-divider-soft)]">
      <div className="flex items-center gap-[8px]">
        <GitBranch className="w-[14px] h-[14px] text-[var(--color-primary)] flex-shrink-0" />
        <span className="text-caption-strong text-[var(--color-primary)]">New Sub-task</span>
      </div>
      <div className="flex items-center gap-[8px]">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sub-task title…"
          className="flex-1 text-body-default px-[16px] py-[8px] border border-[var(--color-hairline)] rounded-sm bg-[var(--color-canvas)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-focus)]"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="text-caption px-[12px] py-[8px] border border-[var(--color-hairline)] rounded-sm bg-[var(--color-canvas)] focus:outline-none cursor-pointer"
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
        <Button type="submit" variant="primary" disabled={saving || !name.trim()} className="px-[16px] py-[8px] h-auto text-caption rounded-sm">
          {saving ? <Loader2 className="w-[14px] h-[14px] animate-spin" /> : <Check className="w-[14px] h-[14px]" />}
        </Button>
        <button type="button" onClick={onCancel} className="p-[8px] rounded-sm text-[var(--color-ink-muted-48)] hover:bg-[var(--color-divider-soft)] transition-colors">
          <X className="w-[14px] h-[14px]" />
        </button>
      </div>
      {error && <p className="text-caption text-red-500">{error}</p>}
    </form>
  );
}

// ─── Issue row (with inline subtask toggle) ────────────────────────────────────

function IssueRow({
  issue,
  projectId,
  onSubtaskCreated,
}: {
  issue: PlaneIssue & { subtasks?: PlaneIssue[] };
  projectId: string;
  onSubtaskCreated: (subtask: PlaneIssue, parentId: string) => void;
}) {
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  return (
    <>
      <div className="flex items-center gap-[16px] px-[24px] py-[16px] hover:bg-[var(--color-canvas-parchment)] transition-colors border-b border-[var(--color-divider-soft)] last:border-0 group">
        <StateDot group={issue.state_group} />
        <span className="text-caption font-mono text-[var(--color-ink-muted-48)] w-[64px] flex-shrink-0">
          {issue.project_identifier}-{issue.sequence_id ?? '?'}
        </span>
        <p className="flex-1 text-body-strong text-[var(--color-ink)] truncate">{issue.name}</p>
        <span className="text-caption text-[var(--color-body-muted)] hidden md:block w-[96px] flex-shrink-0 text-right truncate">{issue.state}</span>
        <div className="w-[80px] flex justify-end"><PriorityBadge priority={issue.priority} /></div>

        {/* Add subtask button */}
        <button
          onClick={() => setShowSubtaskForm(!showSubtaskForm)}
          title="Add sub-task"
          className={cn(
            'p-[6px] rounded-full transition-all flex-shrink-0',
            showSubtaskForm ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'text-[var(--color-ink-muted-48)] opacity-0 group-hover:opacity-100 hover:bg-[var(--color-divider-soft)]',
          )}
        >
          <GitBranch className="w-[14px] h-[14px]" />
        </button>
      </div>

      {/* Inline subtask form */}
      {showSubtaskForm && (
        <SubtaskForm
          projectId={projectId}
          parentIssueId={issue.id}
          onCreated={(sub) => {
            onSubtaskCreated(sub, issue.id);
            setShowSubtaskForm(false);
          }}
          onCancel={() => setShowSubtaskForm(false)}
        />
      )}

      {/* Existing subtasks */}
      {(issue.subtasks ?? []).map((sub) => (
        <div key={sub.id} className="flex items-center gap-[12px] pl-[64px] pr-[24px] py-[12px] bg-[var(--color-canvas-parchment)] border-b border-[var(--color-divider-soft)] last:border-0">
          <GitBranch className="w-[12px] h-[12px] text-[var(--color-ink-muted-48)] flex-shrink-0" />
          <StateDot group={sub.state_group} />
          <span className="text-fine-print font-mono text-[var(--color-ink-muted-48)] w-[64px] flex-shrink-0">
            {sub.project_identifier}-{sub.sequence_id ?? '?'}
          </span>
          <p className="flex-1 text-caption text-[var(--color-ink)] truncate">{sub.name}</p>
          <PriorityBadge priority={sub.priority} />
        </div>
      ))}
    </>
  );
}

// ─── New issue form (per project) ─────────────────────────────────────────────

function NewIssueForm({
  projectId,
  onCreated,
  onCancel,
}: {
  projectId: string;
  onCreated: (issue: PlaneIssue) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<string>('none');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const newIssue = await createIssue({ project_id: projectId, name: name.trim(), priority });
      onCreated(newIssue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create issue');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[8px] px-[24px] py-[16px] bg-[var(--color-surface-pearl)] border-b border-[var(--color-divider-soft)]">
      <div className="flex items-center gap-[8px]">
        <Plus className="w-[14px] h-[14px] text-[var(--color-primary)] flex-shrink-0" />
        <span className="text-caption-strong text-[var(--color-primary)]">New Issue</span>
      </div>
      <div className="flex items-center gap-[8px]">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Issue title…"
          className="flex-1 text-body-default px-[16px] py-[8px] border border-[var(--color-hairline)] rounded-sm bg-[var(--color-canvas)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-focus)]"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="text-caption px-[12px] py-[8px] border border-[var(--color-hairline)] rounded-sm bg-[var(--color-canvas)] focus:outline-none cursor-pointer"
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
        <Button type="submit" variant="primary" disabled={saving || !name.trim()} className="px-[16px] py-[8px] h-auto text-caption rounded-sm">
          {saving ? <Loader2 className="w-[14px] h-[14px] animate-spin" /> : <Check className="w-[14px] h-[14px]" />}
        </Button>
        <button type="button" onClick={onCancel} className="p-[8px] rounded-sm text-[var(--color-ink-muted-48)] hover:bg-[var(--color-divider-soft)] transition-colors">
          <X className="w-[14px] h-[14px]" />
        </button>
      </div>
      {error && <p className="text-caption text-red-500">{error}</p>}
    </form>
  );
}

// ─── Project section ──────────────────────────────────────────────────────────

type EnrichedIssue = PlaneIssue & { subtasks?: PlaneIssue[] };
type EnrichedGroup = { project: ProjectGroup['project']; issues: EnrichedIssue[] };

function ProjectSection({ group, onRefresh }: { group: EnrichedGroup; onRefresh: () => void; key?: React.Key }) {
  const [expanded, setExpanded] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [localIssues, setLocalIssues] = useState<EnrichedIssue[]>(group.issues);

  useEffect(() => setLocalIssues(group.issues), [group.issues]);

  const handleNewIssue = (newIssue: PlaneIssue) => {
    const enriched: EnrichedIssue = {
      ...newIssue,
      project_id: group.project.id,
      project_name: group.project.name,
      project_identifier: group.project.identifier,
      subtasks: [],
    };
    setLocalIssues((prev) => [...prev, enriched]);
    setShowNewForm(false);
  };

  const handleSubtaskCreated = (subtask: PlaneIssue, parentId: string) => {
    setLocalIssues((prev) =>
      prev.map((i) => i.id === parentId
        ? { ...i, subtasks: [...(i.subtasks ?? []), { ...subtask, project_id: group.project.id, project_name: group.project.name, project_identifier: group.project.identifier }] }
        : i,
      ),
    );
  };

  return (
    <Card className="overflow-hidden mb-[24px]">
      {/* Header */}
      <div className="flex items-center bg-[var(--color-surface-pearl)] hover:bg-[var(--color-canvas-parchment)] transition-colors border-b border-[var(--color-divider-soft)]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-[12px] px-[24px] py-[16px] flex-1 text-left"
        >
          {expanded ? <ChevronDown className="w-[16px] h-[16px] text-[var(--color-ink-muted-48)]" /> : <ChevronRight className="w-[16px] h-[16px] text-[var(--color-ink-muted-48)]" />}
          <Folder className="w-[16px] h-[16px] text-[var(--color-primary)] flex-shrink-0" />
          <span className="text-body-strong text-[var(--color-ink)]">{group.project.name}</span>
          <span className="text-caption font-mono text-[var(--color-ink-muted-48)] ml-auto">
            {localIssues.length}
          </span>
        </button>
        <button
          onClick={() => { setExpanded(true); setShowNewForm(true); }}
          title="Add issue to this project"
          className="flex items-center gap-[6px] px-[24px] py-[16px] text-[var(--color-ink-muted-80)] hover:text-[var(--color-primary)] hover:bg-[var(--color-divider-soft)] transition-colors text-caption-strong border-l border-[var(--color-divider-soft)]"
        >
          <Plus className="w-[14px] h-[14px]" />
          Add
        </button>
      </div>

      {expanded && (
        <div className="bg-[var(--color-canvas)]">
          {showNewForm && (
            <NewIssueForm
              projectId={group.project.id}
              onCreated={handleNewIssue}
              onCancel={() => setShowNewForm(false)}
            />
          )}

          {localIssues.length === 0 ? (
            <div className="px-[24px] py-[48px] text-center text-body-default text-[var(--color-body-muted)]">
              No issues in this project
            </div>
          ) : (
            <div className="flex flex-col">
              {localIssues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  projectId={group.project.id}
                  onSubtaskCreated={handleSubtaskCreated}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Main Issues page ─────────────────────────────────────────────────────────

export function Issues() {
  const { selectedProject, availableProjects } = useProject();
  const [groups, setGroups] = useState<EnrichedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadIssues = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchIssuesByProject();
      setGroups(data.map((g) => ({ ...g, issues: g.issues.map((i) => ({ ...i, subtasks: [] })) })));
    } catch {
      setError('Failed to fetch issues. Check that PLANE_API_TOKEN is configured in the backend .env file.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadIssues(); }, [loadIssues]);

  const filteredGroups = React.useMemo(() => {
    let result = search.trim()
      ? groups
          .map((g) => ({
            ...g,
            issues: g.issues.filter(
              (i) =>
                i.name.toLowerCase().includes(search.toLowerCase()) ||
                g.project.name.toLowerCase().includes(search.toLowerCase()),
            ),
          }))
          .filter((g) => g.issues.length > 0)
      : groups;

    if (selectedProject) {
      result = result.filter((g) => g.project.id === selectedProject.id);
    }

    return result;
  }, [groups, search, selectedProject]);

  return (
    <div className="flex flex-col min-h-full bg-[var(--color-canvas-parchment)]">

      {/* Light Hero Header */}
      <section className="bg-[var(--color-canvas)] border-b border-[var(--color-divider-soft)] px-[32px] py-[48px] flex items-center justify-between">
        <div>
          <h1 className="text-display-lg text-[var(--color-ink)]">Issues.</h1>
          <p className="text-lead mt-[8px] text-[var(--color-ink-muted-80)]">
             Manage and track your project tasks.
          </p>
        </div>
        <div className="flex flex-col items-end gap-[16px]">
          <Button onClick={loadIssues} disabled={loading} variant="secondary-pill">
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </section>

      {/* Issues Grid/Content */}
      <section className="flex-1 px-[32px] py-[48px] flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="mb-[32px]">
            <Input
              type="text"
              placeholder={selectedProject ? `Search issues in ${selectedProject.name}…` : 'Search issues or projects…'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-[24px] text-body-default text-red-500 bg-red-50 px-[24px] py-[16px] rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
             <div className="py-[64px] flex justify-center text-[var(--color-body-muted)]">Loading issues...</div>
          ) : filteredGroups.length === 0 ? (
            <Card className="py-[80px] text-center">
               <FolderOpen className="w-[48px] h-[48px] mx-auto text-[var(--color-ink-muted-48)] mb-[16px]" />
               <p className="text-lead text-[var(--color-ink-muted-80)]">No issues found</p>
            </Card>
          ) : (
             <div className="flex flex-col gap-[24px]">
               {filteredGroups.map((group) => (
                 <ProjectSection key={group.project.id} group={group} onRefresh={loadIssues} />
               ))}
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
