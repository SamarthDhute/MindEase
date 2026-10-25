"""Generate high-resolution PWA icon assets for MindEase using Pillow."""

import math
from pathlib import Path
from PIL import Image, ImageDraw

PUBLIC_DIR = Path(__file__).parent / "frontend" / "public"
PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

def create_mindease_icon(size: int, is_maskable: bool = False) -> Image.Image:
    # 4x supersampling for ultra-crisp antialiasing
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx = canvas_size / 2.0
    cy = canvas_size / 2.0

    if is_maskable:
        # Maskable icons must have a full solid background that extends to all edges
        # Biophilic deep forest green: #1c3829
        draw.rectangle([0, 0, canvas_size, canvas_size], fill=(28, 56, 41, 255))
        # Android safe area is inner 80% (radius = 0.4 * canvas_size)
        base_radius = canvas_size * 0.36
    else:
        # Standard icon: circular badge with soothing organic forest green gradient
        base_radius = canvas_size * 0.46
        # Draw circular background
        draw.ellipse(
            [cx - base_radius, cy - base_radius, cx + base_radius, cy + base_radius],
            fill=(45, 90, 63, 255),  # #2d5a3f
        )
        # Subtle lighter ring
        inner_ring = base_radius * 0.96
        draw.ellipse(
            [cx - inner_ring, cy - inner_ring, cx + inner_ring, cy + inner_ring],
            fill=(54, 107, 75, 255), # #366b4b
        )

    # Leaf emblem geometry (scaled to base_radius)
    leaf_w = base_radius * 0.70
    leaf_h = base_radius * 1.10

    # Draw two intersecting smooth arcs for leaf body
    leaf_points = []
    steps = 60

    # Left curve of leaf (tip at top to stem at bottom)
    for i in range(steps + 1):
        t = i / steps
        # x from 0 to -leaf_w then to 0
        x = cx - math.sin(t * math.pi) * leaf_w * (1.1 - 0.3 * t)
        y = (cy - leaf_h * 0.5) + t * leaf_h
        leaf_points.append((x, y))

    # Right curve of leaf (stem at bottom back to tip at top)
    for i in range(steps + 1):
        t = 1.0 - (i / steps)
        x = cx + math.sin(t * math.pi) * leaf_w * (1.1 - 0.3 * t)
        y = (cy - leaf_h * 0.5) + t * leaf_h
        leaf_points.append((x, y))

    # Fill leaf with soft spring green (#a3d9a5)
    draw.polygon(leaf_points, fill=(163, 217, 165, 255))

    # Inner leaf highlight / contour (right half slightly lighter #c2e8c4)
    right_half_points = [(cx, cy - leaf_h * 0.5)]
    for i in range(steps + 1):
        t = (i / steps)
        x = cx + math.sin(t * math.pi) * leaf_w * (1.1 - 0.3 * t)
        y = (cy - leaf_h * 0.5) + t * leaf_h
        right_half_points.append((x, y))
    right_half_points.append((cx, cy + leaf_h * 0.5))
    draw.polygon(right_half_points, fill=(194, 232, 196, 255))

    # Center vein / stem
    vein_points = [
        (cx, cy - leaf_h * 0.42),
        (cx, cy + leaf_h * 0.52),
    ]
    draw.line(vein_points, fill=(245, 255, 246, 220), width=int(scale * (size / 45)))

    # Secondary side veins
    for dy, angle, side in [(-0.15, 0.4, -1), (0.05, 0.4, 1), (0.2, 0.35, -1)]:
        vy = cy + leaf_h * dy
        vx = cx
        vx_end = cx + side * (leaf_w * 0.45)
        vy_end = vy - (leaf_h * 0.12)
        draw.line([(vx, vy), (vx_end, vy_end)], fill=(245, 255, 246, 170), width=int(scale * (size / 70)))

    # Downsample using high-quality LANCZOS filter
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

def main():
    icons = [
        ("pwa-192x192.png", 192, False),
        ("pwa-512x512.png", 512, False),
        ("pwa-maskable-512x512.png", 512, True),
        ("apple-touch-icon.png", 180, False),
        ("favicon-32x32.png", 32, False),
    ]

    for filename, size, maskable in icons:
        out_path = PUBLIC_DIR / filename
        icon = create_mindease_icon(size, is_maskable=maskable)
        icon.save(out_path, format="PNG", optimize=True)
        print(f"Generated {filename} ({size}x{size}, maskable={maskable}) -> {out_path}")

if __name__ == "__main__":
    main()
