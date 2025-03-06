// Define the time series data point structure
export interface TimeSeriesDataPoint {
  name: string
  production: number
  efficiency: number
  downtime: number
  [key: string]: string | number // Add index signature for dynamic property access
}

export interface FactoryMetrics {
  production: number
  efficiency: number
  downtime: number
  profitMargin: number
  timeSeriesData: TimeSeriesDataPoint[]
}

export interface FactoryStatus {
  id: string
  name: string
  status: "operational" | "maintenance" | "offline"
  lastUpdated: string
  efficiency: number
  lastMaintenance: string // Add the missing property
}

// Add interface for bot message response
export interface BotResponse {
  message: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export const FactoryApi = {
  getFactoryMetrics: async (): Promise<ApiResponse<FactoryMetrics>> => {
    try {
      const response = await fetch("/api/factory/metrics")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Error fetching factory metrics:", error)
      return { success: false, error: "Failed to fetch factory metrics" }
    }
  },

  getFactoryStatus: async (): Promise<ApiResponse<FactoryStatus[]>> => {
    try {
      const response = await fetch("/api/factory/status")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Error fetching factory status:", error)
      return { success: false, error: "Failed to fetch factory status" }
    }
  },

  sendBotMessage: async (message: string): Promise<ApiResponse<BotResponse>> => {
    try {
      const response = await fetch("/api/factory/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Error sending message to bot:", error)
      return { success: false, error: "Failed to communicate with the factory bot" }
    }
  },
}

