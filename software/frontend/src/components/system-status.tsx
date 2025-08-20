import { Server, Database, Wifi, HardDrive, Cpu, AlertTriangle, CheckCircle } from "lucide-react"
import type { Runner, Alert } from "@/lib/types"

interface SystemStatusProps {
  runners: Runner[]
  alerts: Alert[]
  connectionState: {
    connected: boolean
    connectionState: "connecting" | "connected" | "disconnected" | "error"
    lastUpdate: string | null
  }
  raceStarted: boolean
}

export function SystemStatus({ runners, alerts, connectionState, raceStarted }: SystemStatusProps) {
  const systemMetrics = {
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 34,
    networkLatency: 12,
    uptime: "2d 14h 32m",
    dataProcessed: "2.4 GB",
  }

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-400"
    if (value >= thresholds.warning) return "text-amber-400"
    return "text-emerald-400"
  }

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return AlertTriangle
    return CheckCircle
  }

  const services = [
    {
      name: "WebSocket Server",
      status: connectionState.connected ? "online" : "offline",
      uptime: "99.9%",
      lastCheck: "2s ago",
    },
    {
      name: "GPS Tracking",
      status: runners.length > 0 ? "online" : "offline",
      uptime: "99.8%",
      lastCheck: "1s ago",
    },
    {
      name: "Database",
      status: "online",
      uptime: "100%",
      lastCheck: "5s ago",
    },
    {
      name: "Alert System",
      status: "online",
      uptime: "99.9%",
      lastCheck: "3s ago",
    },
  ]

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">CPU Usage</span>
            </div>
            <span
              className={`text-lg font-bold ${getStatusColor(systemMetrics.cpuUsage, { warning: 70, critical: 90 })}`}
            >
              {systemMetrics.cpuUsage}%
            </span>
          </div>
          <div className="progress-modern h-2">
            <div className="progress-fill h-full" style={{ width: `${systemMetrics.cpuUsage}%` }} />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium text-gray-300">Memory</span>
            </div>
            <span
              className={`text-lg font-bold ${getStatusColor(systemMetrics.memoryUsage, { warning: 80, critical: 95 })}`}
            >
              {systemMetrics.memoryUsage}%
            </span>
          </div>
          <div className="progress-modern h-2">
            <div className="progress-fill h-full" style={{ width: `${systemMetrics.memoryUsage}%` }} />
          </div>
        </div>

        {/* Network Latency */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-gray-300">Latency</span>
            </div>
            <span
              className={`text-lg font-bold ${getStatusColor(systemMetrics.networkLatency, { warning: 50, critical: 100 })}`}
            >
              {systemMetrics.networkLatency}ms
            </span>
          </div>
          <div className="text-xs text-gray-400">Network response time</div>
        </div>

        {/* Data Processed */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-gray-300">Data</span>
            </div>
            <span className="text-lg font-bold text-white">{systemMetrics.dataProcessed}</span>
          </div>
          <div className="text-xs text-gray-400">Processed today</div>
        </div>
      </div>

      {/* Services Status */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Server className="w-5 h-5" />
          <span>Services Status</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const StatusIcon = service.status === "online" ? CheckCircle : AlertTriangle
            const statusColor = service.status === "online" ? "text-emerald-400" : "text-red-400"

            return (
              <div key={service.name} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                    <span className="font-medium text-white">{service.name}</span>
                  </div>
                  <span className={`text-sm font-medium capitalize ${statusColor}`}>{service.status}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Uptime: {service.uptime}</span>
                  <span>Last check: {service.lastCheck}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* System Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">System Uptime:</span>
              <span className="text-white font-medium">{systemMetrics.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Connections:</span>
              <span className="text-white font-medium">{runners.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Messages/sec:</span>
              <span className="text-white font-medium">24.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Error Rate:</span>
              <span className="text-emerald-400 font-medium">0.01%</span>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent System Events</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-2 rounded-lg bg-white/5">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === "critical"
                      ? "bg-red-400"
                      : alert.severity === "high"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm text-white">{alert.message}</div>
                  <div className="text-xs text-gray-400">{alert.timestamp}</div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && <div className="text-center py-4 text-gray-400">No recent system events</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
