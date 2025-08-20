"use client"

import { Button } from "@/components/ui/button"
import { ConnectionStatus } from "@/components/connection-status"
import { Trophy, Clock, MessageSquare, LogOut, Settings, Zap, Users } from "lucide-react"
import type { Runner } from "@/lib/types"

interface EnhancedHeaderProps {
  raceTitle: string
  leader: Runner
  timeElapsed: string
  liveCommentary: string
  totalRunners: number
  connectionState: {
    connected: boolean
    connectionState: "connecting" | "connected" | "disconnected" | "error"
    lastUpdate: string | null
  }
  onAdminAccess?: () => void
  onLogout?: () => void
  isAdmin?: boolean
}

export function EnhancedHeader({
  raceTitle,
  leader,
  timeElapsed,
  liveCommentary,
  totalRunners,
  connectionState,
  onAdminAccess,
  onLogout,
  isAdmin,
}: EnhancedHeaderProps) {
  return (
    <header className="glass-intense border-b border-white/20 px-6 py-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-animated opacity-5" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Race Title with Neon Effect */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center neon-glow-cyan">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">{raceTitle}</h1>
          </div>

          {/* Live Stats */}
          <div className="flex items-center space-x-6">
            {/* Leader */}
            <div className="glass-panel px-4 py-2 hover-lift">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Trophy className="w-5 h-5" />
                <div>
                  <div className="text-xs text-gray-400">Leader</div>
                  <div className="font-semibold">{leader.name}</div>
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="glass-panel px-4 py-2 hover-lift">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Clock className="w-5 h-5" />
                <div>
                  <div className="text-xs text-gray-400">Elapsed</div>
                  <div className="font-mono font-semibold">{timeElapsed}</div>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="glass-panel px-4 py-2 hover-lift">
              <div className="flex items-center space-x-2 text-purple-400">
                <Users className="w-5 h-5" />
                <div>
                  <div className="text-xs text-gray-400">Active</div>
                  <div className="font-semibold">{totalRunners} runners</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Live Commentary */}
          <div className="glass-panel px-4 py-2 max-w-md hover-lift">
            <div className="flex items-center space-x-2 text-green-400">
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400 mb-1">Live Commentary</div>
                <div className="text-sm truncate">{liveCommentary}</div>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <ConnectionStatus
            connected={connectionState.connected}
            connectionState={connectionState.connectionState}
            lastUpdate={connectionState.lastUpdate}
          />

          {/* Action Button */}
          {isAdmin ? (
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="glass-panel text-white hover:text-red-400 hover:bg-red-500/10 hover-lift"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button onClick={onAdminAccess} variant="ghost" size="sm" className="btn-neon hover-lift">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
