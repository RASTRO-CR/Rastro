export interface Runner {
  id: string
  name: string
  position: {
    lat: number
    lng: number
  }
  speed: number // km/h
  progress: number // percentage of race completed
  distanceToFinish: number // km
  batteryLevel?: number
  heartRate?: number // bpm
  lastUpdate: string
}

export interface Alert {
  id: string
  type: "accident" | "off-route" | "low-battery" | "system"
  severity: "low" | "medium" | "high" | "critical"
  runnerId: string
  message: string
  timestamp: string
  gForce?: number // for accident alerts
  resolved: boolean
}

export interface RaceEvent {
  id: string
  name: string
  startTime: string
  endTime?: string
  status: "pending" | "active" | "completed"
  route?: {
    gpxData: string
    distance: number
    elevationGain: number
  }
}

export interface WebSocketMessage {
  type: "runner_update" | "alert_update" | "race_control" | "route_upload" | "system_status"
  payload: any
  timestamp: string
}
