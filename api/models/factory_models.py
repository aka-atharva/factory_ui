from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union

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
    message: str

