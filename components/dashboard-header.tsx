import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Bot, Factory, Home, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  currentPage: string
  setCurrentPage: (page: string) => void
  pages: {
    name: string
    icon: string
  }[]
}

export default function DashboardHeader({ currentPage, setCurrentPage, pages }: DashboardHeaderProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Home":
        return <Home className="h-5 w-5" />
      case "Factory":
        return <Factory className="h-5 w-5" />
      case "Bot":
        return <Bot className="h-5 w-5" />
      default:
        return <Home className="h-5 w-5" />
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center mr-6">
          <img src="/logo.svg" alt="Factory Logo" className="h-8 mr-2" />
          <span className="font-semibold text-lg">Factory AI</span>
        </div>

        <nav className="flex items-center space-x-1 lg:space-x-2">
          {pages.map((page) => (
            <Button
              key={page.name}
              variant={currentPage === page.name ? "default" : "ghost"}
              className={cn("h-9 px-2 lg:px-3", currentPage === page.name && "bg-primary text-primary-foreground")}
              onClick={() => setCurrentPage(page.name)}
            >
              {getIcon(page.icon)}
              <span className="hidden md:inline-block ml-2">{page.name}</span>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative w-60 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]" />
          </div>
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

