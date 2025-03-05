import { NextResponse } from "next/server"

export async function GET() {
  // Generate monthly data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const timeSeriesData = months.map((month) => ({
    name: month,
    production: Math.floor(Math.random() * 2000) + 2000, // Random production between 2000-4000
    efficiency: Math.floor(Math.random() * 30) + 60, // Random efficiency between 60-90%
    downtime: Math.floor(Math.random() * 5) + 1, // Random downtime between 1-6 hours
  }))

  // Calculate current metrics (using the latest month as an example)
  const latestData = timeSeriesData[timeSeriesData.length - 1]

  const metrics = {
    production: latestData.production,
    efficiency: latestData.efficiency,
    downtime: latestData.downtime,
    profitMargin: Math.floor(Math.random() * 15) + 15, // Random profit margin between 15-30%
    timeSeriesData: timeSeriesData,
  }

  return NextResponse.json(metrics)
}

