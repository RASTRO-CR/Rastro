import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Activity, Timer } from "lucide-react"
import type { Runner } from "@/lib/types"

interface DetailedStatsProps {
  runners: Runner[]
}

export function DetailedStats({ runners }: DetailedStatsProps) {
  const avgSpeed = runners.reduce((sum, runner) => sum + runner.speed, 0) / runners.length
  const totalDistance = 85.5 // km
  const completedDistance =
    runners.reduce((sum, runner) => sum + (totalDistance * runner.progress) / 100, 0) / runners.length

  return (
    <div className="h-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
      <div className="flex items-center space-x-2 text-white mb-4">
        <BarChart3 className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Detailed Analytics</h2>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-4">
          {/* Overall Stats */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Race Overview</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-300">Avg Speed</div>
                <div className="text-white font-mono">{avgSpeed.toFixed(1)} km/h</div>
              </div>
              <div>
                <div className="text-gray-300">Avg Distance</div>
                <div className="text-white font-mono">{completedDistance.toFixed(1)} km</div>
              </div>
              <div>
                <div className="text-gray-300">Total Runners</div>
                <div className="text-white font-mono">{runners.length}</div>
              </div>
              <div>
                <div className="text-gray-300">Race Distance</div>
                <div className="text-white font-mono">{totalDistance} km</div>
              </div>
            </div>
          </div>

          {/* Speed Distribution */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-white mb-3">
              <TrendingUp className="w-4 h-4" />
              <h3 className="font-semibold">Speed Distribution</h3>
            </div>
            <div className="space-y-2">
              {["0-20 km/h", "20-30 km/h", "30-40 km/h", "40+ km/h"].map((range) => {
                const percentage = Math.random() * 100
                return (
                  <div key={range}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{range}</span>
                      <span className="text-white">{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2 bg-white/20" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Individual Performance */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-white mb-3">
              <Activity className="w-4 h-4" />
              <h3 className="font-semibold">Top Performers</h3>
            </div>
            <div className="space-y-3">
              {runners.slice(0, 3).map((runner, index) => (
                <div key={runner.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-yellow-400 text-black"
                          : index === 1
                            ? "bg-gray-300 text-black"
                            : "bg-amber-600 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-white text-sm">{runner.name}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-green-400">{runner.speed.toFixed(1)} km/h</div>
                    <div className="text-gray-400">{runner.progress.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-white mb-3">
              <Timer className="w-4 h-4" />
              <h3 className="font-semibold">System Health</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">GPS Accuracy</span>
                <span className="text-green-400">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Data Latency</span>
                <span className="text-green-400">1.2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Battery Status</span>
                <span className="text-yellow-400">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Connection</span>
                <span className="text-green-400">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
