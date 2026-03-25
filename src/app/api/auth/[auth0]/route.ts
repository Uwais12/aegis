// Auth0 v4 handles auth routes via middleware, not route handlers.
// This file exists as a placeholder - all auth routing is done in middleware.ts
// Auth0 middleware intercepts /api/auth/* routes automatically.

export function GET() {
  return new Response("Auth routes are handled by middleware", { status: 200 });
}
