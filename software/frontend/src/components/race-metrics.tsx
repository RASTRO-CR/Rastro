"use client"

import { Trophy, Clock, Users, Activity, Wifi, WifiOff } from "lucide-react"
import type { Runner } from "@/lib/types"

interface RaceMetricsProps {
  leader: Runner | null
  totalRunners: number
  connectionState: {
    connected: boolean
    connectionState: "connecting" | "connected" | "disconnected" | "error"
    lastUpdate: string | null
  }
  timeElapsed: string
  liveCommentary: string
}

export function RaceMetrics({ leader, totalRunners, connectionState, timeElapsed, liveCommentary }: RaceMetricsProps) {
  const getConnectionIcon = () => {
    return connectionState.connected ? Wifi : WifiOff
  }

  const getConnectionColor = () => {
    switch (connectionState.connectionState) {
      case "connected":
        return "text-emerald-400"
      case "connecting":
        return "text-amber-400"
      case "disconnected":
      case "error":
        return "text-red-400"
    }
  }

  const ConnectionIcon = getConnectionIcon()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Race Leader */}
      <div className="metric-card">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg neon-glow-cyan">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">Race Leader</div>
            <div className="font-semibold text-white truncate">{leader ? leader.name : "No data"}</div>
            {leader && (
              <div className="text-xs text-yellow-400">
                {leader.speed.toFixed(1)} km/h • {leader.progress.toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Race Time */}
      <div className="metric-card">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg neon-glow-cyan">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">Elapsed Time</div>
            <div className="font-mono font-semibold text-white text-lg">{timeElapsed}</div>
            <div className="text-xs text-blue-400">Live timing</div>
          </div>
        </div>
      </div>

      {/* Active Runners */}
      <div className="metric-card">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg neon-glow-green">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">Active Runners</div>
            <div className="font-semibold text-white text-lg">{totalRunners}</div>
            <div className="text-xs text-emerald-400">All connected</div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="metric-card">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
              connectionState.connected ? "from-green-400 to-emerald-500 neon-glow-green" : "from-red-500 to-rose-500"
            } flex items-center justify-center shadow-lg`}
          >
            <ConnectionIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">Connection</div>
            <div className={`font-semibold capitalize ${getConnectionColor()}`}>{connectionState.connectionState}</div>
            {connectionState.lastUpdate && (
              <div className="text-xs text-gray-400">Updated {connectionState.lastUpdate}</div>
            )}
          </div>
        </div>
      </div>

      {/* Live Commentary - Spans full width on larger screens */}
      <div className="lg:col-span-4 metric-card">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg neon-glow-purple flex-shrink-0">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-2">Live Commentary</div>
            <div className="text-white leading-relaxed">{liveCommentary}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
