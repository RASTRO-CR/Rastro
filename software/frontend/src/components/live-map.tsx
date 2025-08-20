"use client"

import { useRef, useEffect, useState } from "react"
import { Navigation, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Runner } from "@/lib/types"

// Mapbox types
interface MapboxMap {
  on: (event: string, callback: (e?: any) => void) => void
  off: (event: string, callback: (e?: any) => void) => void
  addSource: (id: string, source: any) => void
  addLayer: (layer: any) => void
  removeLayer: (id: string) => void
  removeSource: (id: string) => void
  getSource: (id: string) => any
  flyTo: (options: any) => void
  setLayoutProperty: (layerId: string, property: string, value: any) => void
  setPaintProperty: (layerId: string, property: string, value: any) => void
  getCanvas: () => HTMLCanvasElement
  resize: () => void
  remove: () => void
  setStyle: (style: string) => void
}

declare global {
  interface Window {
    mapboxgl: {
      Map: new (options: any) => MapboxMap
      Marker: new (
        options?: any,
      ) => {
        setLngLat: (lngLat: [number, number]) => any
        addTo: (map: MapboxMap) => any
        remove: () => void
        getElement: () => HTMLElement
        setPopup: (popup: any) => any
      }
      Popup: new (
        options?: any,
      ) => {
        setLngLat: (lngLat: [number, number]) => any
        setHTML: (html: string) => any
        addTo: (map: MapboxMap) => any
        remove: () => void
      }
      accessToken: string
    }
  }
}

interface LiveMapProps {
  runners: Runner[]
  selectedRunner: string | null
  onRunnerSelect: (runnerId: string) => void
}

export function LiveMap({ runners, selectedRunner, onRunnerSelect }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<MapboxMap | null>(null)
  const markers = useRef<Map<string, any>>(new Map())
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapStyle, setMapStyle] = useState<"satellite" | "streets" | "dark">("dark")

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainer.current) return

    // Load Mapbox GL JS
    const script = document.createElement("script")
    script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
    script.onload = initializeMap
    document.head.appendChild(script)

    const link = document.createElement("link")
    link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      if (map.current) {
        map.current.remove()
      }
      // Clean up markers
      markers.current.forEach((marker) => marker.remove())
      markers.current.clear()
    }
  }, [])

  const initializeMap = () => {
    if (!window.mapboxgl || !mapContainer.current) return

    // You'll need to replace this with your actual Mapbox token
    window.mapboxgl.accessToken = "pk.eyJ1Ijoibm90ZmFiaWFuIiwiYSI6ImNtZWhoNGthZzAwbzYybHB3ZGxlZTUzZDAifQ.AtZ9nA6r_aqrcQ8A2nwymA"

    const mapStyleUrls = {
      dark: "mapbox://styles/mapbox/dark-v11",
      streets: "mapbox://styles/mapbox/streets-v12",
      satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    }

    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyleUrls[mapStyle],
      center: [-83.9142, 9.4747], // Costa Rica coordinates
      zoom: 13,
      pitch: 45,
      bearing: 0,
    })

    map.current.on("load", () => {
      setMapLoaded(true)
      addRouteToMap()
      updateRunnerMarkers()
    })
  }

  const addRouteToMap = () => {
    if (!map.current || !mapLoaded) return

    // Mock GPX route data - in real implementation, this would come from uploaded GPX file
    const routeCoordinates: [number, number][] = [
      [-83.9142, 9.4747],
      [-83.92, 9.485],
      [-83.93, 9.495],
      [-83.94, 9.505],
      [-83.95, 9.515],
      [-83.96, 9.525],
      [-83.97, 9.535],
      [-83.98, 9.545],
    ]

    // Add route source
    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routeCoordinates,
        },
      },
    })

    // Add route layer with gradient effect
    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ec4899",
        "line-width": 6,
        "line-opacity": 0.8,
      },
    })

    // Add route glow effect
    map.current.addLayer({
      id: "route-glow",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ec4899",
        "line-width": 12,
        "line-opacity": 0.3,
        "line-blur": 4,
      },
    })

    // Add start marker
    const startMarker = new window.mapboxgl.Marker({
      color: "#10b981",
      scale: 1.2,
    })
      .setLngLat(routeCoordinates[0])
      .addTo(map.current)

    // Add finish marker
    const finishMarker = new window.mapboxgl.Marker({
      color: "#ef4444",
      scale: 1.2,
    })
      .setLngLat(routeCoordinates[routeCoordinates.length - 1])
      .addTo(map.current)
  }

  const updateRunnerMarkers = () => {
    if (!map.current || !mapLoaded) return

    runners.forEach((runner, index) => {
      const runnerId = runner.id
      let marker = markers.current.get(runnerId)

      if (!marker) {
        // Create new marker
        const el = document.createElement("div")
        el.className = "runner-marker"
        el.style.cssText = `
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          background-color: ${getRunnerColor(index)};
        `

        marker = new window.mapboxgl.Marker({ element: el })
          .setLngLat([runner.position.lng, runner.position.lat])
          .addTo(map.current)

        // Add click handler
        el.addEventListener("click", () => {
          onRunnerSelect(runnerId)
        })

        // Create popup
        const popup = new window.mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
        })

        marker.setPopup(popup)
        markers.current.set(runnerId, marker)
      } else {
        // Update existing marker position with smooth animation
        marker.setLngLat([runner.position.lng, runner.position.lat])
      }

      // Update marker appearance based on selection
      const markerElement = marker.getElement()
      if (selectedRunner === runnerId) {
        markerElement.style.transform = "scale(1.5)"
        markerElement.style.zIndex = "1000"
        markerElement.style.boxShadow = "0 0 20px rgba(236, 72, 153, 0.8)"

        // Update popup content
        const popup = marker.getPopup()
        popup.setHTML(`
          <div class="bg-black/90 text-white p-3 rounded-lg text-sm">
            <div class="font-semibold text-purple-300">${runner.name}</div>
            <div class="mt-1">Speed: <span class="text-green-400">${runner.speed.toFixed(1)} km/h</span></div>
            <div>Distance to finish: <span class="text-blue-400">${runner.distanceToFinish.toFixed(1)} km</span></div>
            <div>Progress: <span class="text-yellow-400">${runner.progress.toFixed(1)}%</span></div>
          </div>
        `)
        popup.addTo(map.current)
      } else {
        markerElement.style.transform = "scale(1)"
        markerElement.style.zIndex = "100"
        markerElement.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)"
        marker.getPopup().remove()
      }
    })

    // Remove markers for runners that no longer exist
    markers.current.forEach((marker, runnerId) => {
      if (!runners.find((r) => r.id === runnerId)) {
        marker.remove()
        markers.current.delete(runnerId)
      }
    })
  }

  const getRunnerColor = (index: number) => {
    const colors = ["#fbbf24", "#d1d5db", "#d97706", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"]
    return colors[index % colors.length]
  }

  const focusOnRunner = (runner: Runner) => {
    if (!map.current) return

    map.current.flyTo({
      center: [runner.position.lng, runner.position.lat],
      zoom: 16,
      pitch: 60,
      duration: 2000,
    })
  }

  const changeMapStyle = (style: "satellite" | "streets" | "dark") => {
    if (!map.current) return

    const mapStyleUrls = {
      dark: "mapbox://styles/mapbox/dark-v11",
      streets: "mapbox://styles/mapbox/streets-v12",
      satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    }

    map.current.setStyle(mapStyleUrls[style])
    setMapStyle(style)

    // Re-add route and markers after style change
    map.current.on("styledata", () => {
      setTimeout(() => {
        addRouteToMap()
        updateRunnerMarkers()
      }, 100)
    })
  }

  // Update markers when runners change
  useEffect(() => {
    if (mapLoaded) {
      updateRunnerMarkers()
    }
  }, [runners, selectedRunner, mapLoaded])

  // Focus on selected runner
  useEffect(() => {
    if (selectedRunner && mapLoaded) {
      const runner = runners.find((r) => r.id === selectedRunner)
      if (runner) {
        focusOnRunner(runner)
      }
    }
  }, [selectedRunner, mapLoaded])

  return (
    <div className="h-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2 text-white">
            <Navigation className="w-4 h-4" />
            <span className="text-sm font-semibold">Live GPS Tracking</span>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-2">
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant={mapStyle === "dark" ? "default" : "ghost"}
              onClick={() => changeMapStyle("dark")}
              className="text-xs px-2 py-1 h-auto"
            >
              Dark
            </Button>
            <Button
              size="sm"
              variant={mapStyle === "streets" ? "default" : "ghost"}
              onClick={() => changeMapStyle("streets")}
              className="text-xs px-2 py-1 h-auto"
            >
              Streets
            </Button>
            <Button
              size="sm"
              variant={mapStyle === "satellite" ? "default" : "ghost"}
              onClick={() => changeMapStyle("satellite")}
              className="text-xs px-2 py-1 h-auto"
            >
              Satellite
            </Button>
          </div>
        </div>
      </div>

      {/* Map Status */}
      <div className="absolute top-4 right-4 z-10">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${mapLoaded ? "bg-green-400" : "bg-yellow-400"}`} />
            <span className="text-white text-sm">{mapLoaded ? "GPS Connected" : "Loading GPS..."}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-white mb-2">
            <Layers className="w-4 h-4" />
            <span className="text-sm font-semibold">Legend</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-300">Start</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-gray-300">Finish</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-pink-500 rounded" />
              <span className="text-gray-300">Route</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white" />
              <span className="text-gray-300">Leader</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <div className="text-lg font-semibold">Loading GPS Map...</div>
            <div className="text-sm text-gray-300 mt-2">Connecting to Mapbox services</div>
          </div>
        </div>
      )}
    </div>
  )
}
