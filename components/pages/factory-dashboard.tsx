"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, Factory, LineChart, Percent, TrendingUp, RefreshCw } from "lucide-react"
import { FactoryMetricsChart } from "@/components/charts/factory-metrics-chart"
import { FactoryStatusTable } from "@/components/tables/factory-status-table"
import { FactoryApi, type FactoryMetrics, type FactoryStatus, type TimeSeriesDataPoint } from "@/lib/api-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { motion } from "framer-motion"


type TimeFilter = "monthly" | "yearly"

// Monthly data for development
const monthlyData: TimeSeriesDataPoint[] = [
  { name: "January", production: 4200, efficiency: 82, downtime: 12 },
  { name: "February", production: 3800, efficiency: 78, downtime: 15 },
  { name: "March", production: 5100, efficiency: 85, downtime: 8 },
  { name: "April", production: 4700, efficiency: 80, downtime: 10 },
  { name: "May", production: 5300, efficiency: 87, downtime: 7 },
  { name: "June", production: 4900, efficiency: 83, downtime: 9 },
  { name: "July", production: 5200, efficiency: 86, downtime: 6 },
  { name: "August", production: 5000, efficiency: 84, downtime: 8 },
  { name: "September", production: 5400, efficiency: 88, downtime: 5 },
  { name: "October", production: 5600, efficiency: 89, downtime: 4 },
  { name: "November", production: 5200, efficiency: 85, downtime: 7 },
  { name: "December", production: 4800, efficiency: 81, downtime: 11 },
]

// Yearly data for development
const yearlyData: TimeSeriesDataPoint[] = [
  { name: "2018", production: 48000, efficiency: 79, downtime: 120 },
  { name: "2019", production: 52000, efficiency: 82, downtime: 105 },
  { name: "2020", production: 49000, efficiency: 80, downtime: 115 },
  { name: "2021", production: 55000, efficiency: 84, downtime: 95 },
  { name: "2022", production: 59000, efficiency: 86, downtime: 85 },
  { name: "2023", production: 62000, efficiency: 88, downtime: 75 },
]

// Fallback data for development
const fallbackMetrics: FactoryMetrics = {
  production: 1245,
  efficiency: 89.2,
  downtime: 3.2,
  profitMargin: 24.5,
  timeSeriesData: monthlyData,
}

export default function FactoryDashboard() {
  const [metrics, setMetrics] = useState<FactoryMetrics | null>(null)
  const [status, setStatus] = useState<FactoryStatus[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly")
  const [animatedProduction, setAnimatedProduction] = useState(0)
  const [animatedEfficiency, setAnimatedEfficiency] = useState(0)
  const [animatedDowntime, setAnimatedDowntime] = useState(0)
  const [animatedProfitMargin, setAnimatedProfitMargin] = useState(0)
  const prevMetricsRef = useRef<FactoryMetrics | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch metrics
      const metricsResponse = await FactoryApi.getFactoryMetrics()
      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data)
      } else {
        setError(metricsResponse.error || "Failed to fetch metrics")
      }

      // Fetch status
      const statusResponse = await FactoryApi.getFactoryStatus()
      if (statusResponse.success && statusResponse.data) {
        setStatus(statusResponse.data)
      } else {
        setError(statusResponse.error || "Failed to fetch status")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const displayMetrics = metrics || fallbackMetrics

  useEffect(() => {
    // Only animate if we have metrics and they've changed or just loaded
    if (displayMetrics && (!prevMetricsRef.current || loading === false)) {
      // Store current metrics for comparison on next update
      prevMetricsRef.current = displayMetrics

      // Reset animation values if loading
      if (loading) {
        setAnimatedProduction(0)
        setAnimatedEfficiency(0)
        setAnimatedDowntime(0)
        setAnimatedProfitMargin(0)
        return
      }

      // Animate production
      let startProduction = 0
      const productionIncrement = displayMetrics.production / 60
      const productionTimer = setInterval(() => {
        startProduction += productionIncrement
        if (startProduction >= displayMetrics.production) {
          setAnimatedProduction(displayMetrics.production)
          clearInterval(productionTimer)
        } else {
          setAnimatedProduction(Math.floor(startProduction))
        }
      }, 16)

      // Animate efficiency
      let startEfficiency = 0
      const efficiencyIncrement = displayMetrics.efficiency / 60
      const efficiencyTimer = setInterval(() => {
        startEfficiency += efficiencyIncrement
        if (startEfficiency >= displayMetrics.efficiency) {
          setAnimatedEfficiency(displayMetrics.efficiency)
          clearInterval(efficiencyTimer)
        } else {
          setAnimatedEfficiency(startEfficiency)
        }
      }, 16)

      // Animate downtime
      let startDowntime = 0
      const downtimeIncrement = displayMetrics.downtime / 60
      const downtimeTimer = setInterval(() => {
        startDowntime += downtimeIncrement
        if (startDowntime >= displayMetrics.downtime) {
          setAnimatedDowntime(displayMetrics.downtime)
          clearInterval(downtimeTimer)
        } else {
          setAnimatedDowntime(startDowntime)
        }
      }, 16)

      // Animate profit margin
      let startProfitMargin = 0
      const profitMarginIncrement = displayMetrics.profitMargin / 60
      const profitMarginTimer = setInterval(() => {
        startProfitMargin += profitMarginIncrement
        if (startProfitMargin >= displayMetrics.profitMargin) {
          setAnimatedProfitMargin(displayMetrics.profitMargin)
          clearInterval(profitMarginTimer)
        } else {
          setAnimatedProfitMargin(startProfitMargin)
        }
      }, 16)

      // Clean up timers
      return () => {
        clearInterval(productionTimer)
        clearInterval(efficiencyTimer)
        clearInterval(downtimeTimer)
        clearInterval(profitMarginTimer)
      }
    }
  }, [displayMetrics, loading])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // Get data based on the selected time filter
  const getFilteredData = (dataKey: string): TimeSeriesDataPoint[] => {
    if (timeFilter === "yearly") {
      return yearlyData
    } else {
      return monthlyData
    }
  }

  // Create a compatible status array with the missing lastMaintenance field
  const compatibleStatus = status
    ? status.map((item) => ({
        ...item,
        lastMaintenance: item.lastMaintenance || new Date().toISOString(), // Provide a default value
      }))
    : []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factory Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading || refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 },
          }}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Production Rate</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{Math.round(animatedProduction)} units</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      12%
                    </span>{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 },
          }}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{animatedEfficiency.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={`${displayMetrics.efficiency > 55 ? "text-green-500" : "text-amber-500"} inline-flex items-center`}
                    >
                      <ArrowUp className="mr-1 h-3 w-3" />
                      4.3%
                    </span>{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 },
          }}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downtime</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{animatedDowntime.toFixed(1)} hours</div>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={`${displayMetrics.downtime < 5 ? "text-green-500" : "text-red-500"} inline-flex items-center`}
                    >
                      <ArrowUp className="mr-1 h-3 w-3" />
                      0.8 hours
                    </span>{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 },
          }}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{animatedProfitMargin.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      2.1%
                    </span>{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="production" className="space-y-4">
        <TabsList>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="downtime">Downtime</TabsTrigger>
          <TabsTrigger value="status">Machine Status</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Production Data</CardTitle>
                <CardDescription>
                  {timeFilter === "monthly" ? "Monthly production volume" : "Yearly production volume"}
                </CardDescription>
              </div>
              <ToggleGroup
                type="single"
                value={timeFilter}
                onValueChange={(value) => value && setTimeFilter(value as TimeFilter)}
              >
                <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <div className="h-[350px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <FactoryMetricsChart
                  data={getFilteredData("production")}
                  dataKey="production"
                  color="#8884d8"
                  yAxisLabel="Units"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Efficiency Data</CardTitle>
                <CardDescription>
                  {timeFilter === "monthly" ? "Monthly efficiency percentage" : "Yearly efficiency percentage"}
                </CardDescription>
              </div>
              <ToggleGroup
                type="single"
                value={timeFilter}
                onValueChange={(value) => value && setTimeFilter(value as TimeFilter)}
              >
                <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <div className="h-[350px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <FactoryMetricsChart
                  data={getFilteredData("efficiency")}
                  dataKey="efficiency"
                  color="#82ca9d"
                  yAxisLabel="%"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downtime" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Downtime Data</CardTitle>
                <CardDescription>
                  {timeFilter === "monthly" ? "Monthly downtime hours" : "Yearly downtime hours"}
                </CardDescription>
              </div>
              <ToggleGroup
                type="single"
                value={timeFilter}
                onValueChange={(value) => value && setTimeFilter(value as TimeFilter)}
              >
                <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <div className="h-[350px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <FactoryMetricsChart
                  data={getFilteredData("downtime")}
                  dataKey="downtime"
                  color="#ff8042"
                  yAxisLabel="Hours"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Factory Status</CardTitle>
              <CardDescription>Current status of production lines</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <FactoryStatusTable data={compatibleStatus as unknown as FactoryStatus[]} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

