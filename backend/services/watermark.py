import io
from PIL import Image, ImageDraw, ImageFont


WATERMARK_TEXT = "ChobiClear.com"
WATERMARK_OPACITY = 100   # 0–255
WATERMARK_FONT_SIZE = 36
WATERMARK_STEP = 200      # pixel spacing between repeated watermark tiles


def apply_watermark(image_bytes: bytes) -> bytes:
    """
    Tile a semi-transparent diagonal watermark across the image.
    Works on RGBA images (transparent PNG output from rembg).
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    width, height = img.size

    # Create a transparent overlay layer
    overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)

    # Use a default font (Pillow built-in); swap for a TTF for better looks
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", WATERMARK_FONT_SIZE)
    except IOError:
        font = ImageFont.load_default()

    # Measure text size for tiling
    bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    # Tile watermark across image diagonally
    for y in range(-height, height * 2, WATERMARK_STEP):
        for x in range(-width, width * 2, WATERMARK_STEP):
            draw.text(
                (x, y),
                WATERMARK_TEXT,
                font=font,
                fill=(255, 255, 255, WATERMARK_OPACITY),
            )

    # Composite overlay onto the original image
    watermarked = Image.alpha_composite(img, overlay)

    buf = io.BytesIO()
    watermarked.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()


def resize_to_preview(image_bytes: bytes, max_dimension: int = 1200) -> bytes:
    """
    Resize the image to a lower resolution for the free-tier download.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    img.thumbnail((max_dimension, max_dimension), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()
