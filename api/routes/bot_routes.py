from fastapi import APIRouter, HTTPException
from api.models.factory_models import BotMessageRequest, BotResponse
from api.services.kg_rag_service import get_bot_response

router = APIRouter()

@router.post("/bot", response_model=BotResponse)
async def send_bot_message(request: BotMessageRequest):
    response_content = get_bot_response(request.message)
    
    return BotResponse(
        message=response_content['result']
    )

