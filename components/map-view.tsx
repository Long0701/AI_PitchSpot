"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCourts } from "@/hooks/use-courts"
import { SPORTS_CONFIG } from "@/lib/types"
import { Star, Search, MapPin } from "lucide-react"
import { formatVND } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useMap } from "react-leaflet"

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

// Fix for default markers in react-leaflet
const fixLeafletIcons = () => {
  if (typeof window !== "undefined") {
    const L = require("leaflet")
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }
}

// Custom marker icons for different sports
const createSportIcon = (color: string, icon: string) => {
  if (typeof window === "undefined") return null
  
  const L = require("leaflet")
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px; 
        height: 32px; 
        background-color: ${color}; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
        font-size: 16px; 
        font-weight: bold; 
        border: 2px solid white; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${icon}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

// Search marker icon
const createSearchIcon = () => {
  if (typeof window === "undefined") return null
  
  const L = require("leaflet")
  return L.divIcon({
    className: 'search-marker',
    html: `
      <div style="
        width: 32px; 
        height: 32px; 
        background-color: #ef4444; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
        font-size: 16px; 
        font-weight: bold; 
        border: 2px solid white; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        animation: bounce 1s infinite;
      ">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

// Map controller component for programmatic map control
function MapController({ 
  center, 
  zoom, 
  selectedCourtId 
}: { 
  center: { lat: number; lng: number }
  zoom: number
  selectedCourtId: string | null
}) {
  const map = useMap()
  
  useEffect(() => {
    if (map) {
      map.setView([center.lat, center.lng], zoom)
    }
  }, [center, zoom, map])
  
  return null
}

// Geocoding function using Nominatim API
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; display_name: string } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=vn`
    )
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name
      }
    }
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export function MapView() {
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 16.0471, lng: 108.2068 }) // Đà Nẵng
  const [mapZoom, setMapZoom] = useState(12)
  const [searchAddressQuery, setSearchAddressQuery] = useState("")
  const [searchedLocationDetails, setSearchedLocationDetails] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Use the hook for fetching courts
  const { courts, loading, error } = useCourts()

  // Fix Leaflet icons on client side
  useEffect(() => {
    setIsClient(true)
    fixLeafletIcons()
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter({ lat: latitude, lng: longitude })
          setMapZoom(14) 
        },
        (error) => {
          console.warn("Không thể lấy vị trí, sử dụng Đà Nẵng mặc định", error)
        }
      )
    }
  }, [])

  const selectedCourtData = selectedCourtId ? courts.find((c) => c.id === selectedCourtId) : null

  const handleMarkerClick = (courtId: string) => {
    setSelectedCourtId(courtId)
    const court = courts.find((c) => c.id === courtId)
    if (court) {
      setMapCenter({ lat: court.lat, lng: court.lng })
      setMapZoom(14)
      setSearchedLocationDetails(null)
    }
  }

  const handleSearch = async () => {
    if (!searchAddressQuery.trim()) return
    
    setIsSearching(true)
    
    // First try to find a court that matches the search
    const query = searchAddressQuery.toLowerCase()
    const foundCourt = courts.find(
      (court) =>
        court.city.toLowerCase().includes(query) ||
        court.address.toLowerCase().includes(query) ||
        court.name.toLowerCase().includes(query),
    )

    if (foundCourt) {
      setMapCenter({ lat: foundCourt.lat, lng: foundCourt.lng })
      setMapZoom(14)
      setSearchedLocationDetails({
        lat: foundCourt.lat,
        lng: foundCourt.lng,
        address: foundCourt.address,
      })
      setSelectedCourtId(null)
    } else {
      // Use geocoding API for address search
      const geocodedResult = await geocodeAddress(searchAddressQuery)
      
      if (geocodedResult) {
        setMapCenter({ lat: geocodedResult.lat, lng: geocodedResult.lng })
        setMapZoom(14)
        setSearchedLocationDetails({
          lat: geocodedResult.lat,
          lng: geocodedResult.lng,
          address: geocodedResult.display_name,
        })
        setSelectedCourtId(null)
      } else {
        // Handle not found case
        console.log("Không tìm thấy địa chỉ")
        setSearchedLocationDetails(null)
      }
    }
    
    setIsSearching(false)
  }

  // Don't render map until client-side
  if (!isClient) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Đang tải bản đồ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={mapZoom} 
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <MapController 
          center={mapCenter} 
          zoom={mapZoom} 
          selectedCourtId={selectedCourtId}
        />

        {/* Search Input and Button */}
        <div className="absolute top-2 left-12 z-[1000] flex space-x-2">
          <Input
            placeholder="Tìm kiếm theo tên hoặc địa chỉ sân"
            value={searchAddressQuery}
            onChange={(e) => setSearchAddressQuery(e.target.value)}
            className="w-64 bg-white shadow-md"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <Button 
            onClick={handleSearch} 
            className="shadow-md"
            disabled={isSearching}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Searched Location Marker */}
        {searchedLocationDetails && (
          <Marker 
            position={[searchedLocationDetails.lat, searchedLocationDetails.lng]}
            icon={createSearchIcon()}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-medium text-sm">Kết quả tìm kiếm</h3>
                <p className="text-xs text-gray-600">{searchedLocationDetails.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Court Markers */}
        {courts.map((court) => {
          const sportConfig = SPORTS_CONFIG[court.sport]
          const icon = createSportIcon(sportConfig.color, sportConfig.icon)

          return (
            <Marker
              key={court.id}
              position={[court.lat, court.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleMarkerClick(court.id),
              }}
            >
              <Popup>
                <div className="w-64">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{court.name}</h3>
                    <Badge 
                      className="text-white text-xs" 
                      style={{ backgroundColor: sportConfig.color }}
                    >
                      {sportConfig.name}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{court.address}</p>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-xs">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {court.rating}
                    </div>
                    <span className="text-xs text-gray-600">{court.reviewCount} đánh giá</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-green-600">
                      {formatVND(court.price)}/giờ
                    </span>
                  </div>
                  <Button size="sm" className="w-full text-xs">
                    Đặt Ngay
                  </Button>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000]">
          <Card className="bg-white/90 backdrop-blur">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-2">Môn Thể Thao</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SPORTS_CONFIG).map(([key, sport]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: sport.color }}
                    >
                      {sport.icon}
                    </div>
                    <span className="text-xs">{sport.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MapContainer>
    </div>
  )
}
