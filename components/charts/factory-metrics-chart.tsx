"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChartData {
  name: string
  production: number
  efficiency: number
  downtime: number
}

interface FactoryMetricsChartProps {
  data: ChartData[]
}

export function FactoryMetricsChart({ data }: FactoryMetricsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs text-muted-foreground" />
        <YAxis yAxisId="left" className="text-xs text-muted-foreground" />
        <YAxis yAxisId="right" orientation="right" className="text-xs text-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
        />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="production" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
        <Line yAxisId="left" type="monotone" dataKey="efficiency" stroke="#10b981" />
        <Line yAxisId="right" type="monotone" dataKey="downtime" stroke="#f43f5e" />
      </LineChart>
    </ResponsiveContainer>
  )
}

