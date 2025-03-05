import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Update the mock data to use numbers for efficiency
const mockData = [
  {
    id: "1",
    name: "Production Line 1",
    status: "operational",
    efficiency: 92, // Changed from "92%" to 92
    lastMaintenance: "3 days ago",
  },
  {
    id: "2",
    name: "Production Line 2",
    status: "maintenance",
    efficiency: 0, // Changed from "0%" to 0
    lastMaintenance: "In progress",
  },
  {
    id: "3",
    name: "Production Line 3",
    status: "operational",
    efficiency: 87, // Changed from "87%" to 87
    lastMaintenance: "1 week ago",
  },
  {
    id: "4",
    name: "Assembly Line A",
    status: "operational",
    efficiency: 95, // Changed from "95%" to 95
    lastMaintenance: "2 days ago",
  },
  {
    id: "5",
    name: "Assembly Line B",
    status: "offline",
    efficiency: 0, // Changed from "0%" to 0
    lastMaintenance: "Scheduled tomorrow",
  },
]

export function FactoryStatusTable({ data = mockData }) {
  // Use the provided data or fallback to mock data
  const displayData = data.length > 0 ? data : mockData

  // Function to get the appropriate badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Efficiency</TableHead>
          <TableHead>Last Maintenance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(item.status)}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{item.efficiency}%</TableCell>
            <TableCell>{item.lastMaintenance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

