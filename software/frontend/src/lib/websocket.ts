export class RaceWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Set<Function>> = new Map()

  constructor(private url: string) {
    this.connect()
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0
        this.emit("connected", true)
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit(data.type, data.payload)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.emit("connected", false)
        this.handleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.emit("error", error)
      }
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.handleReconnect()
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, delay)
    } else {
      console.error("Max reconnection attempts reached")
      this.emit("maxReconnectAttemptsReached", true)
    }
  }

  public send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.warn("WebSocket not connected, message not sent:", { type, payload })
    }
  }

  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  public off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(callback)
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data))
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  public getConnectionState(): "connecting" | "connected" | "disconnected" | "error" {
    if (!this.ws) return "disconnected"

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting"
      case WebSocket.OPEN:
        return "connected"
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return "disconnected"
      default:
        return "error"
    }
  }
}

// Mock WebSocket server simulation for demo purposes
export class MockWebSocketServer {
  private clients: Set<any> = new Set()
  private interval: NodeJS.Timeout | null = null

  constructor() {
    this.startDataSimulation()
  }

  private startDataSimulation() {
    this.interval = setInterval(() => {
      // Simulate runner position updates
      const runnerUpdate = {
        type: "runner_update",
        payload: {
          runnerId: `R00${Math.floor(Math.random() * 8) + 1}`,
          position: {
            lat: 9.4747 + (Math.random() - 0.5) * 0.01,
            lng: -83.9142 + (Math.random() - 0.5) * 0.01,
          },
          speed: 20 + Math.random() * 20,
          heartRate: 140 + Math.random() * 40,
          timestamp: new Date().toISOString(),
        },
      }

      this.broadcast(runnerUpdate)

      // Occasionally simulate alerts
      if (Math.random() < 0.1) {
        const alertUpdate = {
          type: "alert_update",
          payload: {
            id: `A${Date.now()}`,
            type: Math.random() < 0.1 ? "accident" : "off-route",
            severity: "medium",
            runnerId: `R00${Math.floor(Math.random() * 8) + 1}`,
            message: "Simulated real-time alert from WebSocket",
            timestamp: new Date().toLocaleTimeString(),
            resolved: false,
          },
        }

        this.broadcast(alertUpdate)
      }
    }, 2000)
  }

  private broadcast(message: any) {
    // In a real implementation, this would broadcast to actual WebSocket clients
    console.log("Broadcasting:", message)
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
}
