// import { Routes, Route, Link, useLocation } from "react-router-dom";
// import LiveTrackingMap from "./components/LiveTrackingMap";
// import ControlPointsMap from "./components/ControlPointsMap";
// import "./App.css";

// function App() {
//   const location = useLocation();

//   const getLinkClass = (path: string) => {
//     return location.pathname === path
//       ? "bg-sky-500 text-white"
//       : "bg-gray-700 hover:bg-gray-600";
//   };

//   return (
//     <div className="bg-gray-900 text-white h-screen flex flex-col">
//       <header className="p-4 bg-gray-800 shadow-lg z-10">
//         <h1 className="text-2xl font-bold text-center mb-4">
//           RASTRO
//         </h1>
//         <nav className="flex justify-center space-x-4">
//           <Link
//             to="/"
//             className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${getLinkClass('/')}`}
//           >
//             Seguimiento en Vivo
//           </Link>
//           <Link
//             to="/puntos-de-control"
//             className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${getLinkClass('/puntos-de-control')}`}
//           >
//             Puntos de Control
//           </Link>
//         </nav>
//       </header>
//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<LiveTrackingMap />} />
//           <Route path="/puntos-de-control" element={<ControlPointsMap />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;


"use client"

import { useState, useEffect } from "react"
import { ModernNavbar } from "@/components/modern-navbar"
import { RaceMonitorPage } from "@/components/race-monitor-page"
import { RaceConfigPage } from "@/components/race-config-page"
import { AdminLogin } from "@/components/admin-login"
import { useWebSocket } from "@/hooks/use-websocket"
import { mockRunners, mockAlerts } from "@/lib/mock-data"
import type { Runner, Alert } from "@/lib/types"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"race" | "config">("race")
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [selectedRunner, setSelectedRunner] = useState<string | null>(null)
  const [routeData, setRouteData] = useState<any>(null)
  const [raceStarted, setRaceStarted] = useState(true)

  // Initialize WebSocket connection
  const wsData = useWebSocket("wss://localhost:8080/race-data")

  // Merge WebSocket data with mock data for demo
  const [runners, setRunners] = useState<Runner[]>(mockRunners)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  // Update runners with WebSocket data
  useEffect(() => {
    if (wsData.runners.length > 0) {
      setRunners((prev) => {
        const updated = [...prev]
        wsData.runners.forEach((wsRunner) => {
          const index = updated.findIndex((r) => r.id === wsRunner.id)
          if (index >= 0) {
            updated[index] = { ...updated[index], ...wsRunner }
          }
        })
        return updated
      })
    }
  }, [wsData.runners])

  // Update alerts with WebSocket data
  useEffect(() => {
    if (wsData.alerts.length > 0) {
      setAlerts((prev) => [...wsData.alerts, ...prev].slice(0, 20)) // Keep last 20 alerts
    }
  }, [wsData.alerts])

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "password") {
      setIsAdmin(true)
      setShowLogin(false)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setCurrentPage("race")
  }

  const handleAdminAccess = () => {
    setShowLogin(true)
  }

  const handleStartRace = () => {
    if (routeData) {
      setRaceStarted(true)
      wsData.sendMessage("race_control", { action: "start", routeData })
    }
  }

  const handleEndRace = () => {
    setRaceStarted(false)
    wsData.sendMessage("race_control", { action: "end" })
  }

  const handleRunnerSelect = (runnerId: string) => {
    setSelectedRunner(runnerId)
  }

  const handleRouteUploaded = (newRouteData: any) => {
    setRouteData(newRouteData)
    wsData.sendMessage("route_upload", newRouteData)
  }

  const connectionState = {
    connected: wsData.connected,
    connectionState: wsData.connectionState,
    lastUpdate: wsData.lastUpdate,
  }

  const unreadAlerts = alerts.filter((alert) => !alert.resolved).length

  if (showLogin) {
    return <AdminLogin onLogin={handleLogin} onBack={() => setShowLogin(false)} />
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isAdmin={isAdmin}
        connectionStatus={connectionState}
        activeRunners={runners.length}
        unreadAlerts={unreadAlerts}
        onLogout={handleLogout}
        onAdminAccess={handleAdminAccess}
      />

      {currentPage === "race" ? (
        <RaceMonitorPage
          runners={runners}
          alerts={alerts}
          selectedRunner={selectedRunner}
          routeData={routeData}
          connectionState={connectionState}
          onRunnerSelect={handleRunnerSelect}
          isAdmin={isAdmin}
        />
      ) : (
        <RaceConfigPage
          runners={runners}
          alerts={alerts}
          raceStarted={raceStarted}
          routeData={routeData}
          connectionState={connectionState}
          onStartRace={handleStartRace}
          onEndRace={handleEndRace}
          onRouteUploaded={handleRouteUploaded}
        />
      )}
    </div>
  )
}
