import os
import shutil
from uuid import uuid4
from fastapi import Request, UploadFile
from fastapi.responses import JSONResponse

# Assuming TEMP_DIR and detect_emotion_from_image/video are defined elsewhere

async def upload_file(request: Request, file: UploadFile):
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

        # Optional: Clean up the uploaded file (not any output files like best frame images)
        os.remove(temp_path)

        return result

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
