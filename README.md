# 🐶 FurSpeak AI - Emotion Detection Backend

Welcome to the backend of **FurSpeak AI**, a smart deep learning system that detects and interprets **dog emotions** from images and videos using a dual-stage YOLOv8 pipeline. Built with FastAPI, this API provides real-time emotion classification with confidence scores, captions, and mood timelines.

---

## 🎯 Features

- 🧠 **Dual-stage Emotion Detection Pipeline**:
  - **Stage 1**: Detect dogs using YOLOv8m pretrained on COCO (`yolov8m.pt`).
  - **Stage 2**: Classify dog emotions using a custom YOLOv11 model (`best.pt`).

- 🎭 **Emotion Classes**:
  - `relax`, `happy`, `angry`, `frown`, `alert`

- 📸 Supports:
  - Images: `.jpg`, `.jpeg`, `.png`
  - Videos: `.mp4`, `.mov`, `.avi`

- 📝 Intelligent captions generated based on detected emotions.

- ⏱️ Timeline analysis for videos (with mood transitions).

- 🖼️ Best-frame snapshot generation for videos.

---

# 🚀 Getting Started

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhijeet999-beep/FurSpeak-AI-backend.git
   cd FurSpeak-AI-backend

2. **Create a virtual environment**
    ```bash 
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

3. **Install dependencies**
    ```bash
    pip install -r requirements.txt

## 📂 Project Structure

```
FurSpeak-AI-backend/
├── app/
│   ├── detect_utils.py           # Core logic for image/video processing
│   └── models/
│       └── best.pt               # Custom YOLOv8 model for emotion classification
├── temp/                         # Auto-created to store uploads, frames, and results
├── main.py                       # FastAPI application entry point
├── requirements.txt              # Python dependencies
└── README.md                     # Project documentation
```

## 🔗 API Endpoint
### 📍 POST /detect/

  - Accepts: Image or Video file
  - Returns: Emotion, confidence, caption, timestamp, and (for videos) timeline summary

### ✅ Supported File Types
  - .jpg, .jpeg, .png, 
  - .mp4, .avi, .mov

## 📊 Sample Output

 ### 🖼️ Image Example
```
{
  "imagePath": "temp/saved_image.jpg",
  "emotion": "happy",
  "confidence": 92.3,
  "caption": "Your dog is happy and playful!",
  "processing_time": 0.6,
  "timestamp": "2025-05-25T15:30:00Z",
  "video_info": null
}
```
### 🎥 Video Example
```
{
  "emotion": "relax",
  "confidence": 84.17,
  "caption": "Your dog started out happy and ended up relaxed. Watch for changes in their mood!",
  "timeline": [...],
  "timeline_summary": "Started: happy, Ended: relax, Transitions: happy→relax",
  "frame_sampled": 17,
  "processing_time": 7.4,
  "timestamp": "2025-05-25T15:30:00Z",
  "frame_image_path": "temp/best_frame_abc123.jpg",
  "frame_image_url": "http://127.0.0.1:8000/static/best_frame_abc123.jpg"
}

```
## 🐾 Emotion Glossary
```
| Emotion      | Description                   |
| ------------ | ----------------------------- |
| 🛋️ `relax`  | Dog is calm and content       |
| 😄 `happy`  | Dog is joyful and playful     |
| 😠 `angry`  | Dog is upset or irritated     |
| 🙁 `frown`  | Dog looks disappointed or low |
| 🧐 `alert`  | Dog is focused or on guard    |

```
## 🧠 Developer Notes
- ✅ CUDA → CPU fallback
- ✅ Majority voting stabilizes video predictions.
- ✅ Temporary files auto-cleaned after processing.
- ✅ Timeline tracking shows emotion transitions.
