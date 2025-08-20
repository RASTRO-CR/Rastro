import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Settings,
  Zap,
  Users,
  MapPin,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface ModernNavbarProps {
  currentPage: "race" | "config";
  onPageChange: (page: "race" | "config") => void;
  isAdmin: boolean;
  connectionStatus: {
    connected: boolean;
    connectionState: "connecting" | "connected" | "disconnected" | "error";
  };
  activeRunners: number;
  unreadAlerts: number;
}

export function ModernNavbar({
  currentPage,
  onPageChange,
  isAdmin,
  connectionStatus,
  activeRunners,
  unreadAlerts,
}: ModernNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getConnectionStatusConfig = () => {
    switch (connectionStatus.connectionState) {
      case "connected":
        return { color: "status-online", text: "Live", icon: Activity };
      case "connecting":
        return { color: "status-warning", text: "Connecting", icon: Activity };
      case "disconnected":
        return { color: "status-offline", text: "Offline", icon: Activity };
      case "error":
        return { color: "status-offline", text: "Error", icon: Activity };
    }
  };

  const statusConfig = getConnectionStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <nav className="glass-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg neon-glow-cyan">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">RASTRO</h1>
                <p className="text-xs text-gray-400">
                  Real-Time Sports Tracking
                </p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="hidden md:flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${statusConfig.color} pulse-glow`}
              />
              <span className="text-sm font-medium text-gray-300">
                {statusConfig.text}
              </span>
            </div>
          </div>

          {/* Status Indicators and Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onPageChange("race")}
                className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === "race"
                    ? "active text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Race Monitor</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => onPageChange("config")}
                  className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === "config"
                      ? "active text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Race Config</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="glass-button"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 mt-2 pt-4 pb-4 fade-in">
            <div className="space-y-3">
              {/* Connection Status - Mobile */}
              <div className="flex items-center justify-between glass-card p-3">
                <div className="flex items-center space-x-2">
                  <StatusIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Connection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${statusConfig.color}`}
                  />
                  <span className="text-sm text-gray-300">
                    {statusConfig.text}
                  </span>
                </div>
              </div>

              {/* Navigation - Mobile */}
              <button
                onClick={() => {
                  onPageChange("race");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentPage === "race"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 neon-glow-cyan"
                    : "glass-card text-gray-300 hover:text-white"
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Race Monitor</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    onPageChange("config");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentPage === "config"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 neon-glow-cyan"
                      : "glass-card text-gray-300 hover:text-white"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Race Config</span>
                </button>
              )}

              {/* Stats - Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3 text-center">
                  <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">
                    {activeRunners}
                  </div>
                  <div className="text-xs text-gray-400">Active Runners</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <Bell className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">
                    {unreadAlerts}
                  </div>
                  <div className="text-xs text-gray-400">Alerts</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
