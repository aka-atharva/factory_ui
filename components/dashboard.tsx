"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import FactoryDashboard from "@/components/pages/factory-dashboard_old"
import FactoryBot from "@/components/pages/factory-bot_old"
import HomePage from "@/components/pages/home"
import { SparklesCore } from "@/components/sparkles"

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("Home")

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
    <div className="min-h-screen bg-background relative">
      {/* Particles background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          particleColor="hsl(var(--primary) / 0.1)"
          particleDensity={100}
          className="h-full w-full"
          minSize={0.6}
          maxSize={1.4}
        />
      </div>

      <div className="flex flex-col h-screen relative z-10">
        <DashboardHeader currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages} />
        <main className="flex-1 overflow-auto p-6">{renderPage()}</main>
      </div>
    </div>
  )
}

