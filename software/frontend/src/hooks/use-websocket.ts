"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import type { RaceWebSocket } from "@/lib/websocket"
import type { Runner, Alert } from "@/lib/types"

interface WebSocketState {
  connected: boolean
  connectionState: "connecting" | "connected" | "disconnected" | "error"
  lastUpdate: string | null
  error: string | null
}

export function useWebSocket(url: string) {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connectionState: "disconnected",
    lastUpdate: null,
    error: null,
  })

  const wsRef = useRef<RaceWebSocket | null>(null)
  const [runners, setRunners] = useState<Runner[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])

  const updateRunner = useCallback((runnerData: any) => {
    setRunners((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === runnerData.runnerId)

      if (existingIndex >= 0) {
        // Update existing runner
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          position: runnerData.position,
          speed: runnerData.speed,
          heartRate: runnerData.heartRate,
          lastUpdate: runnerData.timestamp,
        }
        return updated
      } else {
        // Add new runner (shouldn't happen in normal operation)
        return [
          ...prev,
          {
            id: runnerData.runnerId,
            name: `Runner ${runnerData.runnerId}`,
            position: runnerData.position,
            speed: runnerData.speed,
            progress: 0,
            distanceToFinish: 85.5,
            batteryLevel: 100,
            heartRate: runnerData.heartRate,
            lastUpdate: runnerData.timestamp,
          },
        ]
      }
    })

    setState((prev) => ({
      ...prev,
      lastUpdate: new Date().toLocaleTimeString(),
    }))
  }, [])

  const addAlert = useCallback((alertData: Alert) => {
    setAlerts((prev) => [alertData, ...prev.slice(0, 9)]) // Keep only last 10 alerts
  }, [])

  useEffect(() => {
    // For demo purposes, we'll simulate WebSocket with mock data
    // In production, replace with: wsRef.current = new RaceWebSocket(url)

    const mockWs = {
      on: (event: string, callback: Function) => {
        if (event === "connected") {
          setTimeout(() => callback(true), 1000)
        }
      },
      send: (type: string, payload: any) => {
        console.log("Mock WebSocket send:", { type, payload })
      },
      disconnect: () => {},
      getConnectionState: () => "connected" as const,
    }

    wsRef.current = mockWs as any

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Simulate runner updates
      const runnerId = `R00${Math.floor(Math.random() * 8) + 1}`
      updateRunner({
        runnerId,
        position: {
          lat: 9.4747 + (Math.random() - 0.5) * 0.01,
          lng: -83.9142 + (Math.random() - 0.5) * 0.01,
        },
        speed: 20 + Math.random() * 20,
        heartRate: 140 + Math.random() * 40,
        timestamp: new Date().toISOString(),
      })

      // Occasionally add alerts
      if (Math.random() < 0.05) {
        addAlert({
          id: `A${Date.now()}`,
          type: Math.random() < 0.1 ? "accident" : "system",
          severity: "medium",
          runnerId,
          message: "Real-time WebSocket alert received",
          timestamp: new Date().toLocaleTimeString(),
          resolved: false,
        })
      }
    }, 3000)

    setState((prev) => ({
      ...prev,
      connected: true,
      connectionState: "connected",
    }))

    return () => {
      clearInterval(interval)
      if (wsRef.current) {
        wsRef.current.disconnect()
      }
    }
  }, [url, updateRunner, addAlert])

  const sendMessage = useCallback((type: string, payload: any) => {
    if (wsRef.current) {
      wsRef.current.send(type, payload)
    }
  }, [])

  return {
    ...state,
    runners,
    alerts,
    sendMessage,
  }
}
