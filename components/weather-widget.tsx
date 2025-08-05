"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockWeatherData } from "@/lib/mock-data"
import { Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react"

export function WeatherWidget() {
  const { current, forecast } = mockWeatherData

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-5 h-5 text-yellow-500" />
      case "partly cloudy":
        return <Cloud className="w-5 h-5 text-gray-500" />
      case "cloudy":
        return <Cloud className="w-5 h-5 text-gray-600" />
      case "light rain":
        return <CloudRain className="w-5 h-5 text-blue-500" />
      default:
        return <Sun className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getWeatherIcon(current.condition)}
          <span>Thời Tiết</span>
        </CardTitle>
        <CardDescription>Điều kiện hiện tại</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="text-center">
          <div className="text-3xl font-bold">{current.temperature}°C</div>
          <div className="text-sm text-gray-600">{current.condition}</div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>{current.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <span>{current.windSpeed} km/h</span>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div>
          <h4 className="text-sm font-medium mb-2">5 Giờ Tiếp Theo</h4>
          <div className="space-y-2">
            {forecast.slice(0, 3).map((hour, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{hour.time}</span>
                <div className="flex items-center space-x-2">
                  <span>{hour.icon}</span>
                  <span>{hour.temperature}°</span>
                  {hour.precipitation > 30 && (
                    <Badge variant="destructive" className="text-xs">
                      Mưa
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alert */}
        {forecast.some((f) => f.precipitation > 50) && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CloudRain className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Dự kiến có mưa sau đó</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">Hãy cân nhắc đặt sân trong nhà</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
