import { streamText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth0 } from "@/lib/auth0";
import { agentTools } from "@/lib/tools";
import { logAudit } from "@/lib/audit";
import { getToolMeta } from "@/lib/tool-registry";

export async function POST(req: Request) {
  const session = await auth0.getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  const userId = session.user.sub;

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are Aegis, a secure AI assistant that helps users interact with their Google and GitHub accounts. You operate with explicit permission boundaries and tiered authorization.

PERMISSION TIERS:
- READ (automatic): checkCalendar, searchEmails, listRepos, getIssues - These are safe, read-only operations
- WRITE (logged): createEvent, createIssue - These modify data and are logged for audit
- SENSITIVE (requires approval): sendEmail - These are high-impact actions

BEHAVIOR GUIDELINES:
1. Always explain what you're about to do before using a tool
2. For WRITE tier tools, confirm the action with the user before executing
3. For SENSITIVE tier tools, warn the user that this requires elevated permissions
4. After every tool use, briefly summarize the result
5. If a tool fails because the account isn't connected, guide the user to connect it via the sidebar
6. Be concise but thorough. Show key data in a readable format
7. Never fabricate data - only report what the APIs return

PERSONALITY:
- Professional, security-conscious, and efficient
- Reference permission tiers when relevant to build user trust
- Proactively mention audit logging for write/sensitive operations`,
    messages,
    tools: agentTools,
    stopWhen: stepCountIs(5),
    onStepFinish: async ({ toolCalls, toolResults }) => {
      if (toolCalls) {
        for (let i = 0; i < toolCalls.length; i++) {
          const call = toolCalls[i];
          const meta = getToolMeta(call.toolName);
          const result = toolResults?.[i];
          const hasError =
            result && typeof result === "object" && "error" in result;

          await logAudit({
            userId,
            toolName: call.toolName,
            tier: meta?.tier || "read",
            connection: meta?.connection || "unknown",
            status: hasError ? "error" : "success",
            args: ("args" in call ? call.args : {}) as Record<string, unknown>,
            details: hasError
              ? String((result as { error: unknown }).error)
              : undefined,
          });
        }
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
