# ─── Hugging Face Spaces — ChobiClear Backend ─────────────────────────────
# Port MUST be 7860 for HF Spaces
FROM python:3.11-slim

WORKDIR /app

# System deps needed by rembg / Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libsm6 libxrender1 libxext6 libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the U2-Net model so cold starts are instant on HF Spaces
RUN python -c "from rembg import new_session; new_session('u2net')"

# Copy application code
COPY . .

# Create temp directories
RUN mkdir -p uploads results

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
