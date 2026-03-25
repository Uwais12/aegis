import type { ToolDefinition } from "@/types";

export const TOOL_REGISTRY: ToolDefinition[] = [
  // Read Tier - Google
  {
    name: "checkCalendar",
    description: "Check Google Calendar for upcoming events and availability",
    tier: "read",
    connection: "google-oauth2",
    provider: "Google",
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  },
  {
    name: "searchEmails",
    description: "Search Gmail inbox for emails matching a query",
    tier: "read",
    connection: "google-oauth2",
    provider: "Google",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  },
  // Read Tier - GitHub
  {
    name: "listRepos",
    description: "List GitHub repositories for the authenticated user",
    tier: "read",
    connection: "github",
    provider: "GitHub",
    scopes: ["repo"],
  },
  {
    name: "getIssues",
    description: "Get issues from a specific GitHub repository",
    tier: "read",
    connection: "github",
    provider: "GitHub",
    scopes: ["repo"],
  },
  // Write Tier - Google
  {
    name: "createEvent",
    description: "Create a new event on Google Calendar",
    tier: "write",
    connection: "google-oauth2",
    provider: "Google",
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  },
  // Write Tier - GitHub
  {
    name: "createIssue",
    description: "Create a new issue in a GitHub repository",
    tier: "write",
    connection: "github",
    provider: "GitHub",
    scopes: ["repo"],
  },
  // Sensitive Tier
  {
    name: "sendEmail",
    description: "Send an email via Gmail on behalf of the user",
    tier: "sensitive",
    connection: "google-oauth2",
    provider: "Google",
    scopes: ["https://www.googleapis.com/auth/gmail.send"],
  },
  {
    name: "deleteRepo",
    description: "Delete a GitHub repository (destructive action)",
    tier: "sensitive",
    connection: "github",
    provider: "GitHub",
    scopes: ["delete_repo"],
  },
];

export function getToolsByTier(tier: ToolDefinition["tier"]) {
  return TOOL_REGISTRY.filter((t) => t.tier === tier);
}

export function getToolsByConnection(connection: string) {
  return TOOL_REGISTRY.filter((t) => t.connection === connection);
}

export function getToolMeta(name: string) {
  return TOOL_REGISTRY.find((t) => t.name === name);
}
