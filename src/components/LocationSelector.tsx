"use client"

import { useState, useRef, useEffect } from "react"
import { useLocation, UserLocation } from "@/contexts/LocationContext"

export default function LocationSelector() {
  const { location, setLocation, requestCurrentLocation, savedLocations } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<UserLocation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside (Desktop)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if it's the mobile fullscreen view
      if (window.innerWidth < 768) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isOpen])

  // Debounced Search API call
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(search)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Failed to search location:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search])

  const handleSelect = (loc: UserLocation) => {
    setLocation(loc)
    setIsOpen(false)
    setSearch("")
    setResults([])
  }

  const handleCurrentLocation = async () => {
    try {
      await requestCurrentLocation()
      setIsOpen(false)
    } catch (e) {
      // Error is handled in context with an alert
    }
  }

  // Prevents hydration mismatch on first render
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const currentLabel = mounted ? (location?.label || "Select Location") : "Select Location"
  // Keep it compact for the header
  const shortLabel = currentLabel.split(',')[0]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Header Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm bg-white py-2 px-4 rounded-full border border-[#F0EBE3] hover:border-[#12666A] transition-colors shadow-sm"
      >
        <span className="text-[#F47A2A]">📍</span>
        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] uppercase font-bold text-[#6F6F6F] leading-none">Delivering to</span>
          <span className="font-bold text-[#12666A] leading-tight truncate max-w-[120px] md:max-w-[180px]">
            {shortLabel}
          </span>
        </div>
        <span className="text-xs text-[#6F6F6F] ml-1">▼</span>
      </button>

      {/* Dropdown / Popover / Bottom Sheet */}
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div className="md:hidden fixed inset-0 bg-black/60 z-50 animate-in fade-in" onClick={() => setIsOpen(false)} />
          
          <div className="fixed inset-x-0 bottom-0 md:absolute md:inset-auto md:top-full md:left-auto md:right-0 md:mt-2 h-[85vh] md:h-auto w-full md:w-[360px] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border-t md:border border-[#F0EBE3] z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-top-2 duration-300">
            
            {/* Mobile Drag Handle */}
            <div className="md:hidden w-full flex justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="p-4 border-b border-[#F0EBE3]">
              <div className="flex items-center justify-between md:hidden mb-4">
                <h2 className="font-bold text-lg">Choose Delivery Location</h2>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-bold">×</button>
              </div>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search area, city or landmark..."
                  className="w-full bg-[#FBF6EC] border border-transparent rounded-xl py-3 md:py-2.5 pl-10 pr-4 text-base md:text-sm text-[#252525] focus:outline-none focus:border-[#12666A]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                {search && (
                  <button 
                    onClick={() => {setSearch(""); setResults([]);}}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 md:max-h-[350px]">
              {!search ? (
                <>
                  <button 
                    onClick={handleCurrentLocation}
                    className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-[#FBF6EC] transition-colors text-[#12666A] font-medium border-b border-[#F0EBE3]"
                  >
                    <span className="text-xl">🎯</span>
                    Use Current Location
                  </button>

                  {savedLocations.length > 0 && (
                    <div className="px-5 py-4">
                      <div className="text-xs font-bold text-[#6F6F6F] uppercase mb-3">Saved Places</div>
                      {savedLocations.map((loc, i) => (
                        <button 
                          key={`saved-${i}`}
                          onClick={() => handleSelect(loc)}
                          className="w-full text-left py-3 flex items-center gap-3 hover:bg-[#FBF6EC] transition-colors rounded-xl px-3 -ml-3 mb-1"
                        >
                          <span className="text-[#F47A2A] text-lg">{loc.label.includes('Home') ? '🏠' : '💼'}</span>
                          <span className="text-base md:text-sm font-medium text-[#252525]">{loc.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="px-5 py-4 bg-gray-50 border-t border-[#F0EBE3]">
                    <div className="text-xs font-bold text-[#6F6F6F] uppercase mb-3">Popular Maharashtra Markets</div>
                    <div className="flex flex-wrap gap-2">
                      {["Mumbai", "Andheri", "Pune", "Kothrud", "Wakad", "Nagpur", "Nashik", "Navi Mumbai"].map(city => (
                        <button 
                          key={city}
                          onClick={() => setSearch(city)}
                          className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-600 hover:border-[#12666A] hover:text-[#12666A]"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-2 py-2">
                  {isSearching ? (
                    <div className="px-4 py-8 text-center text-[#6F6F6F] flex flex-col items-center">
                      <div className="w-6 h-6 border-2 border-[#12666A] border-t-transparent rounded-full animate-spin mb-3"></div>
                      Searching Maharashtra...
                    </div>
                  ) : results.length > 0 ? (
                    results.map((loc, i) => (
                      <button 
                        key={`loc-${i}`}
                        onClick={() => handleSelect(loc)}
                        className="w-full text-left py-3 px-4 flex items-start gap-3 hover:bg-[#FBF6EC] transition-colors rounded-xl mb-1 group"
                      >
                        <span className="text-gray-300 group-hover:text-[#F47A2A] mt-0.5 transition-colors">📍</span>
                        <div className="flex flex-col">
                          <span className="text-base md:text-sm font-bold text-[#252525]">{loc.locality}</span>
                          {loc.city && <span className="text-xs text-[#6F6F6F]">{loc.city}, Maharashtra</span>}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="text-3xl mb-2">🌍</div>
                      <div className="font-bold text-[#252525] mb-1">No locations found</div>
                      <div className="text-sm text-[#6F6F6F]">Try searching for a different area in Maharashtra.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
