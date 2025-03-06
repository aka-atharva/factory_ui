from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
import os

router = APIRouter()

@router.get("/{full_path:path}", response_class=HTMLResponse)
async def serve_frontend(request: Request, full_path: str):
    # If the path is for a specific file with extension, try to serve it
    if "." in full_path:
        file_path = os.path.join("api/static", full_path)
        if os.path.exists(file_path):
            return FileResponse(file_path)
    
    # Otherwise, serve the index.html for client-side routing
    index_path = os.path.join("api/static", "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r") as f:
            content = f.read()
        return HTMLResponse(content=content)
    
    # If index.html doesn't exist, return a simple message
    return HTMLResponse(content="<html><body><h1>Frontend not built yet</h1><p>Please build the frontend and place it in the static directory.</p></body></html>")

