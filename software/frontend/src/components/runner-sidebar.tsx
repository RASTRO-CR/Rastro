import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Trophy, Zap, Target } from "lucide-react"
import type { Runner } from "@/lib/types"

interface RunnerSidebarProps {
  runners: Runner[]
  onRunnerSelect: (runnerId: string) => void
  selectedRunner: string | null
}

export function RunnerSidebar({ runners, onRunnerSelect, selectedRunner }: RunnerSidebarProps) {
  const sortedRunners = [...runners].sort((a, b) => b.progress - a.progress)

  return (
    <div className="h-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
      <div className="flex items-center space-x-2 text-white mb-4">
        <Trophy className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Live Rankings</h2>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-3">
          {sortedRunners.map((runner, index) => (
            <div
              key={runner.id}
              className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                selectedRunner === runner.id ? "ring-2 ring-purple-400 bg-white/20" : ""
              }`}
              onClick={() => onRunnerSelect(runner.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-yellow-400 text-black"
                        : index === 1
                          ? "bg-gray-300 text-black"
                          : index === 2
                            ? "bg-amber-600 text-white"
                            : "bg-blue-400 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{runner.name}</div>
                    <div className="text-gray-300 text-sm">ID: {runner.id}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-400">
                    <Zap className="w-4 h-4" />
                    <span className="font-mono">{runner.speed.toFixed(1)} km/h</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-400 text-sm">
                    <Target className="w-3 h-3" />
                    <span>{runner.distanceToFinish.toFixed(1)} km</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-white font-mono">{runner.progress.toFixed(1)}%</span>
                </div>
                <Progress value={runner.progress} className="h-2 bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
