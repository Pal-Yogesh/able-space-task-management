"use client"

import { useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null
let socketEnabled = false // Socket.io disabled for App Router compatibility

export function getSocket(): Socket | null {
  if (!socketEnabled) {
    console.log("[v0] Socket.io is disabled - real-time updates unavailable")
    return null
  }
  
  if (!socket) {
    try {
      socket = io({
        path: "/api/socket",
        addTrailingSlash: false,
        reconnection: false,
      })
      
      socket.on("connect_error", (err) => {
        console.log("[v0] Socket.io connection error:", err.message)
        socketEnabled = false
      })
    } catch (error) {
      console.log("[v0] Socket.io initialization error:", error)
      socketEnabled = false
      return null
    }
  }
  return socket
}

export function useSocket(onTaskUpdate?: (task: any) => void, onTaskDelete?: (taskId: number) => void) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socketEnabled) {
      return
    }

    socketRef.current = getSocket()

    if (socketRef.current) {
      if (onTaskUpdate) {
        socketRef.current.on("task-updated", onTaskUpdate)
      }

      if (onTaskDelete) {
        socketRef.current.on("task-deleted", onTaskDelete)
      }
    }

    return () => {
      if (socketRef.current) {
        if (onTaskUpdate) {
          socketRef.current.off("task-updated", onTaskUpdate)
        }
        if (onTaskDelete) {
          socketRef.current.off("task-deleted", onTaskDelete)
        }
      }
    }
  }, [onTaskUpdate, onTaskDelete])

  return socketRef.current
}

export function emitTaskUpdate(task: any) {
  if (!socketEnabled) {
    return
  }
  const socket = getSocket()
  socket?.emit("task-update", task)
}

export function emitTaskDelete(taskId: number) {
  if (!socketEnabled) {
    return
  }
  const socket = getSocket()
  socket?.emit("task-delete", taskId)
}
