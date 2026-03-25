"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Calendar,
  Mail,
  Eye,
  Layers,
  Lock,
  Activity,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import type { AuditEntry } from "@/types";

interface SidebarProps {
  user: {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
  };
  latestToolCall?: { toolName: string; tier: string };
}

const CONNECTIONS = [
  {
    id: "google-oauth2",
    name: "Google",
    icon: Calendar,
    description: "Calendar, Gmail",
    color: "blue",
    tools: [
      { name: "checkCalendar", tier: "read" as const, label: "Read Calendar" },
      { name: "searchEmails", tier: "read" as const, label: "Search Emails" },
      {
        name: "createEvent",
        tier: "write" as const,
        label: "Create Events",
      },
      { name: "sendEmail", tier: "sensitive" as const, label: "Send Emails" },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    icon: GitHubIcon,
    description: "Repos, Issues, PRs",
    color: "white",
    tools: [
      { name: "listRepos", tier: "read" as const, label: "List Repos" },
      { name: "getIssues", tier: "read" as const, label: "Get Issues" },
      {
        name: "createIssue",
        tier: "write" as const,
        label: "Create Issues",
      },
      {
        name: "deleteRepo",
        tier: "sensitive" as const,
        label: "Delete Repos",
      },
    ],
  },
];

const TIER_CONFIG = {
  read: {
    icon: Eye,
    label: "Read",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-500",
  },
  write: {
    icon: Layers,
    label: "Write",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    dot: "bg-amber-500",
  },
  sensitive: {
    icon: Lock,
    label: "Sensitive",
    color: "text-red-400",
    bg: "bg-red-500/10",
    dot: "bg-red-500",
  },
};

export function Sidebar({ user, latestToolCall }: SidebarProps) {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [expandedConnection, setExpandedConnection] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"connections" | "audit">(
    "connections"
  );

  const fetchAudit = useCallback(async () => {
    try {
      const res = await fetch("/api/audit");
      if (res.ok) {
        const data = await res.json();
        setAuditLog(data.entries || []);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchAudit();
    const interval = setInterval(fetchAudit, 10000);
    return () => clearInterval(interval);
  }, [fetchAudit]);

  // Refresh audit log on tool call
  useEffect(() => {
    if (latestToolCall) {
      setTimeout(fetchAudit, 1500);
    }
  }, [latestToolCall, fetchAudit]);

  return (
    <div className="w-80 border-l border-white/5 bg-[#0a0f1a] flex flex-col h-full">
      {/* User header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          {user.picture ? (
            <img
              src={user.picture}
              alt=""
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-400">
                {user.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-xs text-slate-500 truncate">{user.email}</div>
          </div>
          <a
            href="/api/auth/logout"
            className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab("connections")}
          className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
            activeTab === "connections"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Permissions
          </div>
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
            activeTab === "audit"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Audit Trail
            {auditLog.length > 0 && (
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                {auditLog.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "connections" && (
          <div className="p-4 space-y-3">
            {/* Tier legend */}
            <div className="flex items-center gap-3 mb-4">
              {(["read", "write", "sensitive"] as const).map((tier) => {
                const config = TIER_CONFIG[tier];
                return (
                  <div key={tier} className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${config.dot}`}
                    />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {CONNECTIONS.map((conn) => (
              <div
                key={conn.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedConnection(
                      expandedConnection === conn.id ? null : conn.id
                    )
                  }
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <conn.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{conn.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {conn.description}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-600 transition-transform ${
                      expandedConnection === conn.id ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedConnection === conn.id && (
                  <div className="px-4 pb-3 space-y-1.5">
                    {conn.tools.map((t) => {
                      const tierConfig = TIER_CONFIG[t.tier];
                      const TierIcon = tierConfig.icon;
                      return (
                        <div
                          key={t.name}
                          className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${tierConfig.dot}`}
                          />
                          <TierIcon
                            className={`w-3 h-3 ${tierConfig.color}`}
                          />
                          <span className="text-xs text-slate-400 flex-1">
                            {t.label}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded ${tierConfig.bg} ${tierConfig.color}`}
                          >
                            {t.tier}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Security info */}
            <div className="mt-4 p-3 rounded-xl border border-blue-500/10 bg-blue-500/5">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-blue-400 mb-1">
                    Auth0 Token Vault
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Your credentials are stored securely in Auth0&apos;s Token Vault.
                    Aegis only receives scoped, short-lived tokens via RFC 8693
                    token exchange.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="p-4">
            {auditLog.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No activity yet</p>
                <p className="text-xs text-slate-600 mt-1">
                  Tool invocations will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {auditLog.map((entry, i) => {
                  const tierConfig = TIER_CONFIG[entry.tier];
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 py-2 px-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${tierConfig.bg}`}
                      >
                        {entry.status === "success" ? (
                          <CheckCircle2
                            className={`w-3 h-3 ${tierConfig.color}`}
                          />
                        ) : entry.status === "error" ? (
                          <XCircle className="w-3 h-3 text-red-400" />
                        ) : entry.status === "pending" ? (
                          <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium flex items-center gap-1.5">
                          {entry.toolName}
                          <span
                            className={`text-[9px] px-1 py-0.5 rounded ${tierConfig.bg} ${tierConfig.color}`}
                          >
                            {entry.tier}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(entry.timestamp).toLocaleTimeString()}
                          <span className="text-slate-700">·</span>
                          {entry.connection}
                        </div>
                        {entry.details && (
                          <div className="text-[10px] text-red-400/80 mt-0.5 truncate">
                            {entry.details}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <a
          href="https://auth0.com/ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
        >
          Secured by Auth0 for AI Agents
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}
