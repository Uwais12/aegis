import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  return (
    <DashboardClient
      user={{
        name: session.user.name || session.user.email,
        email: session.user.email,
        picture: session.user.picture,
        sub: session.user.sub,
      }}
    />
  );
}
