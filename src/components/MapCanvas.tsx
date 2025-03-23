
import React, { useRef, useEffect, useState } from "react";
import { CityCanvasProps } from "@/utils/types";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Using a free demo token - this should be replaced with user's own token in production
const MAPBOX_TOKEN = "pk.eyJ1IjoiZGl2eWFuc2h1bGlsYSIsImEiOiJjbHd0ejVrc2swYnYyMnFwZnVkNmt1Z2luIn0.Zk_28HlVYFl2jwLj1yzLgw";

const MapCanvas: React.FC<CityCanvasProps> = ({ state, onAddCity }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [78.3, 22.5], // Center on India
      zoom: 4,
      projection: "mercator"
    });
    
    mapInstance.on("load", () => {
      setMapLoaded(true);
    });
    
    // Add navigation controls
    mapInstance.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );
    
    map.current = mapInstance;
    
    return () => {
      mapInstance.remove();
    };
  }, []);
  
  // Draw markers and paths when state changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Remove existing markers
    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) {
      markers[0].remove();
    }
    
    // Remove existing layers and sources
    if (map.current.getLayer("route-layer")) {
      map.current.removeLayer("route-layer");
    }
    if (map.current.getLayer("best-route-layer")) {
      map.current.removeLayer("best-route-layer");
    }
    if (map.current.getSource("route")) {
      map.current.removeSource("route");
    }
    if (map.current.getSource("best-route")) {
      map.current.removeSource("best-route");
    }
    
    // Add markers for each city
    state.cities.forEach((city, index) => {
      // Convert normalized coordinates to longitude/latitude
      const lngLat = convertNormalizedToLngLat(city.x, city.y);
      
      // Create marker element
      const markerEl = document.createElement("div");
      markerEl.className = `marker-${index === 0 ? "start" : "city"}`;
      markerEl.style.width = "15px";
      markerEl.style.height = "15px";
      markerEl.style.borderRadius = "50%";
      markerEl.style.backgroundColor = index === 0 ? "#13df83" : "#9b87f5";
      markerEl.style.border = "2px solid white";
      markerEl.style.boxShadow = "0 0 10px rgba(255,255,255,0.5)";
      
      // Add label
      const label = document.createElement("div");
      label.textContent = index === 0 ? "Start" : `${index}`;
      label.style.color = "white";
      label.style.fontSize = "12px";
      label.style.position = "absolute";
      label.style.top = "-20px";
      label.style.left = "50%";
      label.style.transform = "translateX(-50%)";
      label.style.whiteSpace = "nowrap";
      label.style.textShadow = "0 0 3px black";
      markerEl.appendChild(label);
      
      // Add the marker to the map
      new mapboxgl.Marker(markerEl)
        .setLngLat(lngLat)
        .addTo(map.current!);
    });
    
    // Draw current path if we have enough cities
    if (state.cities.length >= 2 && state.currentPath.length > 0) {
      const pathCoordinates = [];
      
      // Start from the first city (index 0)
      pathCoordinates.push(convertNormalizedToLngLat(state.cities[0].x, state.cities[0].y));
      
      // Add all cities in the path
      for (const cityIndex of state.currentPath) {
        const city = state.cities[cityIndex];
        pathCoordinates.push(convertNormalizedToLngLat(city.x, city.y));
      }
      
      // Return to start
      pathCoordinates.push(convertNormalizedToLngLat(state.cities[0].x, state.cities[0].y));
      
      // Add current path
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: pathCoordinates
          }
        }
      });
      
      map.current.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#9b87f5",
          "line-width": 2,
          "line-opacity": 0.6,
          "line-dasharray": [2, 1]
        }
      });
    }
    
    // Draw best path if available
    if (state.cities.length >= 2 && state.bestPath.length > 0) {
      const bestPathCoordinates = [];
      
      // Start from the first city (index 0)
      bestPathCoordinates.push(convertNormalizedToLngLat(state.cities[0].x, state.cities[0].y));
      
      // Add all cities in the best path
      for (const cityIndex of state.bestPath) {
        const city = state.cities[cityIndex];
        bestPathCoordinates.push(convertNormalizedToLngLat(city.x, city.y));
      }
      
      // Return to start
      bestPathCoordinates.push(convertNormalizedToLngLat(state.cities[0].x, state.cities[0].y));
      
      // Add best path
      map.current.addSource("best-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: bestPathCoordinates
          }
        }
      });
      
      map.current.addLayer({
        id: "best-route-layer",
        type: "line",
        source: "best-route",
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#13df83",
          "line-width": 3,
          "line-opacity": state.isRunning ? 0.7 : 1
        }
      });
    }
  }, [state.cities, state.currentPath, state.bestPath, state.isRunning, mapLoaded]);
  
  // Handle map click to add cities
  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (map.current && !state.isRunning) {
      const { lng, lat } = e.lngLat;
      
      // Convert longitude/latitude to normalized coordinates (0-1 range)
      const normalizedCoords = convertLngLatToNormalized(lng, lat);
      onAddCity(normalizedCoords.x, normalizedCoords.y);
    }
  };
  
  // Set up click event
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    map.current.on("click", handleMapClick);
    
    return () => {
      if (map.current) {
        map.current.off("click", handleMapClick);
      }
    };
  }, [mapLoaded, state.isRunning, onAddCity]);
  
  return (
    <div className="w-full h-[500px] glass-panel rounded-xl overflow-hidden relative">
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Instructions when empty */}
      {state.cities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none">
          <div className="text-center opacity-90">
            <p className="text-xl font-light text-white">Click on the map to add cities</p>
            <p className="text-sm mt-1 text-white/70">The first city will be the starting point</p>
          </div>
        </div>
      )}
      
      {/* Custom overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent h-24 pointer-events-none" />
      
      {/* If simulation is running, show a message */}
      {state.isRunning && (
        <div className="absolute bottom-4 right-4 glass-panel px-3 py-1 rounded-lg text-sm animate-fade-in">
          <span className="inline-block w-2 h-2 bg-tsp-best rounded-full mr-2 animate-pulse-subtle"></span>
          Optimizing path...
        </div>
      )}
    </div>
  );
};

// Helper functions to convert between normalized coordinates (0-1) and longitude/latitude
function convertLngLatToNormalized(lng: number, lat: number) {
  // Simple linear mapping
  // This is a very basic conversion that should be improved for production use
  // Here we're just treating the longitude/latitude as if they were in a rectangular projection
  
  // World bounds (approximate)
  const minLng = -180;
  const maxLng = 180;
  const minLat = -90;
  const maxLat = 90;
  
  const normalizedX = (lng - minLng) / (maxLng - minLng);
  const normalizedY = 1 - (lat - minLat) / (maxLat - minLat); // Invert Y axis
  
  return {
    x: normalizedX,
    y: normalizedY
  };
}

function convertNormalizedToLngLat(x: number, y: number) {
  // World bounds (approximate)
  const minLng = -180;
  const maxLng = 180;
  const minLat = -90;
  const maxLat = 90;
  
  const lng = minLng + x * (maxLng - minLng);
  const lat = minLat + (1 - y) * (maxLat - minLat); // Invert Y axis
  
  return [lng, lat];
}

export default MapCanvas;
