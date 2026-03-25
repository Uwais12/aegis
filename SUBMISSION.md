# DevPost Submission

## Project Name
Aegis — Secure AI Agent Gateway

## Elevator Pitch
An AI assistant that connects to Google & GitHub through Auth0 Token Vault with a three-tier permission model, step-up auth, and real-time audit trails.

---

## About the Project

### Inspiration

88% of organizations have experienced security incidents with AI agents. The core problem? Agents get broad access to user accounts with no permission boundaries, no audit trails, and no way for users to understand what their agents can do.

We built Aegis to demonstrate how AI agents *should* handle authorization — with the same care that enterprise systems bring to human access control. Auth0 Token Vault made this possible by handling the hardest part: secure, scoped token management without the agent ever touching raw credentials.

### What it does

Aegis is a secure AI assistant that connects to your Google Calendar, Gmail, and GitHub accounts. What makes it different is **how** it connects:

**Three-Tier Permission Model:**
- **Read** (green, automatic) — Calendar checks, email search, repo listing. Safe operations that execute without interruption.
- **Write** (amber, logged) — Creating calendar events, filing GitHub issues. Every write operation is logged to a permanent audit trail.
- **Sensitive** (red, approval required) — Sending emails, destructive operations. These require explicit human approval before execution.

**Permissions Dashboard:** A real-time sidebar showing exactly which services are connected, what scopes are granted, and a live audit trail of every agent action — timestamped, categorized by tier, and filterable.

**Auth0 Token Vault:** Every API call goes through Auth0's Token Vault using RFC 8693 token exchange. The agent never stores or sees OAuth credentials. Each tool gets scoped, short-lived tokens — calendar read tools can't access Gmail, and Gmail read tools can't send emails.

### How we built it

- **Next.js 16** with App Router for the full-stack framework
- **Vercel AI SDK** with OpenAI gpt-4o for the chat engine with streaming tool calls
- **@auth0/ai-vercel** SDK to wrap each tool with `withTokenVault()` — this is where the magic happens. Each tool definition includes its connection and required scopes, and the SDK handles the entire token exchange flow.
- **@auth0/nextjs-auth0 v4** for user authentication with refresh token support
- **MongoDB Atlas** for the audit trail — every tool invocation is logged with tool name, permission tier, timestamp, connection, and result status
- **Tailwind CSS + shadcn/ui** for the dark, editorial UI design
- **Vercel** for deployment

The key architectural decision was wrapping each AI tool with a Token Vault authorizer at the definition level:

```typescript
const withGoogleCalendar = auth0AI.withTokenVault({
  connection: "google-oauth2",
  scopes: ["calendar.readonly"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet.refreshToken;
  },
});

export const checkCalendar = withGoogleCalendar(
  tool({
    description: "Check Google Calendar events",
    inputSchema: z.object({ ... }),
    execute: async (args) => {
      const accessToken = getAccessTokenFromTokenVault();
      // Use scoped token to call Google API
    },
  })
);
```

This pattern means authorization is declarative and enforced at the tool level — you can't accidentally use a calendar token to access Gmail.

### Challenges we ran into

1. **AI SDK v6 breaking changes** — The Vercel AI SDK shipped major API changes (`parameters` → `inputSchema`, `toDataStreamResponse` → `toUIMessageStreamResponse`, `useChat` API overhaul). We had to adapt all tool definitions and the chat interface to the new API.

2. **Zod v3/v4 compatibility** — Auth0's SDK uses `zod/v3` while our project defaulted to Zod 4. We had to use `zod/v3` imports in tool definitions for type compatibility.

3. **Token Vault grant type configuration** — Getting the federated token exchange grant type enabled required specific Auth0 tenant configuration that isn't well-documented for hackathon-style rapid setup.

### Accomplishments that we're proud of

- **Zero credential exposure** — The agent never touches raw OAuth tokens. Auth0 Token Vault handles everything.
- **Declarative authorization** — Each tool's permissions are defined alongside its functionality, making the security model auditable.
- **Production-quality UI** — The permissions dashboard and audit trail aren't afterthoughts — they're core to the product.
- **7 working tools** across 2 OAuth providers, all wrapped with Token Vault.

### What we learned

- Token Vault's `withTokenVault()` wrapper pattern is genuinely elegant — it makes the principle of least privilege practical at the tool level.
- The biggest gap in agent authorization isn't the auth flow itself — it's visibility. Users need to *see* what their agents can do. The permissions dashboard should be a first-class feature, not an admin-only afterthought.
- RFC 8693 token exchange is the right abstraction for agent-to-API access. Short-lived, scoped tokens that the agent never persists.

### What's next for Aegis

- Add more connected services (Slack, Notion, Figma)
- Implement CIBA step-up authentication for sensitive operations via push notifications
- Add per-tool rate limiting and anomaly detection
- Build a reusable "permissions dashboard" component that any app using Token Vault can drop in

---

## Built With

Next.js, TypeScript, Auth0, Auth0 Token Vault, Vercel AI SDK, OpenAI, MongoDB, Tailwind CSS, shadcn/ui, Vercel

---

## Blog Post: Building Agent Authorization That Users Can Actually Trust

> *Header: BONUS BLOG POST SUBMISSION*

### The Problem No One Talks About

When we started building Aegis, we surveyed the AI agent landscape and found a disturbing pattern: almost every agent framework handles *authentication* well (OAuth login, done) but completely skips *authorization*. The agent gets a token and then has carte blanche access to everything that token permits.

This is the equivalent of giving every employee admin access because they passed the badge reader at the front door.

### Token Vault Changes the Game

Auth0's Token Vault fundamentally shifts how agents interact with external APIs. Instead of your application storing OAuth tokens in a database (where they can be leaked, over-scoped, or forgotten), Token Vault acts as a secure intermediary:

1. The user authenticates and grants consent once
2. Auth0 stores the external provider's tokens in its vault
3. When the agent needs API access, it exchanges its Auth0 token for a scoped, short-lived external token via RFC 8693
4. The external token is used for one operation and discarded

The key insight is that **the agent never persists external credentials**. This eliminates an entire class of security risks — token leakage, stale tokens, over-permissioned storage.

### The Pattern That Emerged: Declarative Tool Authorization

Building Aegis, we discovered that the most powerful pattern is wrapping each AI tool with its authorization requirements at definition time:

```typescript
const withCalendarRead = auth0AI.withTokenVault({
  connection: "google-oauth2",
  scopes: ["calendar.readonly"],
});

const checkCalendar = withCalendarRead(tool({ ... }));
```

This is declarative authorization. The tool's permissions are part of its definition, not an afterthought checked at runtime. You can look at any tool and immediately know: what connection it uses, what scopes it requires, and what tier of risk it represents.

### The Missing Piece: Visibility

The biggest lesson from building Aegis is that authorization without visibility is theater. If users can't see what their agent can access, what it has accessed, and what tier of permission each action requires — the security model doesn't build trust.

That's why Aegis's permissions dashboard isn't a settings page buried three levels deep. It's a persistent sidebar showing:
- Which services are connected and their scopes
- A live audit trail of every agent action
- Color-coded permission tiers (green/amber/red) for each tool

This visibility transforms authorization from a security checkbox into a trust-building feature.

### Recommendations for the Auth0 Community

Based on our experience building with Token Vault, here's what we'd love to see evolve:

1. **A standard "permissions dashboard" component** — Every app using Token Vault needs one. Make it as easy as `<TokenVaultDashboard />`.
2. **Per-tool scope enforcement** — The SDK could validate at runtime that a tool only uses the scopes it declared, preventing scope creep.
3. **Built-in audit logging** — Token exchange events could be streamed to a developer-configured endpoint, removing the need for custom audit code.
4. **CIBA integration with tool tiers** — Automatic step-up auth when a tool is marked as "sensitive" would be incredible for developer experience.

Token Vault is the right foundation. The next step is making the patterns we discovered in Aegis — declarative tool authorization, tiered permissions, real-time visibility — available as first-class SDK features.

*Built with Auth0 Token Vault for the "Authorized to Act" Hackathon.*
