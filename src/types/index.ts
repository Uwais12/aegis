export interface AuditEntry {
  _id?: string;
  userId: string;
  toolName: string;
  tier: "read" | "write" | "sensitive";
  connection: string;
  status: "success" | "error" | "pending" | "denied";
  timestamp: Date;
  details?: string;
  args?: Record<string, unknown>;
}

export interface ConnectedAccount {
  connection: string;
  provider: string;
  connected: boolean;
  scopes: string[];
  lastUsed?: Date;
}

export interface ToolDefinition {
  name: string;
  description: string;
  tier: "read" | "write" | "sensitive";
  connection: string;
  provider: string;
  scopes: string[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  toolInvocations?: ToolInvocation[];
}

export interface ToolInvocation {
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  state: "call" | "result" | "error";
}
