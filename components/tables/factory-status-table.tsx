import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { FactoryStatus } from "@/lib/api-service-old"

interface FactoryStatusTableProps {
  data: FactoryStatus[] | null
}

// Fallback data for development
const fallbackData: FactoryStatus[] = [
  {
    id: "line-1",
    name: "Production Line 1",
    status: "operational",
    efficiency: "92%",
    lastMaintenance: "3 days ago",
  },
  {
    id: "line-2",
    name: "Production Line 2",
    status: "operational",
    efficiency: "88%",
    lastMaintenance: "1 week ago",
  },
  {
    id: "line-3",
    name: "Production Line 3",
    status: "warning",
    efficiency: "76%",
    lastMaintenance: "2 weeks ago",
  },
  {
    id: "line-4",
    name: "Production Line 4",
    status: "down",
    efficiency: "0%",
    lastMaintenance: "1 day ago",
  },
  {
    id: "line-5",
    name: "Production Line 5",
    status: "operational",
    efficiency: "95%",
    lastMaintenance: "5 days ago",
  },
]

export function FactoryStatusTable({ data }: FactoryStatusTableProps) {
  // Use actual data or fallback
  const factoryLines = data || fallbackData

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Line</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Efficiency</TableHead>
          <TableHead>Last Maintenance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {factoryLines.map((line) => (
          <TableRow key={line.id}>
            <TableCell className="font-medium">{line.name}</TableCell>
            <TableCell>
              <Badge
                variant={
                  line.status === "operational" ? "default" : line.status === "warning" ? "outline" : "destructive"
                }
                className={
                  line.status === "operational"
                    ? "bg-green-500/20 text-green-700 hover:bg-green-500/20 hover:text-green-700"
                    : line.status === "warning"
                      ? "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/20 hover:text-yellow-700"
                      : ""
                }
              >
                {line.status === "operational" ? "Operational" : line.status === "warning" ? "Warning" : "Down"}
              </Badge>
            </TableCell>
            <TableCell>{line.efficiency}</TableCell>
            <TableCell>{line.lastMaintenance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

