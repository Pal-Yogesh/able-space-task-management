"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

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

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  "in-progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400",
}

const priorityColors = {
  low: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  medium: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (date: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{task.title}</h3>
            {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={cn("capitalize", statusColors[task.status as keyof typeof statusColors])}>
              {task.status.replace("-", " ")}
            </Badge>
            <Badge className={cn("capitalize", priorityColors[task.priority as keyof typeof priorityColors])}>
              {task.priority}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {task.assignee_name && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{task.assignee_name}</span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit task</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
