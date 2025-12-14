import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { taskSchema } from "@/lib/validation"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedTo = searchParams.get("assignedTo")

    let tasks

    // Build filters - use separate queries for different combinations
    if (!status && !priority && !assignedTo) {
      // No filters
      tasks = await sql`
        SELECT 
          t.*,
          u1.name as creator_name,
          u2.name as assignee_name
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        ORDER BY t.created_at DESC
      `
    } else if (status && !priority && !assignedTo) {
      // Only status filter
      tasks = await sql`
        SELECT 
          t.*,
          u1.name as creator_name,
          u2.name as assignee_name
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE t.status = ${status}
        ORDER BY t.created_at DESC
      `
    } else if (priority && !status && !assignedTo) {
      // Only priority filter
      tasks = await sql`
        SELECT 
          t.*,
          u1.name as creator_name,
          u2.name as assignee_name
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE t.priority = ${priority}
        ORDER BY t.created_at DESC
      `
    } else if (assignedTo && !status && !priority) {
      // Only assignedTo filter
      tasks = await sql`
        SELECT 
          t.*,
          u1.name as creator_name,
          u2.name as assignee_name
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE t.assigned_to = ${Number.parseInt(assignedTo)}
        ORDER BY t.created_at DESC
      `
    } else if (status && priority && !assignedTo) {
      // Status and priority filters
      tasks = await sql`
        SELECT 
          t.*,
          u1.name as creator_name,
          u2.name as assignee_name
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE t.status = ${status} AND t.priority = ${priority}
        ORDER BY t.created_at DESC
      `
    } else if (status && assignedTo && !priority) {
      // Status and assignedTo filters
      tasks = await sql`
        SELECT 
          t.*,
          u1.name as creator_name,
          u2.name as assignee_name
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE t.status = ${status} AND t.assigned_to = ${Number.parseInt(assignedTo)}
        ORDER BY t.created_at DESC
      `
    } else if (priority && assignedTo && !status) {
      // Priority and assignedTo filters
      tasks = await sql`
        SELECT 
          t.*,
          u1.name as creator_name,
          u2.name as assignee_name
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE t.priority = ${priority} AND t.assigned_to = ${Number.parseInt(assignedTo)}
        ORDER BY t.created_at DESC
      `
    } else {
      // All three filters
      tasks = await sql`
        SELECT 
          t.*,
          u1.name as creator_name,
          u2.name as assignee_name
        FROM tasks t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE t.status = ${status} AND t.priority = ${priority} AND t.assigned_to = ${Number.parseInt(assignedTo)}
        ORDER BY t.created_at DESC
      `
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("[v0] Error fetching tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()

    const validation = taskSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.errors }, { status: 400 })
    }

    const { title, description, status, priority, due_date, assigned_to } = validation.data

    const result = await sql`
      INSERT INTO tasks (title, description, status, priority, due_date, created_by, assigned_to)
      VALUES (
        ${title},
        ${description || null},
        ${status},
        ${priority},
        ${due_date || null},
        ${session.userId},
        ${assigned_to || null}
      )
      RETURNING *
    `

    return NextResponse.json({ task: result[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
