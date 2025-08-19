"use client"

import { LiveMap } from "@/components/live-map"
import { EnhancedRunnerSidebar } from "@/components/enhanced-runner-sidebar"
import { RaceMetrics } from "@/components/race-metrics"
import { AlertsPanel } from "@/components/alerts-panel"
import type { Runner, Alert } from "@/lib/types"

interface RaceMonitorPageProps {
  runners: Runner[]
  alerts: Alert[]
  selectedRunner: string | null
  routeData?: any
  connectionState: {
    connected: boolean
    connectionState: "connecting" | "connected" | "disconnected" | "error"
    lastUpdate: string | null
  }
  onRunnerSelect: (runnerId: string) => void
  isAdmin?: boolean
}

export function RaceMonitorPage({
  runners,
  alerts,
  selectedRunner,
  routeData,
  connectionState,
  onRunnerSelect,
  isAdmin = false,
}: RaceMonitorPageProps) {
  const leader =
    runners.length > 0 ? runners.reduce((prev, current) => (prev.progress > current.progress ? prev : current)) : null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 p-4 space-y-4">
        {/* Race Metrics Header */}
        <div className="fade-in">
          <RaceMetrics
            leader={leader}
            totalRunners={runners.length}
            connectionState={connectionState}
            timeElapsed="02:34:12"
            liveCommentary="Race is progressing smoothly. All systems operational."
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
          {/* Map - Takes up most space */}
          <div className="xl:col-span-2 slide-in-right">
            <LiveMap
              runners={runners}
              selectedRunner={selectedRunner}
              onRunnerSelect={onRunnerSelect}
              routeData={routeData}
            />
          </div>

          {/* Runner Sidebar */}
          <div className="xl:col-span-1 fade-in" style={{ animationDelay: "0.1s" }}>
            <EnhancedRunnerSidebar runners={runners} onRunnerSelect={onRunnerSelect} selectedRunner={selectedRunner} />
          </div>

          {/* Alerts Panel - Only show for admin or if there are critical alerts */}
          {(isAdmin || alerts.some((alert) => alert.severity === "critical")) && (
            <div className="xl:col-span-1 fade-in" style={{ animationDelay: "0.2s" }}>
              <AlertsPanel alerts={alerts} onShowOnMap={onRunnerSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
