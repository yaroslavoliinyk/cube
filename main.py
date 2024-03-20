from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Assuming your static files are in a directory named 'static' in the same directory as main.py
app.mount("/static", StaticFiles(directory="static"), name="static")


# Model to hold cube dimensions
class CubeDimensions(BaseModel):
    width: float
    height: float
    length: float

# Default cube dimensions
cube_dimensions = CubeDimensions(width=1.0, height=1.0, length=1.0)

# CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/cube")
async def get_cube_dimensions():
    """Endpoint to get the current cube dimensions."""
    return cube_dimensions

@app.post("/cube")
async def update_cube_dimensions(dimensions: CubeDimensions):
    """Endpoint to update the cube dimensions."""
    global cube_dimensions
    cube_dimensions = dimensions
    return {"message": "Cube dimensions updated successfully"}

if __name__ == "__main__":
    import uvicorn
    # Change the port to 8001 to avoid conflict with the default port 8000
    uvicorn.run(app, host="0.0.0.0", port=8001)
