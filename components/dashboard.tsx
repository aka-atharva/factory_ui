"use client"

import { useState, useEffect } from "react"
import DashboardHeader from "@/components/dashboard-header"
import FactoryDashboard from "@/components/pages/factory-dashboard"
import FactoryBot from "@/components/pages/factory-bot"
import HomePage from "@/components/pages/home"
import InteractiveParticles from "@/components/interactive-particles"
import { DashboardContext } from "@/components/pages/home"
import { useTheme } from "next-themes"

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("Home")
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render particles after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const pages = [
    { name: "Home", icon: "Home" },
    { name: "Factory Dashboard", icon: "Factory" },
    { name: "Factory Bot", icon: "Bot" },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <HomePage />
      case "Factory Dashboard":
        return <FactoryDashboard />
      case "Factory Bot":
        return <FactoryBot />
      default:
        return <HomePage />
    }
  }

  return (
    <DashboardContext.Provider value={{ setCurrentPage }}>
      <div className="min-h-screen bg-background relative">
        {/* Only render particles after component is mounted */}
        {mounted && (
          <InteractiveParticles
            quantity={150}
            staticity={30}
            ease={60}
            lightThemeColor="rgba(124, 58, 237, 0.8)" // Darker, more opaque purple for light theme
            darkThemeColor="rgba(255, 255, 255, 0.3)" // Original color for dark theme
            particleSize={1.8} // Slightly larger particles for better visibility
          />
        )}

        <div className="flex flex-col h-screen relative z-10">
          <DashboardHeader currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} />
          <main className="flex-1 overflow-auto p-6">{renderPage()}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  )
}

