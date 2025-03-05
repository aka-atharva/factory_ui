from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union, Dict, Any
import random
import datetime
import uuid

app = FastAPI(title="Factory Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TimeSeriesData(BaseModel):
    name: str
    production: float
    efficiency: float
    downtime: float

class FactoryMetrics(BaseModel):
    production: float
    efficiency: float
    downtime: float
    profitMargin: float
    timeSeriesData: List[TimeSeriesData]

class FactoryStatus(BaseModel):
    id: str
    name: str
    status: str  # 'operational', 'warning', 'down'
    efficiency: str
    lastMaintenance: str

class BotMessageRequest(BaseModel):
    message: str

class BotResponse(BaseModel):
    id: str
    content: str
    timestamp: str

# Mock data
def generate_factory_metrics() -> FactoryMetrics:
    time_series = [
        TimeSeriesData(
            name=f"Day {i}",
            production=random.uniform(1500, 4500),
            efficiency=random.uniform(65, 95),
            downtime=random.uniform(0.5, 5)
        )
        for i in range(1, 31, 5)
    ]
    
    return FactoryMetrics(
        production=random.uniform(1000, 1500),
        efficiency=random.uniform(85, 95),
        downtime=random.uniform(2, 4),
        profitMargin=random.uniform(20, 30),
        timeSeriesData=time_series
    )

def generate_factory_status() -> List[FactoryStatus]:
    statuses = ["operational", "warning", "down"]
    weights = [0.7, 0.2, 0.1]  # Probability weights for each status
    
    return [
        FactoryStatus(
            id=f"line-{i}",
            name=f"Production Line {i}",
            status=random.choices(statuses, weights=weights)[0],
            efficiency=f"{random.randint(60, 98)}%" if i != 4 else "0%",
            lastMaintenance=f"{random.randint(1, 14)} days ago"
        )
        for i in range(1, 6)
    ]

# Bot responses
bot_responses = {
    "production": "Based on current data, production is running at 92% efficiency. There are no critical issues detected.",
    "maintenance": "The next scheduled maintenance is for Machine #3 in 48 hours. Would you like me to show the full maintenance schedule?",
    "performance": "Overall factory performance is up 8% compared to last month. The biggest improvement is in Line 2, which has reduced downtime by 15%.",
    "help": "I can help you with information about production status, maintenance schedules, performance metrics, and provide recommendations for optimization.",
    "default": "I'll need more specific information to help you with that. You can ask about production status, maintenance schedules, or performance metrics."
}

# API Routes
@app.get("/")
async def root():
    return {"message": "Factory Management API is running"}

@app.get("/api/factory/metrics", response_model=FactoryMetrics)
async def get_factory_metrics():
    return generate_factory_metrics()

@app.get("/api/factory/status", response_model=List[FactoryStatus])
async def get_factory_status():
    return generate_factory_status()

@app.post("/api/factory/bot/message", response_model=BotResponse)
async def send_bot_message(request: BotMessageRequest):
    message = request.message.lower()
    
    # Simple keyword matching
    response_content = bot_responses["default"]
    for keyword, response in bot_responses.items():
        if keyword in message:
            response_content = response
            break
    
    return BotResponse(
        id=str(uuid.uuid4()),
        content=response_content,
        timestamp=datetime.datetime.now().isoformat()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8080)

