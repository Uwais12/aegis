"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Shield, PanelRightClose, PanelRightOpen } from "lucide-react";

interface DashboardClientProps {
  user: {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
  };
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [latestToolCall, setLatestToolCall] = useState<{
    toolName: string;
    tier: string;
  }>();

  return (
    <div className="h-screen flex flex-col bg-[#0b1121]">
      {/* Top bar */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0f1a]/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-semibold tracking-tight">Aegis</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400">
            Secure Agent
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface
            onToolCall={(toolName, tier) =>
              setLatestToolCall({ toolName, tier })
            }
          />
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar user={user} latestToolCall={latestToolCall} />
        )}
      </div>
    </div>
  );
}
