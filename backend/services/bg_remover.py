import io
from rembg import remove
from PIL import Image


def remove_background(image_bytes: bytes) -> bytes:
    """
    Remove the background from image bytes using rembg (U²-Net).
    Returns the processed image as PNG bytes with transparent background.
    """
    # rembg handles the model download on first run
    output_bytes = remove(image_bytes)

    # Ensure the result is a valid RGBA PNG
    img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()
