"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Shield, AlertTriangle, Bot, User } from "lucide-react";
import { ToolResultDisplay } from "./ToolResult";

export function ChatInterface({
  onToolCall,
}: {
  onToolCall?: (toolName: string, tier: string) => void;
}) {
  const { messages, sendMessage, status, error, setMessages } = useChat({
    onToolCall: ({ toolCall }) => {
      const tierMap: Record<string, string> = {
        checkCalendar: "read",
        searchEmails: "read",
        listRepos: "read",
        getIssues: "read",
        createEvent: "write",
        createIssue: "write",
        sendEmail: "sensitive",
        deleteRepo: "sensitive",
      };
      onToolCall?.(toolCall.toolName, tierMap[toolCall.toolName] || "read");
    },
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  const suggestions = [
    "What's on my calendar this week?",
    "Show my recent GitHub repos",
    "Search my emails for invoices",
    "Create a GitHub issue for a bug fix",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Aegis</h2>
            <p className="text-slate-400 text-sm max-w-md mb-8">
              Your secure AI assistant. I can access your Google Calendar, Gmail,
              and GitHub — all through Auth0 Token Vault with tiered
              permissions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={async () => {
                    await sendMessage({ text: s });
                  }}
                  className="text-left text-sm px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-slate-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3"
                  : "text-slate-200"
              }`}
            >
              {message.parts?.map((part, i) => {
                if (part.type === "text" && "text" in part) {
                  return (
                    <div
                      key={i}
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                    >
                      {part.text}
                    </div>
                  );
                }
                // Handle tool parts (type is 'tool-{name}' or 'dynamic-tool')
                if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
                  const toolPart = part as {
                    type: string;
                    toolName?: string;
                    toolCallId: string;
                    state: string;
                    input?: unknown;
                    output?: unknown;
                  };
                  const toolName =
                    toolPart.toolName ||
                    part.type.replace("tool-", "");
                  return (
                    <ToolResultDisplay
                      key={i}
                      toolName={toolName}
                      state={toolPart.state}
                      result={
                        toolPart.state === "output-available"
                          ? toolPart.output
                          : undefined
                      }
                    />
                  );
                }
                return null;
              })}
              {/* Empty message fallback */}
              {(!message.parts || message.parts.length === 0) && (
                <div className="text-sm text-slate-500 italic">...</div>
              )}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {error.message.includes("connect")
                ? "Please connect your account in the sidebar to use this feature."
                : error.message}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aegis anything about your calendar, emails, or repos..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        <p className="text-[11px] text-slate-600 mt-2 text-center">
          All actions are logged. Sensitive operations require approval.
        </p>
      </div>
    </div>
  );
}
