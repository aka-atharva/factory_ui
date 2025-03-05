import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate monthly data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const timeSeriesData = months.map((month) => ({
    name: month,
    production: Math.floor(Math.random() * 2000) + 2000, // Random production between 2000-4000
    efficiency: Math.floor(Math.random() * 30) + 60, // Random efficiency between 60-90%
    downtime: Math.floor(Math.random() * 5) + 1, // Random downtime between 1-6 hours
  }))

  res.status(200).json(timeSeriesData)
}

