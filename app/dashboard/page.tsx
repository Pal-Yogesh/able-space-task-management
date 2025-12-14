import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { DashboardClient } from "@/components/dashboard-client"

export const metadata = {
  title: "Dashboard - Task Manager",
  description: "Manage your tasks and collaborate with your team",
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return <DashboardClient user={session} />
}
