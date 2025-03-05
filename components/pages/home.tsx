import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Factory } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl"></div>
          <Factory className="h-16 w-16 text-primary relative" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Welcome to <span className="text-primary">Factory AI</span>
        </h1>
        <p className="text-muted-foreground max-w-[600px] text-lg">
          Monitor your factory performance and interact with our AI assistant to optimize production.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-10">
        <Card className="backdrop-blur-sm bg-background/80 border-primary/20 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Factory Dashboard
            </CardTitle>
            <CardDescription>View real-time metrics and KPIs</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Monitor production rates, efficiency, and resource utilization.
            </p>
            <Button variant="ghost" size="icon" className="text-primary hover:text-primary hover:bg-primary/10">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/80 border-primary/20 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Factory Bot
            </CardTitle>
            <CardDescription>AI-powered assistant</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Get answers to your questions about factory operations and insights.
            </p>
            <Button variant="ghost" size="icon" className="text-primary hover:text-primary hover:bg-primary/10">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6 backdrop-blur-sm bg-primary/5 border-primary/20 mt-10">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-2">Need assistance?</h3>
            <p className="text-muted-foreground">
              Our AI-powered Factory Bot can answer questions and provide insights about your factory operations.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            Open Factory Bot
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

