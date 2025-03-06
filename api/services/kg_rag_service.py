import asyncio
from api.kg_rag import kg_rag

async def init_graph():
    await kg_rag.init_graph()

def initialize_graph():
    asyncio.run(init_graph())

def get_bot_response(message: str) -> str:
    return kg_rag.get_kg_answer(message)

