"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface UserLocation {
  label: string
  lat: number
  lng: number
  city?: string
  locality?: string
}

// Default fallback if everything fails
const DEFAULT_LOCATION: UserLocation = { 
  label: "Mumbai, Maharashtra", 
  lat: 19.0760, 
  lng: 72.8777,
  city: "Mumbai",
  locality: "Mumbai"
}

interface LocationContextType {
  location: UserLocation | null
  setLocation: (loc: UserLocation) => void
  requestCurrentLocation: () => Promise<void>
  savedLocations: UserLocation[]
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<UserLocation | null>(null)
  const [savedLocations] = useState<UserLocation[]>([
    { label: "Home (Kothrud)", lat: 18.5074, lng: 73.8077 },
    { label: "Office (Baner)", lat: 18.5590, lng: 73.7868 },
  ])

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem("homebite_user_location")
    if (saved) {
      try {
        setLocationState(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved location")
        setLocationState(DEFAULT_LOCATION)
      }
    } else {
      // Default to Mumbai for first-time demo users
      setLocationState(DEFAULT_LOCATION)
    }
  }, [])

  const setLocation = (loc: UserLocation) => {
    setLocationState(loc)
    localStorage.setItem("homebite_user_location", JSON.stringify(loc))
  }

  const requestCurrentLocation = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser")
        reject()
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          try {
            const res = await fetch(`/api/location/reverse?lat=${lat}&lon=${lng}`);
            if (res.ok) {
              const data = await res.json();
              setLocation({
                label: data.label,
                lat: data.lat,
                lng: data.lng,
                city: data.city,
                locality: data.locality
              });
              resolve();
              return;
            }
          } catch (err) {
            console.error("Reverse geocoding failed", err);
          }

          // Fallback if API fails
          const loc = {
            label: "Current Location",
            lat,
            lng
          }
          setLocation(loc)
          resolve()
        },
        (error) => {
          console.error("Error getting location", error)
          alert("Unable to retrieve your location. Please select manually.")
          reject()
        }
      )
    })
  }

  return (
    <LocationContext.Provider value={{ location, setLocation, requestCurrentLocation, savedLocations }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
