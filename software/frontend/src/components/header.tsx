"use client"

import { Button } from "@/components/ui/button"
import { Trophy, Clock, MessageSquare, LogOut, Settings } from "lucide-react"
import type { Runner } from "@/lib/types"

interface HeaderProps {
  raceTitle: string
  leader: Runner
  timeElapsed: string
  liveCommentary: string
  onAdminAccess?: () => void
  onLogout?: () => void
  isAdmin?: boolean
}

export function Header({
  raceTitle,
  leader,
  timeElapsed,
  liveCommentary,
  onAdminAccess,
  onLogout,
  isAdmin,
}: HeaderProps) {
  return (
    <header className="backdrop-blur-md bg-white/10 border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-white">{raceTitle}</h1>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Leader: {leader.name}</span>
            </div>

            <div className="flex items-center space-x-2 text-blue-400">
              <Clock className="w-5 h-5" />
              <span className="font-mono">{timeElapsed}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-green-400 max-w-md">
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm truncate">{liveCommentary}</span>
          </div>

          {isAdmin ? (
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:text-red-400 hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button
              onClick={onAdminAccess}
              variant="ghost"
              size="sm"
              className="text-white hover:text-purple-400 hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
