"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Clock, Battery, Navigation } from "lucide-react"
import type { Alert } from "@/lib/types"

interface AlertsPanelProps {
  alerts: Alert[]
  onShowOnMap: (runnerId: string) => void
}

export function AlertsPanel({ alerts, onShowOnMap }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "accident":
        return AlertTriangle
      case "off-route":
        return Navigation
      case "low-battery":
        return Battery
      default:
        return AlertTriangle
    }
  }

  const getAlertColor = (type: Alert["type"], severity: Alert["severity"]) => {
    if (type === "accident") {
      return "bg-red-500/20 border-red-500 text-red-400"
    }

    switch (severity) {
      case "high":
        return "bg-orange-500/20 border-orange-500 text-orange-400"
      case "medium":
        return "bg-yellow-500/20 border-yellow-500 text-yellow-400"
      case "low":
        return "bg-blue-500/20 border-blue-500 text-blue-400"
      default:
        return "bg-gray-500/20 border-gray-500 text-gray-400"
    }
  }

  return (
    <div className="h-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
      <div className="flex items-center space-x-2 text-white mb-4">
        <AlertTriangle className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Critical Alerts</h2>
        <div className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {alerts.filter((a) => a.type === "accident").length}
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type)
            const colorClass = getAlertColor(alert.type, alert.severity)

            return (
              <div
                key={alert.id}
                className={`border rounded-xl p-4 transition-all duration-300 ${colorClass} ${
                  alert.type === "accident" ? "animate-pulse" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-semibold capitalize">{alert.type.replace("-", " ")}</div>
                      <div className="text-sm opacity-80">Runner: {alert.runnerId}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs opacity-60">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                <div className="text-sm mb-3 opacity-90">{alert.message}</div>

                {alert.type === "accident" && alert.gForce && (
                  <div className="text-sm mb-3 font-mono">Impact: {alert.gForce}G</div>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowOnMap(alert.runnerId)}
                  className="w-full border-current text-current hover:bg-current hover:text-black"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Show on Map
                </Button>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
