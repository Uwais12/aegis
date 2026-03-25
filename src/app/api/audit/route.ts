import { auth0 } from "@/lib/auth0";
import { getAuditLog } from "@/lib/audit";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const entries = await getAuditLog(session.user.sub);
  return NextResponse.json({ entries });
}
