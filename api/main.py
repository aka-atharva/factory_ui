from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import threading
import asyncio

from api.routes.factory_routes import router as factory_router
from api.routes.bot_routes import router as bot_router
from api.routes.frontend_routes import router as frontend_router
from api.services.kg_rag_service import initialize_graph

# Create FastAPI app
app = FastAPI(title="Factory Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(factory_router, prefix="/api/factory", tags=["factory"])
app.include_router(bot_router, prefix="/api/factory", tags=["bot"])
app.include_router(frontend_router, tags=["frontend"])

# Mount static files
app.mount("/static", StaticFiles(directory="api/static"), name="static")

# Initialize the knowledge graph in a separate thread
thread = threading.Thread(target=initialize_graph, daemon=True)
thread.start()

if __name__ == "__main__":
    import uvicorn
    
    # Create static directory if it doesn't exist
    os.makedirs("api/static", exist_ok=True)
    
    uvicorn.run(app, host="0.0.0.0", port=8080)

