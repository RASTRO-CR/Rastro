import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Trophy, Zap, Target, Heart, Battery, Signal } from "lucide-react"
import type { Runner } from "@/lib/types"

interface EnhancedRunnerSidebarProps {
  runners: Runner[]
  onRunnerSelect: (runnerId: string) => void
  selectedRunner: string | null
}

export function EnhancedRunnerSidebar({ runners, onRunnerSelect, selectedRunner }: EnhancedRunnerSidebarProps) {
  const sortedRunners = [...runners].sort((a, b) => b.progress - a.progress)

  const getPositionBadge = (index: number) => {
    if (index === 0) return { color: "bg-gradient-to-r from-yellow-400 to-yellow-600", text: "1st", icon: "🥇" }
    if (index === 1) return { color: "bg-gradient-to-r from-gray-300 to-gray-500", text: "2nd", icon: "🥈" }
    if (index === 2) return { color: "bg-gradient-to-r from-amber-600 to-amber-800", text: "3rd", icon: "🥉" }
    return { color: "bg-gradient-to-r from-blue-500 to-purple-600", text: `${index + 1}th`, icon: "" }
  }

  const getSpeedColor = (speed: number) => {
    if (speed > 35) return "text-green-400"
    if (speed > 25) return "text-yellow-400"
    if (speed > 15) return "text-orange-400"
    return "text-red-400"
  }

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-400"
    if (level > 30) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="h-full glass-panel p-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-white">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-gradient">Live Rankings</h2>
        </div>
        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          {runners.length} Active
        </Badge>
      </div>

      <ScrollArea className="h-[calc(100%-80px)] custom-scrollbar">
        <div className="space-y-3">
          {sortedRunners.map((runner, index) => {
            const positionBadge = getPositionBadge(index)
            const isSelected = selectedRunner === runner.id
            const timeSinceUpdate = runner.lastUpdate
              ? Math.floor((Date.now() - new Date(runner.lastUpdate).getTime()) / 1000)
              : 0

            return (
              <div
                key={runner.id}
                className={`card-interactive glass-panel p-4 transition-all duration-300 ${
                  isSelected ? "neon-glow-cyan border-cyan-400/50" : ""
                }`}
                onClick={() => onRunnerSelect(runner.id)}
              >
                {/* Runner Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${positionBadge.color} neon-glow-cyan`}
                    >
                      {positionBadge.icon || index + 1}
                    </div>
                    <div>
                      <div className="text-white font-semibold flex items-center space-x-2">
                        <span>{runner.name}</span>
                        {timeSinceUpdate < 10 && <div className="w-2 h-2 bg-green-400 rounded-full pulse-neon" />}
                      </div>
                      <div className="text-gray-400 text-sm">ID: {runner.id}</div>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center space-x-2">
                    <Signal className={`w-4 h-4 ${timeSinceUpdate < 30 ? "text-green-400" : "text-red-400"}`} />
                    {runner.batteryLevel && <Battery className={`w-4 h-4 ${getBatteryColor(runner.batteryLevel)}`} />}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="glass-panel p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${getSpeedColor(runner.speed)}`} />
                      <div>
                        <div className="text-xs text-gray-400">Speed</div>
                        <div className={`font-mono font-semibold ${getSpeedColor(runner.speed)}`}>
                          {runner.speed.toFixed(1)} km/h
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-xs text-gray-400">To Finish</div>
                        <div className="font-mono font-semibold text-blue-400">
                          {runner.distanceToFinish.toFixed(1)} km
                        </div>
                      </div>
                    </div>
                  </div>

                  {runner.heartRate && (
                    <div className="glass-panel p-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <div>
                          <div className="text-xs text-gray-400">Heart Rate</div>
                          <div className="font-mono font-semibold text-red-400">{runner.heartRate} bpm</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {runner.batteryLevel && (
                    <div className="glass-panel p-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Battery className={`w-4 h-4 ${getBatteryColor(runner.batteryLevel)}`} />
                        <div>
                          <div className="text-xs text-gray-400">Battery</div>
                          <div className={`font-mono font-semibold ${getBatteryColor(runner.batteryLevel)}`}>
                            {runner.batteryLevel}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Race Progress</span>
                    <span className="text-white font-mono">{runner.progress.toFixed(1)}%</span>
                  </div>
                  <div className="progress-neon h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                      style={{ width: `${runner.progress}%` }}
                    />
                  </div>
                </div>

                {/* Last Update */}
                <div className="mt-2 text-xs text-gray-500">Updated {timeSinceUpdate}s ago</div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
