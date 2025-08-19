"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { LiveMap } from "@/components/live-map"
import { EnhancedRunnerSidebar } from "@/components/enhanced-runner-sidebar"
import type { Runner } from "@/lib/types"

interface PublicDashboardProps {
  runners: Runner[]
  selectedRunner: string | null
  routeData?: any
  connectionState: {
    connected: boolean
    connectionState: "connecting" | "connected" | "disconnected" | "error"
    lastUpdate: string | null
  }
  onRunnerSelect: (runnerId: string) => void
  onAdminAccess: () => void
}

export function PublicDashboard({
  runners,
  selectedRunner,
  routeData,
  connectionState,
  onRunnerSelect,
  onAdminAccess,
}: PublicDashboardProps) {
  const leader = runners.reduce((prev, current) => (prev.progress > current.progress ? prev : current))

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <EnhancedHeader
        raceTitle="Gran Fondo Chirripó 2025"
        leader={leader}
        timeElapsed="02:34:12"
        liveCommentary="The race is heating up as riders approach the mountain section! Real-time data streaming active."
        totalRunners={runners.length}
        connectionState={connectionState}
        onAdminAccess={onAdminAccess}
      />

      <div className="flex h-[calc(100vh-100px)] gap-4 p-4 relative z-10">
        <div className="flex-1">
          <LiveMap
            runners={runners}
            selectedRunner={selectedRunner}
            onRunnerSelect={onRunnerSelect}
            routeData={routeData}
          />
        </div>

        <div className="w-96">
          <EnhancedRunnerSidebar runners={runners} onRunnerSelect={onRunnerSelect} selectedRunner={selectedRunner} />
        </div>
      </div>
    </div>
  )
}
