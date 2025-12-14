import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

export const sql = neon(process.env.DATABASE_URL)

export type User = {
  id: number
  email: string
  password_hash: string
  name: string
  created_at: Date
  updated_at: Date
}

export type Task = {
  id: number
  title: string
  description: string | null
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  due_date: Date | null
  created_by: number
  assigned_to: number | null
  created_at: Date
  updated_at: Date
}

export type TaskWithAssignee = Task & {
  assignee_name: string | null
  creator_name: string
}
