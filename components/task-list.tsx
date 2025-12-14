"use client"

import { useEffect, useState } from "react"
import { TaskCard } from "./task-card"
import { useSocket, emitTaskDelete } from "@/lib/socket"
import { useToast } from "@/hooks/use-toast"

type Task = {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  assignee_name: string | null
  creator_name: string
  created_at: string
}

type TaskListProps = {
  initialTasks: Task[]
  onEdit: (task: Task) => void
}

export function TaskList({ initialTasks, onEdit }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const { toast } = useToast()

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    toast({
      title: "Task Updated",
      description: "A task was updated by another user",
    })
  }

  const handleTaskDelete = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    toast({
      title: "Task Deleted",
      description: "A task was deleted by another user",
    })
  }

  useSocket(handleTaskUpdate, handleTaskDelete)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete task")

      setTasks((prev) => prev.filter((task) => task.id !== id))
      emitTaskDelete(id)

      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No tasks found. Create your first task to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={handleDelete} />
      ))}
    </div>
  )
}
