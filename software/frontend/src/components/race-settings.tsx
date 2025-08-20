"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, RefreshCw, AlertTriangle } from "lucide-react"

interface RaceSettingsProps {
  raceStarted: boolean
  routeData?: any
  connectionState: {
    connected: boolean
    connectionState: "connecting" | "connected" | "disconnected" | "error"
    lastUpdate: string | null
  }
}

export function RaceSettings({ raceStarted, routeData, connectionState }: RaceSettingsProps) {
  const [settings, setSettings] = useState({
    raceName: "Gran Fondo Chirripó 2025",
    updateInterval: "2",
    gpsAccuracy: "high",
    alertsEnabled: true,
    autoBackup: true,
    emergencyMode: false,
    maxRunners: "100",
    timeZone: "America/Costa_Rica",
  })

  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings)
    setHasChanges(false)
  }

  const handleReset = () => {
    // Reset to defaults
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Warning for live race */}
      {raceStarted && (
        <div className="glass-card p-4 border-amber-500/30 bg-amber-500/10">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <div className="font-semibold text-amber-400">Race is Active</div>
              <div className="text-sm text-amber-300">Some settings cannot be changed during an active race.</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="raceName" className="text-gray-300">
                Race Name
              </Label>
              <Input
                id="raceName"
                value={settings.raceName}
                onChange={(e) => handleSettingChange("raceName", e.target.value)}
                disabled={raceStarted}
                className="mt-1 bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="maxRunners" className="text-gray-300">
                Maximum Runners
              </Label>
              <Input
                id="maxRunners"
                type="number"
                value={settings.maxRunners}
                onChange={(e) => handleSettingChange("maxRunners", e.target.value)}
                disabled={raceStarted}
                className="mt-1 bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="timeZone" className="text-gray-300">
                Time Zone
              </Label>
              <Select
                value={settings.timeZone}
                onValueChange={(value) => handleSettingChange("timeZone", value)}
                disabled={raceStarted}
              >
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Costa_Rica">Costa Rica (UTC-6)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tracking Settings */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tracking Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="updateInterval" className="text-gray-300">
                Update Interval (seconds)
              </Label>
              <Select
                value={settings.updateInterval}
                onValueChange={(value) => handleSettingChange("updateInterval", value)}
              >
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 second (High frequency)</SelectItem>
                  <SelectItem value="2">2 seconds (Recommended)</SelectItem>
                  <SelectItem value="5">5 seconds (Battery saving)</SelectItem>
                  <SelectItem value="10">10 seconds (Low frequency)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gpsAccuracy" className="text-gray-300">
                GPS Accuracy
              </Label>
              <Select value={settings.gpsAccuracy} onValueChange={(value) => handleSettingChange("gpsAccuracy", value)}>
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (±1-3m)</SelectItem>
                  <SelectItem value="medium">Medium (±3-5m)</SelectItem>
                  <SelectItem value="low">Low (±5-10m)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Enable Alerts</Label>
                <p className="text-sm text-gray-400">Receive notifications for critical events</p>
              </div>
              <Switch
                checked={settings.alertsEnabled}
                onCheckedChange={(checked) => handleSettingChange("alertsEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Auto Backup</Label>
                <p className="text-sm text-gray-400">Automatically backup race data</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Emergency Mode</Label>
                <p className="text-sm text-gray-400">Enhanced monitoring for safety</p>
              </div>
              <Switch
                checked={settings.emergencyMode}
                onCheckedChange={(checked) => handleSettingChange("emergencyMode", checked)}
              />
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Route Information</h3>
          {routeData ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Route Name:</span>
                <span className="text-white font-medium">{routeData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distance:</span>
                <span className="text-white font-medium">{routeData.distance.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Elevation Gain:</span>
                <span className="text-white font-medium">+{routeData.elevationGain.toFixed(0)}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Waypoints:</span>
                <span className="text-white font-medium">{routeData.coordinates?.length || 0}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No route loaded</div>
              <div className="text-sm text-gray-500">Upload a GPX file in Race Controls</div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between glass-card p-4">
        <div className="text-sm text-gray-400">{hasChanges ? "You have unsaved changes" : "All settings saved"}</div>
        <div className="flex space-x-3">
          <Button variant="ghost" onClick={handleReset} disabled={!hasChanges} className="glass-button">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
