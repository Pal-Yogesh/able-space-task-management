import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = await context.params

    const result = await sql`
      SELECT 
        t.*,
        u1.name as creator_name,
        u2.name as assignee_name
      FROM tasks t
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      WHERE t.id = ${Number.parseInt(id)}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task: result[0] })
  } catch (error) {
    console.error("[v0] Error fetching task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = await context.params
    const updates = await request.json()

    const taskId = Number.parseInt(id)

    // Build update object with only allowed fields
    const allowedFields = ["title", "description", "status", "priority", "due_date", "assigned_to"]
    const updateData: any = {}

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateData[key] = value
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // First, fetch the current task
    const currentTask = await sql`
      SELECT * FROM tasks WHERE id = ${taskId}
    `

    if (currentTask.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Merge updates with current values
    const updatedTask = {
      title: updateData.title !== undefined ? updateData.title : currentTask[0].title,
      description: updateData.description !== undefined ? updateData.description : currentTask[0].description,
      status: updateData.status !== undefined ? updateData.status : currentTask[0].status,
      priority: updateData.priority !== undefined ? updateData.priority : currentTask[0].priority,
      due_date: updateData.due_date !== undefined ? updateData.due_date : currentTask[0].due_date,
      assigned_to: updateData.assigned_to !== undefined ? updateData.assigned_to : currentTask[0].assigned_to,
    }

    // Perform the update with all fields
    const result = await sql`
      UPDATE tasks 
      SET 
        title = ${updatedTask.title},
        description = ${updatedTask.description},
        status = ${updatedTask.status},
        priority = ${updatedTask.priority},
        due_date = ${updatedTask.due_date},
        assigned_to = ${updatedTask.assigned_to},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${taskId}
      RETURNING *
    `

    return NextResponse.json({ task: result[0] })
  } catch (error) {
    console.error("[v0] Error updating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = await context.params

    const result = await sql`
      DELETE FROM tasks 
      WHERE id = ${Number.parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
