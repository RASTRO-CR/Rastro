import { EnhancedHeader } from "@/components/enhanced-header"
import { LiveMap } from "@/components/live-map"
import { EnhancedRunnerSidebar } from "@/components/enhanced-runner-sidebar"
import { AdminControls } from "@/components/admin-controls"
import { AlertsPanel } from "@/components/alerts-panel"
import { DetailedStats } from "@/components/detailed-stats"
import type { Runner, Alert } from "@/lib/types"

interface AdminDashboardProps {
  runners: Runner[]
  alerts: Alert[]
  raceStarted: boolean
  selectedRunner: string | null
  routeData?: any
  connectionState: {
    connected: boolean
    connectionState: "connecting" | "connected" | "disconnected" | "error"
    lastUpdate: string | null
  }
  onLogout: () => void
  onStartRace: () => void
  onEndRace: () => void
  onRunnerSelect: (runnerId: string) => void
  onRouteUploaded?: (routeData: any) => void
}

export function AdminDashboard({
  runners,
  alerts,
  raceStarted,
  selectedRunner,
  routeData,
  connectionState,
  onLogout,
  onStartRace,
  onEndRace,
  onRunnerSelect,
  onRouteUploaded,
}: AdminDashboardProps) {
  const leader = runners.reduce((prev, current) => (prev.progress > current.progress ? prev : current))

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced background for admin */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <EnhancedHeader
        raceTitle="Gran Fondo Chirripó 2025 - Mission Control"
        leader={leader}
        timeElapsed="02:34:12"
        liveCommentary="Admin dashboard active. All systems operational. Real-time WebSocket data streaming."
        totalRunners={runners.length}
        connectionState={connectionState}
        onLogout={onLogout}
        isAdmin
      />

      <div className="flex h-[calc(100vh-100px)] gap-4 p-4 relative z-10">
        {/* Left Column - Map and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1">
            <LiveMap
              runners={runners}
              selectedRunner={selectedRunner}
              onRunnerSelect={onRunnerSelect}
              routeData={routeData}
            />
          </div>

          <div className="h-48">
            <AdminControls
              raceStarted={raceStarted}
              onStartRace={onStartRace}
              onEndRace={onEndRace}
              onRouteUploaded={onRouteUploaded}
            />
          </div>
        </div>

        {/* Middle Column - Sidebar */}
        <div className="w-96">
          <EnhancedRunnerSidebar runners={runners} onRunnerSelect={onRunnerSelect} selectedRunner={selectedRunner} />
        </div>

        {/* Right Column - Alerts and Stats */}
        <div className="w-80 flex flex-col gap-4">
          <div className="h-1/2">
            <AlertsPanel alerts={alerts} onShowOnMap={onRunnerSelect} />
          </div>

          <div className="h-1/2">
            <DetailedStats runners={runners} />
          </div>
        </div>
      </div>
    </div>
  )
}
