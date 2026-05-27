"""Generate a YoTrade blog cover image in v2 neon style.

Usage:
    python3 scripts/blog/gen_blog_cover.py SLUG "TITLE_LINE_1" "TITLE_LINE_2" "SUBTITLE"

Output:
    public/images/blog/{SLUG}-cover.png  (2560x1440, ~250-500 KB)

Style: black background + red/cyan fluid motion-blur blobs + heartbeat
waveform top-center + bold white title + red subtitle + gradient underline.
Matches the HK-bank blog series visual language.

Dependencies: Pillow >= 9.0. Install if missing: pip install pillow

The script auto-detects a CJK-capable font from common system locations
(macOS / Ubuntu / Debian). Override with env var BLOG_COVER_FONT.
"""

import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 2560, 1440
RED = (255, 50, 80)
CYAN = (32, 220, 210)
WHITE = (245, 245, 250)
BG = (6, 6, 10)

FONT_CANDIDATES = [
    os.environ.get("BLOG_COVER_FONT", ""),
    "/System/Library/Fonts/STHeiti Medium.ttc",          # macOS
    "/System/Library/Fonts/PingFang.ttc",                # macOS (newer)
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
    "/usr/share/fonts/truetype/arphic/uming.ttc",
]


def find_font():
    for p in FONT_CANDIDATES:
        if p and Path(p).exists():
            return p
    raise RuntimeError(
        "No CJK font found. Install fonts-noto-cjk or set BLOG_COVER_FONT env var."
    )


FONT = find_font()


def motion_blob(color, center, base_w, base_h, trail_len=900, steps=50):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cx, cy = center
    for i in range(steps):
        l = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(l)
        t = i / steps
        offset_x = t * trail_len
        w = base_w * (1 - t * 0.3)
        h = base_h * (1 + t * 0.15)
        alpha = int(220 * (1 - t) ** 1.2)
        d.ellipse(
            [cx + offset_x - w / 2, cy - h / 2,
             cx + offset_x + w / 2, cy + h / 2],
            fill=color + (alpha,),
        )
        layer = Image.alpha_composite(layer, l)
    glow = layer.filter(ImageFilter.GaussianBlur(85))
    crisp = layer.filter(ImageFilter.GaussianBlur(25))
    return Image.alpha_composite(glow, crisp)


def heartbeat(color, cx, cy, scale=1.6):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    seq = [(0, 0), (90, 0), (115, -8), (135, 8), (155, -130),
           (175, 150), (195, -80), (215, 0), (340, 0)]
    pts = [(cx + x * scale, cy + y * scale) for x, y in seq]
    for width, alpha, blur in [(36, 80, 18), (22, 130, 10), (12, 200, 4), (5, 255, 1)]:
        l = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(l)
        d.line(pts, fill=color + (alpha,), width=width)
        l = l.filter(ImageFilter.GaussianBlur(blur))
        overlay = Image.alpha_composite(overlay, l)
    return overlay


def gradient_underline(width=620, height=18):
    bar = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(bar)
    for x in range(width):
        t = x / width
        r = int(RED[0] * (1 - t) + CYAN[0] * t)
        g = int(RED[1] * (1 - t) + CYAN[1] * t)
        b = int(RED[2] * (1 - t) + CYAN[2] * t)
        d.line([(x, 0), (x, height)], fill=(r, g, b, 240))
    return bar


def render(slug, title1, title2, subtitle):
    img = Image.new("RGBA", (W, H), BG + (255,))

    # Fluid color blobs on the right side
    img = Image.alpha_composite(img, motion_blob(RED, (W * 0.62, H * 0.30), 280, 220))
    img = Image.alpha_composite(img, motion_blob(RED, (W * 0.58, H * 0.45), 220, 180, trail_len=1100))
    img = Image.alpha_composite(img, motion_blob(CYAN, (W * 0.66, H * 0.62), 260, 200, trail_len=950))
    img = Image.alpha_composite(img, motion_blob(CYAN, (W * 0.60, H * 0.78), 240, 170, trail_len=1000))

    # Heartbeat top center-right
    img = Image.alpha_composite(img, heartbeat(CYAN, W * 0.55, H * 0.18, 1.6))

    # Text
    draw = ImageDraw.Draw(img)
    title_font = ImageFont.truetype(FONT, 300)
    sub_font = ImageFont.truetype(FONT, 140)
    draw.text((140, 350), title1, font=title_font, fill=WHITE)
    draw.text((140, 680), title2, font=title_font, fill=WHITE)
    draw.text((140, 1080), subtitle, font=sub_font, fill=RED)

    ul = gradient_underline(width=620, height=18)
    img.paste(ul, (140, 1270), ul)

    out_dir = Path("public/images/blog")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{slug}-cover.png"
    img.convert("RGB").save(out_path, optimize=True)
    return out_path


def main():
    if len(sys.argv) != 5:
        print(__doc__, file=sys.stderr)
        sys.exit(1)
    slug, title1, title2, subtitle = sys.argv[1:5]
    out = render(slug, title1, title2, subtitle)
    print(f"OK  {out}")


if __name__ == "__main__":
    main()
