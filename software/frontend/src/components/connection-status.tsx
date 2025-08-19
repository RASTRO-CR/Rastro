import { Wifi, WifiOff, AlertTriangle, CheckCircle } from "lucide-react"

interface ConnectionStatusProps {
  connected: boolean
  connectionState: "connecting" | "connected" | "disconnected" | "error"
  lastUpdate: string | null
  className?: string
}

export function ConnectionStatus({ connected, connectionState, lastUpdate, className = "" }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (connectionState) {
      case "connected":
        return {
          icon: CheckCircle,
          text: "Live Data Connected",
          color: "text-green-400",
          bgColor: "status-connected",
          pulseColor: "neon-glow-green",
        }
      case "connecting":
        return {
          icon: Wifi,
          text: "Connecting...",
          color: "text-yellow-400",
          bgColor: "status-warning",
          pulseColor: "neon-glow-yellow",
        }
      case "disconnected":
        return {
          icon: WifiOff,
          text: "Connection Lost",
          color: "text-red-400",
          bgColor: "status-disconnected",
          pulseColor: "neon-glow-red",
        }
      case "error":
        return {
          icon: AlertTriangle,
          text: "Connection Error",
          color: "text-red-400",
          bgColor: "status-disconnected",
          pulseColor: "neon-glow-red",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className={`glass-panel p-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${config.bgColor} ${config.pulseColor} pulse-neon`} />
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>{config.text}</span>
        </div>
      </div>

      {lastUpdate && connected && <div className="mt-2 text-xs text-gray-400">Last update: {lastUpdate}</div>}

      {connectionState === "connecting" && (
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-1 rounded-full animate-pulse"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
