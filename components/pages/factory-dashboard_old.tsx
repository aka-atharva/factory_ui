"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, Factory, LineChart, Percent, TrendingUp } from "lucide-react"
import { FactoryMetricsChart } from "@/components/charts/factory-metrics-chart"
import { FactoryStatusTable } from "@/components/tables/factory-status-table"
import { FactoryApi, type FactoryMetrics, type FactoryStatus } from "@/lib/api-service-old"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function FactoryDashboard() {
  const [metrics, setMetrics] = useState<FactoryMetrics | null>(null)
  const [status, setStatus] = useState<FactoryStatus[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
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
      }
    }

    fetchData()
  }, [])

  // Fallback data for development
  const fallbackMetrics = {
    production: 1245,
    efficiency: 89.2,
    downtime: 3.2,
    profitMargin: 24.5,
    timeSeriesData: [
      { name: "Day 1", production: 4000, efficiency: 80, downtime: 2 },
      { name: "Day 5", production: 3000, efficiency: 75, downtime: 3 },
      { name: "Day 10", production: 2000, efficiency: 70, downtime: 4 },
      { name: "Day 15", production: 2780, efficiency: 78, downtime: 2.5 },
      { name: "Day 20", production: 1890, efficiency: 65, downtime: 5 },
      { name: "Day 25", production: 2390, efficiency: 72, downtime: 3.5 },
      { name: "Day 30", production: 3490, efficiency: 85, downtime: 1.5 },
    ],
  }

  // Use actual data or fallback
  const displayMetrics = metrics || fallbackMetrics

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Rate</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{displayMetrics.production} units</div>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{displayMetrics.efficiency}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    4.3%
                  </span>{" "}
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downtime</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{displayMetrics.downtime} hours</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 inline-flex items-center">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    0.8 hours
                  </span>{" "}
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{displayMetrics.profitMargin}%</div>
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
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Factory Performance</CardTitle>
                <CardDescription>Production metrics over the last 30 days</CardDescription>
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
                  <FactoryMetricsChart data={displayMetrics.timeSeriesData} />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
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
                  <FactoryStatusTable data={status} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed analysis of factory performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Advanced analytics content will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generated reports and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Reports content will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

