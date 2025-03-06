"use client"

import type React from "react"

import { CardDescription } from "@/components/ui/card"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Factory, Percent, User, BarChart } from "lucide-react"
import { useContext, useState, useEffect } from "react"
import { createContext } from "react"
import { motion } from "framer-motion"
import { FloatingNotification } from "@/components/floating-notification"

export const DashboardContext = createContext<{
  setCurrentPage: (page: string) => void
}>({
  setCurrentPage: () => {},
})

export default function HomePage() {
  const { setCurrentPage } = useContext(DashboardContext)
  const [isLogoAnimating, setIsLogoAnimating] = useState(false)

  const handleLogoClick = () => {
    setIsLogoAnimating(true)
    // Reset animation state after animation completes
    setTimeout(() => setIsLogoAnimating(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
        <div className="relative">
          <motion.div
            className="absolute -inset-8 bg-primary/20 rounded-full blur-xl"
            animate={
              isLogoAnimating
                ? {
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }
                : {}
            }
            transition={{ duration: 1 }}
          />
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 5,
              filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))",
              transition: { duration: 0.3 },
            }}
            whileTap={{
              scale: 0.95,
              rotate: -5,
              transition: { duration: 0.1 },
            }}
            animate={
              isLogoAnimating
                ? {
                    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 1 }}
            onClick={handleLogoClick}
            className="cursor-pointer relative"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
            />
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/no_bg_logo-tyzHwceQVZew8Pk4arc0oDHAIwayvr.png"
              alt="RSW Logo"
              className="h-32 w-auto relative z-10"
              draggable="false"
            />
          </motion.div>
        </div>
        <motion.h1
          className="text-3xl md:text-5xl font-bold tracking-tight"
          animate={
            isLogoAnimating
              ? {
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{ duration: 1, delay: 0.1 }}
        >
          Welcome to <span className="text-primary">Foam Factory</span>
        </motion.h1>
        <p className="text-muted-foreground max-w-[600px] text-lg">
          Monitor your Foam Factory performance and interact with our AI assistant to optimize production.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatsCounter label="Production Lines" value={8} icon={<Factory className="h-5 w-5 text-primary" />} />
        <StatsCounter
          label="Efficiency Rate"
          value={92}
          suffix="%"
          icon={<Percent className="h-5 w-5 text-primary" />}
        />
        <StatsCounter label="Active Workers" value={124} icon={<User className="h-5 w-5 text-primary" />} />
        <StatsCounter label="Daily Output" value={1450} icon={<BarChart className="h-5 w-5 text-primary" />} />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 mt-10">
        <motion.div
          whileHover={{
            scale: 1.03,
            y: -5,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className="backdrop-blur-sm bg-background/80 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
            onClick={() => setCurrentPage("Factory Dashboard")}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4 }}
            />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5 text-primary" />
                Factory Dashboard
              </CardTitle>
              <CardDescription>View real-time metrics and KPIs</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center relative z-10">
              <p className="text-sm text-muted-foreground">
                Monitor production rates, efficiency, and resource utilization.
              </p>
              <motion.div
                whileHover={{
                  scale: 1.2,
                  rotate: 45,
                  transition: { duration: 0.2 },
                }}
              >
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary hover:bg-primary/10">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.03,
            y: -5,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className="backdrop-blur-sm bg-background/80 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
            onClick={() => setCurrentPage("Factory Bot")}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4 }}
            />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Factory Bot
              </CardTitle>
              <CardDescription>AI-powered assistant</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center relative z-10">
              <p className="text-sm text-muted-foreground">
                Get answers to your questions about factory operations and insights.
              </p>
              <motion.div
                whileHover={{
                  scale: 1.2,
                  rotate: 45,
                  transition: { duration: 0.2 },
                }}
              >
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary hover:bg-primary/10">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0.9 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.2 },
        }}
      >
        <Card className="p-6 backdrop-blur-sm bg-primary/5 border-primary/20 mt-10 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 8,
              ease: "linear",
            }}
          />
          <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-2">Need assistance?</h3>
              <p className="text-muted-foreground">
                Our AI-powered Factory Bot can answer questions and provide insights about your factory operations.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setCurrentPage("Factory Bot")}>
                Open Factory Bot
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
      <FloatingNotification message="Production Line 3 efficiency has increased by 5% today!" delay={3000} />

      <FloatingNotification message="New maintenance schedule has been updated." delay={8000} />
    </div>
  )
}

// Add this interface above the StatsCounter function
interface StatsCounterProps {
  label: string
  value: number
  suffix?: string
  icon: React.ReactNode
}

function StatsCounter({ label, value, suffix = "", icon }: StatsCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepTime = duration / steps
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/20"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(139, 92, 246, 0.5)", // primary color with 0.5 opacity
      }}
    >
      <motion.div
        className="mb-2 text-primary"
        whileHover={{
          rotate: [0, 15, -15, 0],
          transition: { duration: 0.5 },
        }}
      >
        {icon}
      </motion.div>
      <motion.div
        className="text-2xl font-bold"
        key={count}
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        {count}
        {suffix}
      </motion.div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  )
}

