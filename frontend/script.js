document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');
    const previewDiv = document.getElementById('preview');
    const timestampDiv = document.getElementById('timestamp');
    resultDiv.textContent = '';
    previewDiv.innerHTML = '';
    timestampDiv.textContent = '';

    if (!fileInput.files.length) {
        resultDiv.textContent = 'Please select a file or use the camera.';
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    resultDiv.textContent = 'Processing...';

    try {
        const response = await fetch('/detect/', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            let html = `<strong>Emotion:</strong> ${data.emotion || '-'}<br>`;
            html += `<strong>Confidence:</strong> ${data.confidence !== undefined ? data.confidence + '%' : '-'}<br>`;
            if (data.caption) html += `<strong>Caption:</strong> ${data.caption}<br>`;
            if (data.imagePath) {
                html += `<strong>Image Preview:</strong><br>`;
                const img = document.createElement('img');
                img.src = data.imagePath.startsWith('http') ? data.imagePath : data.imagePath;
                img.alt = 'Detected Dog';
                img.style.maxWidth = '100%';
                previewDiv.innerHTML = '';
                previewDiv.appendChild(img);
            } else {
                previewDiv.innerHTML = '';
            }
            resultDiv.innerHTML = html;
            if (data.timestamp) {
                timestampDiv.textContent = `Timestamp: ${new Date(data.timestamp).toLocaleString()}`;
            }
        } else {
            resultDiv.textContent = data.error || 'Error occurred.';
            previewDiv.innerHTML = '';
        }
    } catch (err) {
        resultDiv.textContent = 'Failed to connect to backend.';
        previewDiv.innerHTML = '';
        console.error(err);
    }
});

// Webcam capture logic
const cameraBtn = document.getElementById('cameraBtn');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const snapBtn = document.getElementById('snapBtn');
const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('fileInput');
let stream = null;

cameraBtn.addEventListener('click', async function() {
    cameraContainer.style.display = 'flex';
    if (!stream) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            alert('Could not access camera.');
            cameraContainer.style.display = 'none';
        }
    }
});

snapBtn.addEventListener('click', function() {
    canvas.style.display = 'block';
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async function(blob) {
        // Stop the camera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        cameraContainer.style.display = 'none';
        // Send the captured image to backend
        const resultDiv = document.getElementById('result');
        const previewDiv = document.getElementById('preview');
        const timestampDiv = document.getElementById('timestamp');
        resultDiv.textContent = 'Processing...';
        previewDiv.innerHTML = '';
        timestampDiv.textContent = '';
        const formData = new FormData();
        formData.append('file', blob, 'capture.jpg');
        try {
            const response = await fetch('/detect/', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                let html = `<strong>Emotion:</strong> ${data.emotion || '-'}<br>`;
                html += `<strong>Confidence:</strong> ${data.confidence !== undefined ? data.confidence + '%' : '-'}<br>`;
                if (data.caption) html += `<strong>Caption:</strong> ${data.caption}<br>`;
                if (data.imagePath) {
                    html += `<strong>Image Preview:</strong><br>`;
                    const img = document.createElement('img');
                    img.src = data.imagePath.startsWith('http') ? data.imagePath : data.imagePath;
                    img.alt = 'Detected Dog';
                    img.style.maxWidth = '100%';
                    previewDiv.innerHTML = '';
                    previewDiv.appendChild(img);
                } else {
                    previewDiv.innerHTML = '';
                }
                resultDiv.innerHTML = html;
                if (data.timestamp) {
                    timestampDiv.textContent = `Timestamp: ${new Date(data.timestamp).toLocaleString()}`;
                }
            } else {
                resultDiv.textContent = data.error || 'Error occurred.';
                previewDiv.innerHTML = '';
            }
        } catch (err) {
            resultDiv.textContent = 'Failed to connect to backend.';
            previewDiv.innerHTML = '';
            console.error(err);
        }
    }, 'image/jpeg');
}); 