"use client"

import { useAuth } from "@/components/auth-provider"
import { LandingPage } from "@/components/landing-page"
import { PlayerDashboard } from "@/components/player-dashboard"
import { OwnerDashboard } from "@/components/owner-dashboard"
import { UserRole } from "@/lib/types" // Import UserRole enum

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return user.role === UserRole.Player ? <PlayerDashboard /> : <OwnerDashboard />
}
