# Aegis — Secure AI Agent Gateway

**The secure gateway between AI agents and your digital life.**

Aegis is an AI assistant that connects to your Google and GitHub accounts through **Auth0 Token Vault**, demonstrating how AI agents should handle authentication, authorization, and consent delegation. Every action operates within a **three-tier permission model** with complete audit trails.

**Live Demo:** [aegis-pearl-theta.vercel.app](https://aegis-pearl-theta.vercel.app)

## Key Features

### Three-Tier Permission Model
- **Read** (automatic) — Calendar checks, email search, repo listing
- **Write** (logged) — Event creation, issue creation — all logged to audit trail
- **Sensitive** (approval required) — Sending emails, destructive operations

### Auth0 Token Vault Integration
- OAuth token exchange via RFC 8693
- Zero credential exposure — tokens never touch application code
- Scoped access per tool — each tool gets only the permissions it needs
- Automatic token refresh and rotation

### Real-Time Permissions Dashboard
- Connected accounts with scope visualization
- Live audit trail of every agent action
- Permission tier indicators (green/amber/red)
- Token Vault security status

### Connected Services
- **Google** — Calendar (read/write), Gmail (read/send)
- **GitHub** — Repos, Issues (read/create)

## Architecture

```
User ──→ Next.js Frontend (Chat + Permissions Dashboard)
              │
              ├──→ Auth0 (User Auth + Token Vault)
              │         ├──→ Google OAuth (Calendar, Gmail)
              │         └──→ GitHub OAuth (Repos, Issues)
              │
              ├──→ Vercel AI SDK + OpenAI gpt-4o
              │
              └──→ MongoDB (Audit Trail)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| AI | Vercel AI SDK + OpenAI gpt-4o |
| Auth | Auth0 SDK v4 (`@auth0/nextjs-auth0`) |
| Token Vault | `@auth0/ai-vercel`, `@auth0/ai` |
| UI | Tailwind CSS + shadcn/ui |
| Database | MongoDB Atlas |
| Deploy | Vercel |

## Getting Started

### Prerequisites
- Node.js 20+
- Auth0 account with Token Vault enabled
- OpenAI API key
- MongoDB Atlas connection string

### 1. Clone and Install

```bash
git clone https://github.com/Uwais12/aegis.git
cd aegis
npm install
```

### 2. Auth0 Setup

1. Create a Regular Web Application in Auth0 Dashboard
2. Enable these grant types:
   - `authorization_code`
   - `refresh_token`
   - `urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token`
3. Configure Google OAuth connection with scopes:
   - `calendar.readonly`, `calendar.events`, `gmail.readonly`, `gmail.send`
4. Configure GitHub connection with scopes: `repo`, `read:user`
5. Enable **Connected Accounts** (Token Vault) on both connections
6. Disable Refresh Token Rotation

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in:
```
AUTH0_SECRET=<generate with: openssl rand -hex 32>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=<your-tenant>.auth0.com
AUTH0_CLIENT_ID=<your-client-id>
AUTH0_CLIENT_SECRET=<your-client-secret>
AUTH0_AUDIENCE=https://<your-tenant>.auth0.com/api/v2/
OPENAI_API_KEY=<your-openai-key>
MONGODB_URI=<your-mongodb-uri>
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How Token Vault Works in Aegis

1. **User authenticates** via Auth0 Universal Login
2. **Consent granted** — OAuth scopes explicitly approved per service
3. **Tokens stored** — Auth0 Token Vault stores access/refresh tokens securely
4. **Agent exchanges token** — Each tool call exchanges an Auth0 token for a scoped, short-lived external provider token via RFC 8693
5. **API call executed** — The agent uses the external token, then it's discarded
6. **Action logged** — Every invocation is recorded in the audit trail

The agent **never sees or stores raw credentials**. Auth0 handles storage, rotation, and exchange.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/page.tsx    # Chat + permissions dashboard
│   └── api/
│       ├── auth/[auth0]/     # Auth0 routes
│       ├── chat/route.ts     # AI chat endpoint
│       └── audit/route.ts    # Audit trail API
├── components/
│   ├── chat/                 # Chat interface + tool results
│   └── dashboard/            # Sidebar + permissions
├── lib/
│   ├── auth0.ts              # Auth0 client config
│   ├── tools/                # AI tools wrapped with Token Vault
│   ├── audit.ts              # Audit logging
│   └── mongodb.ts            # Database connection
└── types/
    └── index.ts              # TypeScript types
```

## Built for the "Authorized to Act" Hackathon

This project was built for the [Auth0 for AI Agents Hackathon](https://authorizedtoact.devpost.com/) to demonstrate how AI agents can operate with **transparency**, **accountability**, and **user control**.

## License

MIT
