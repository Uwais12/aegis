"use client";

import {
  Calendar,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Lock,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

type IconComponent = React.ComponentType<{ className?: string }>;

const TOOL_META: Record<
  string,
  {
    icon: IconComponent;
    label: string;
    tier: "read" | "write" | "sensitive";
    color: string;
  }
> = {
  checkCalendar: {
    icon: Calendar,
    label: "Calendar Check",
    tier: "read",
    color: "emerald",
  },
  searchEmails: {
    icon: Mail,
    label: "Email Search",
    tier: "read",
    color: "emerald",
  },
  listRepos: {
    icon: GitHubIcon,
    label: "List Repos",
    tier: "read",
    color: "emerald",
  },
  getIssues: {
    icon: GitHubIcon,
    label: "Get Issues",
    tier: "read",
    color: "emerald",
  },
  createEvent: {
    icon: Calendar,
    label: "Create Event",
    tier: "write",
    color: "amber",
  },
  createIssue: {
    icon: GitHubIcon,
    label: "Create Issue",
    tier: "write",
    color: "amber",
  },
  sendEmail: {
    icon: Mail,
    label: "Send Email",
    tier: "sensitive",
    color: "red",
  },
  deleteRepo: {
    icon: GitHubIcon,
    label: "Delete Repo",
    tier: "sensitive",
    color: "red",
  },
};

const TIER_ICONS = {
  read: Eye,
  write: Layers,
  sensitive: Lock,
};

const TIER_COLORS = {
  read: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  write: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  sensitive: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export function ToolResultDisplay({
  toolName,
  state,
  result,
}: {
  toolName: string;
  state: string;
  result?: unknown;
}) {
  const meta = TOOL_META[toolName] || {
    icon: Eye,
    label: toolName,
    tier: "read" as const,
    color: "emerald",
  };
  const Icon = meta.icon;
  const TierIcon = TIER_ICONS[meta.tier];
  const colors = TIER_COLORS[meta.tier];

  return (
    <div
      className={`my-2 rounded-xl border ${colors.border} ${colors.bg} p-3`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colors.text}`} />
          <span className="text-xs font-medium">{meta.label}</span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${colors.badge}`}
          >
            <TierIcon className="w-2.5 h-2.5" />
            {meta.tier}
          </span>
        </div>
        <div>
          {state === "call" && (
            <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
          )}
          {state === "result" && (
            <CheckCircle2 className={`w-3.5 h-3.5 ${colors.text}`} />
          )}
          {state === "error" && (
            <XCircle className="w-3.5 h-3.5 text-red-400" />
          )}
        </div>
      </div>

      {state === "call" && (
        <div className="text-[11px] text-slate-500">Executing...</div>
      )}

      {(state === "result" || state === "output-available") &&
        result != null ? (
        <div className="text-xs text-slate-300 max-h-48 overflow-y-auto">
          <ToolResultContent toolName={toolName} result={result} />
        </div>
      ) : null}
    </div>
  );
}

function ToolResultContent({
  toolName,
  result,
}: {
  toolName: string;
  result: unknown;
}) {
  const data = result as Record<string, unknown>;

  if (toolName === "checkCalendar" && data.events) {
    const events = data.events as Array<{
      title: string;
      start: string;
      end: string;
      location?: string;
    }>;
    if (events.length === 0) return <span>No events found.</span>;
    return (
      <div className="space-y-1.5">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-2">
            <Calendar className="w-3 h-3 text-emerald-500/50 mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-[10px] text-slate-500">
                {new Date(e.start).toLocaleString()} —{" "}
                {new Date(e.end).toLocaleTimeString()}
                {e.location && ` | ${e.location}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (toolName === "searchEmails" && data.emails) {
    const emails = data.emails as Array<{
      subject: string;
      from: string;
      date: string;
      snippet: string;
    }>;
    if (emails.length === 0) return <span>No emails found.</span>;
    return (
      <div className="space-y-1.5">
        {emails.map((e, i) => (
          <div key={i} className="flex items-start gap-2">
            <Mail className="w-3 h-3 text-emerald-500/50 mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">{e.subject}</div>
              <div className="text-[10px] text-slate-500">
                {e.from} — {e.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (toolName === "listRepos" && data.repos) {
    const repos = data.repos as Array<{
      name: string;
      description: string;
      language: string;
      stars: number;
    }>;
    return (
      <div className="space-y-1.5">
        {repos.map((r, i) => (
          <div key={i} className="flex items-start gap-2">
            <GitHubIcon className="w-3 h-3 text-emerald-500/50 mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-[10px] text-slate-500">
                {r.language && `${r.language} · `}
                {r.stars} stars
                {r.description && ` — ${r.description}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Generic fallback
  if (data.success) {
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        <span>Action completed successfully</span>
      </div>
    );
  }

  return (
    <pre className="text-[10px] bg-black/20 rounded p-2 overflow-x-auto">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}
