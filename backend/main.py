from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from detect_utils import detect_emotion_from_image, detect_emotion_from_video
import os
import shutil
from uuid import uuid4

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:8000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure temp directory exists
TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)

# Serve temp directory as static files
app.mount("/static", StaticFiles(directory=TEMP_DIR), name="static")

# Serve the frontend directory at /frontend (not /)
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
app.mount("/frontend", StaticFiles(directory=frontend_path, html=True), name="frontend")

@app.get("/")
def root():
    return RedirectResponse(url="/frontend")

@app.post("/detect/")
async def detect(request: Request, file: UploadFile = File(...)):
    try:
        file_ext = os.path.splitext(file.filename)[-1].lower()
        unique_filename = f"{uuid4().hex}{file_ext}"
        temp_path = os.path.join(TEMP_DIR, unique_filename)

        # Save the uploaded file
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        if file_ext in [".jpg", ".jpeg", ".png"]:
            result = detect_emotion_from_image(temp_path)
        elif file_ext in [".mp4", ".mov", ".avi"]:
            base_url = str(request.base_url).rstrip('/')
            result = detect_emotion_from_video(temp_path, base_url=base_url)
        else:
            return JSONResponse(content={"error": "Unsupported file type."}, status_code=400)

        # Optional: Clean up file after processing
        # Only delete the uploaded file, not the best frame image (frame_image_path)
        os.remove(temp_path)
        # Do NOT delete any frame image returned by detect_emotion_from_video

        return result

    except Exception as e:
        return JSONResponse(content={"error": f"Server error: {str(e)}"}, status_code=500)
