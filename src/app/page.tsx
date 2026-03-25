import Link from "next/link";
import {
  Shield,
  Eye,
  Lock,
  Activity,
  ArrowRight,
  Calendar,
  Mail,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b1121] text-white grid-pattern">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0b1121]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-semibold tracking-tight">Aegis</span>
          </div>
          <Link
            href="/api/auth/login"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-medium mb-8">
            <Lock className="w-3.5 h-3.5" />
            Powered by Auth0 Token Vault
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            The secure gateway
            <br />
            <span className="text-gradient">between AI and</span>
            <br />
            your digital life
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Aegis is an AI assistant that connects to your Google and GitHub
            accounts with{" "}
            <span className="text-white font-medium">
              tiered authorization
            </span>
            ,{" "}
            <span className="text-white font-medium">
              step-up authentication
            </span>
            , and{" "}
            <span className="text-white font-medium">
              complete audit trails
            </span>
            . You stay in control.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/api/auth/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all hover:scale-[1.02] glow-blue"
            >
              Launch Aegis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/Uwais12/aegis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              View Source
            </a>
          </div>
        </div>
      </section>

      {/* Permission Tiers */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Three-tier permission model
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Every agent action is classified by risk level. Sensitive
              operations require explicit human approval.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Read */}
            <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 group hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-emerald-400">Read</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Automatic
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Safe, read-only operations execute automatically without
                interruption.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500/60" />
                  Check calendar events
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500/60" />
                  Search emails
                </li>
                <li className="flex items-center gap-2">
                  <GitHubIcon className="w-4 h-4 text-emerald-500/60" />
                  List repos & issues
                </li>
              </ul>
            </div>

            {/* Write */}
            <div className="p-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 group hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-amber-400">Write</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Logged
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Data-modifying actions are logged to the audit trail for
                accountability.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500/60" />
                  Create calendar events
                </li>
                <li className="flex items-center gap-2">
                  <GitHubIcon className="w-4 h-4 text-amber-500/60" />
                  Create GitHub issues
                </li>
              </ul>
            </div>

            {/* Sensitive */}
            <div className="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 group hover:border-red-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-red-400">
                  Sensitive
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  Approval Required
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                High-impact actions require explicit human approval before
                execution.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-500/60" />
                  Send emails
                </li>
                <li className="flex items-center gap-2">
                  <GitHubIcon className="w-4 h-4 text-red-500/60" />
                  Destructive operations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Built on{" "}
                <span className="text-blue-400">Auth0 Token Vault</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Aegis never sees or stores your credentials. Auth0 Token Vault
                handles OAuth flows, token storage, rotation, and exchange using
                RFC 8693 — so the AI agent only gets scoped, short-lived tokens.
              </p>
              <ul className="space-y-4">
                {[
                  "Zero credential exposure — tokens never touch application code",
                  "Scoped access — each tool gets only the permissions it needs",
                  "Automatic token refresh — no expired token errors",
                  "Complete audit trail — every API call is logged",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-4">
                <div className="text-xs font-mono text-slate-500 mb-4">
                  TOKEN EXCHANGE FLOW
                </div>
                {[
                  {
                    step: "01",
                    label: "User authenticates",
                    detail: "via Auth0 Universal Login",
                  },
                  {
                    step: "02",
                    label: "Consent granted",
                    detail: "OAuth scopes explicitly approved",
                  },
                  {
                    step: "03",
                    label: "Tokens stored securely",
                    detail: "in Auth0 Token Vault (RFC 8693)",
                  },
                  {
                    step: "04",
                    label: "Agent exchanges token",
                    detail: "scoped, short-lived access token",
                  },
                  {
                    step: "05",
                    label: "API call executed",
                    detail: "action logged to audit trail",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-mono text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                      {item.step}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-slate-500">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Services */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Connected services
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            Securely interact with your accounts through Auth0 Token Vault
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Google</div>
                <div className="text-xs text-slate-400">Calendar, Gmail</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <GitHubIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-semibold">GitHub</div>
                <div className="text-xs text-slate-400">
                  Repos, Issues, PRs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Activity className="w-8 h-8 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI agents should earn trust
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Aegis demonstrates how AI assistants can operate with transparency,
            accountability, and user control at every step.
          </p>
          <Link
            href="/api/auth/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all hover:scale-[1.02] glow-blue"
          >
            Try Aegis Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4" />
            Aegis — Built with Auth0 for AI Agents
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a
              href="https://github.com/Uwais12/aegis"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://auth0.com/ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Auth0 for AI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
