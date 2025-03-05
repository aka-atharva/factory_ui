"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import type { TimeSeriesDataPoint } from "@/lib/api-service"

interface FactoryMetricsChartProps {
  data: TimeSeriesDataPoint[]
  dataKey: string
  color?: string
  yAxisLabel?: string
}

export function FactoryMetricsChart({ data, dataKey, color = "#8884d8", yAxisLabel = "" }: FactoryMetricsChartProps) {
  // Custom tooltip formatter
  const customTooltipFormatter = (value: ValueType, name: NameType) => {
    if (typeof value === "number") {
      return [`${value.toFixed(1)}${yAxisLabel === "%" ? "%" : ""}`, name.toString()]
    }
    return [value, name]
  }

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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 20, right: 20 }} />
        <YAxis
          label={{
            value: yAxisLabel,
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip formatter={customTooltipFormatter} />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
          stroke={color}
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

