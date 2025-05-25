# 🐶 FurSpeak AI - Emotion Detection Backend

Welcome to the backend API of **FurSpeak AI**, an intelligent deep learning system that detects and interprets **dog emotions** from images and videos using a dual-stage YOLO pipeline. This FastAPI-powered service provides real-time predictions with confidence scores and friendly captions.

---

## 🎯 Features

- 🔍 **Two-stage Detection Pipeline**:
  - **Stage 1**: YOLOv8m (`yolov8m.pt`) to detect dogs (class 16).
  - **Stage 2**: Custom-trained YOLOv8 (`best.pt`) to classify dog emotions:  
    `['relax', 'happy', 'angry', 'frown', 'alert']`.

- 🧠 **Emotion Classes**:
  - `relax`, `happy`, `angry`, `frown`, `alert`

- 📸 **Supports image (`.jpg`, `.jpeg`, `.png`) and video (`.mp4`, `.mov`, `.avi`) inputs.**

- 💡 **Smart captions** based on detected emotions.

- 📈 **Timeline analysis** for videos, including emotion transitions and mood summaries.

- 🗂️ **Temporary media storage** and best-frame snapshot generation for videos.

---

## 🚀 Getting Started

### 🔧 Installation

1. Clone the repository:
   git clone [https://github.com/Abhijeet999-beep/FurSpeak-AI-backend.git]
   
3. Create a virtual environment (recommended):
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows

4. Install dependencies:
   pip install -r requirements.txt

5. Directory Structure:
   
├── app/
│   ├── detect_utils.py
│   └── models/
│       └── best.pt
├── temp/                     # Auto-created to store uploaded files and results
├── main.py                   # FastAPI app
├── requirements.txt
└── README.md

📦 Dependencies
Make sure the following Python packages are installed (via requirements.txt):

fastapi
uvicorn
python-multipart
opencv-python
ultralytics==8.1.0
torch>=1.13
numpy

🔗 Note: You must install a CUDA-enabled PyTorch version for GPU support (optional but recommended).

⚙️ Running the Backend
uvicorn main:app --reload

📤 API Endpoints
🔹 POST /detect/
Detect emotion from a dog image or video.

✅ Supported File Types:
Images: .jpg, .jpeg, .png
Videos: .mp4, .avi, .mov

🔁 Example Response (Image):
{
  "imagePath": "temp/saved_image.jpg",
  "emotion": "happy",
  "confidence": 92.3,
  "caption": "Your dog is happy and playful!",
  "processing_time": 0.0,
  "timestamp": "2025-05-25T15:30:00Z",
  "video_info": null
}

🔁 Example Response (Video):
{
  "emotion": "relax",
  "confidence": 84.17,
  "caption": "Your dog started out happy and ended up relaxed. Watch for changes in their mood!",
  "timeline": [...],
  "timeline_summary": "Started: happy, Ended: relax, Transitions: happy→relax",
  "frame_sampled": 17,
  "processing_time": 0.0,
  "timestamp": "2025-05-25T15:30:00Z",
  "frame_image_path": "temp/best_frame_abc123.jpg",
  "frame_image_url": "http://127.0.0.1:8000/static/best_frame_abc123.jpg"
}

🛠️ Developer Notes
    1. Device fallback is handled: CUDA → CPU.
    2. Majority voting across frames ensures stable predictions for videos.
    3. File cleanup is automated for temporary uploads.
    4. Timeline transitions help interpret behavioral shifts.

🤝 Credits:

Dataset annotation via Roboflow
YOLOv8 models by Ultralytics

Developed with ❤️ by Abhijeet Singh
