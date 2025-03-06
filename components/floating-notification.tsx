"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bell, X } from "lucide-react"
import { useState, useEffect } from "react"

interface FloatingNotificationProps {
  message: string
  delay?: number
  duration?: number
}

export function FloatingNotification({ message, delay = 2000, duration = 5000 }: FloatingNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show notification after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    // Hide notification after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, delay + duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [delay, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-20 right-4 z-50 max-w-sm"
        >
          <div className="bg-card border border-border shadow-lg rounded-lg p-4 flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm">{message}</p>
            </div>
            <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

