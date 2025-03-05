import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simple response logic - in a real app, this would connect to an AI service
    let botResponse = "I'm sorry, I don't understand that question about the factory."

    // Simple keyword matching
    if (message.toLowerCase().includes("production")) {
      botResponse = "Production is currently at 1,245 units, which is 12% higher than last month."
    } else if (message.toLowerCase().includes("efficiency")) {
      botResponse = "The current efficiency rate is 89.2%, which is 4.3% higher than last month."
    } else if (message.toLowerCase().includes("downtime")) {
      botResponse = "Current downtime is 3.2 hours, which is slightly higher than our target."
    } else if (message.toLowerCase().includes("profit")) {
      botResponse = "The profit margin is currently at 24.5%, which is 2.1% higher than last month."
    } else if (message.toLowerCase().includes("help")) {
      botResponse =
        "You can ask me about production rates, efficiency, downtime, or profit margins. I can also help you understand factory status and metrics."
    }

    return NextResponse.json({
      message: botResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing bot message:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}

