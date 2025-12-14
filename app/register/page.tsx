import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/register-form"

export const metadata = {
  title: "Register - Task Manager",
  description: "Create a new task management account",
}

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground mt-2">Create your account to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
