// API service for connecting to FastAPI backend

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export class ApiService {
  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.detail || `Error: ${response.status}`,
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("API request failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  static async post<T, U>(endpoint: string, body: T): Promise<ApiResponse<U>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.detail || `Error: ${response.status}`,
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("API request failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Factory-specific API methods
export const FactoryApi = {
  // Get factory metrics
  getFactoryMetrics: async () => {
    return ApiService.get<FactoryMetrics>("/api/factory/metrics")
  },

  // Get factory status
  getFactoryStatus: async () => {
    return ApiService.get<FactoryStatus[]>("/api/factory/status")
  },

  // Send message to Factory Bot
  sendBotMessage: async (message: string) => {
    return ApiService.post<{ message: string }, BotResponse>("/api/factory/bot/message", { message })
  },
}

// Type definitions for API responses
export interface FactoryMetrics {
  production: number
  efficiency: number
  downtime: number
  profitMargin: number
  timeSeriesData: {
    name: string
    production: number
    efficiency: number
    downtime: number
  }[]
}

export interface FactoryStatus {
  id: string
  name: string
  status: "operational" | "warning" | "down"
  efficiency: string
  lastMaintenance: string
}

export interface BotResponse {
  id: string
  content: string
  timestamp: string
}

