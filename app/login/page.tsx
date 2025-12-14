import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Login - Task Manager",
  description: "Sign in to your task management account",
}

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your tasks</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
