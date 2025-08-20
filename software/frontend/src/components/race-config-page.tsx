import { useState } from "react";
import { AdminControls } from "@/components/admin-controls";
import { SystemStatus } from "@/components/system-status";
import type { Runner, Alert } from "@/lib/types";

interface RaceConfigPageProps {
  runners: Runner[];
  alerts: Alert[];
  raceStarted: boolean;
  routeData?: any;
  connectionState: {
    connected: boolean;
    connectionState: "connecting" | "connected" | "disconnected" | "error";
    lastUpdate: string | null;
  };
  onStartRace: () => void;
  onEndRace: () => void;
  onRouteUploaded?: (routeData: any) => void;
}

export function RaceConfigPage({
  runners,
  alerts,
  raceStarted,
  connectionState,
  onStartRace,
  onEndRace,
  onRouteUploaded,
}: RaceConfigPageProps) {
  const [activeTab, setActiveTab] = useState<
    "controls" | "settings" | "system" | "analytics"
  >("controls");

  const tabs = [
    { id: "controls", label: "Race Controls", icon: "🎮" },
    // { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "system", label: "System Status", icon: "📊" },
    // { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 p-4 space-y-6">
        {/* Page Header */}
        <div className="fade-in">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gradient mb-2">
                  Race Configuration
                </h1>
                <p className="text-gray-400">
                  Manage race settings, monitor system status, and control race
                  operations
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Race Status</div>
                  <div
                    className={`font-semibold ${
                      raceStarted ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {raceStarted ? "Active" : "Standby"}
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full ${
                    raceStarted ? "status-online" : "status-warning"
                  } pulse-glow`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="slide-in-right">
          <div className="glass-card p-2">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="fade-in" key={activeTab}>
          {activeTab === "controls" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <AdminControls
                  raceStarted={raceStarted}
                  onStartRace={onStartRace}
                  onEndRace={onEndRace}
                  onRouteUploaded={onRouteUploaded}
                />
              </div>
            </div>
          )}

          {/* Coming soon... */}

          {/* {activeTab === "settings" && (
            <RaceSettings raceStarted={raceStarted} routeData={routeData} connectionState={connectionState} />
          )} */}

          {activeTab === "system" && (
            <SystemStatus
              runners={runners}
              alerts={alerts}
              connectionState={connectionState}
              raceStarted={raceStarted}
            />
          )}

          {/* Coming soon... */}

          {/* {activeTab === "analytics" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="xl:col-span-2">
                <DetailedStats runners={runners} />
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
