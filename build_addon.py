#!/usr/bin/env python3
"""
Akuto Sai V4 — Reality Breaker: Minecraft Bedrock Addon Builder
Generates a complete, verified, standalone .mcaddon file.
Target version: Minecraft Bedrock 1.26.51.1
"""

import os
import json
import zlib
import struct
import zipfile
import shutil

# Fixed deterministic UUIDs to ensure stable linking between BP and RP
UUID_BP_HEADER = "d87a412b-7e61-4601-97a4-9b16ea9825b4"
UUID_BP_MODULE = "c4b12850-2591-4cf1-839e-21ef68d672ea"
UUID_RP_HEADER = "7f2e1a90-3844-4861-a08b-648de498f3c1"
UUID_RP_MODULE = "9e5c4681-7d12-4c6e-b3d9-5f212ec82d19"

ADDON_NAME = "Akuto Sai V4 — Reality Breaker"
MCADDON_FILENAME = "Akuto_Sai_V4_Reality_Breaker.mcaddon"

BASE_DIR = os.path.abspath("addon_build")
BP_DIR = os.path.join(BASE_DIR, "Akuto_Sai_V4_BP")
RP_DIR = os.path.join(BASE_DIR, "Akuto_Sai_V4_RP")


def write_png(filepath, width, height, pixel_func):
    """Encodes an RGBA image to a valid PNG file using standard zlib and struct."""
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # Filter type None
        for x in range(width):
            r, g, b, a = pixel_func(x, y)
            raw_data.extend((int(r) & 0xFF, int(g) & 0xFF, int(b) & 0xFF, int(a) & 0xFF))

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    png_bytes = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png_bytes += chunk(b'IHDR', ihdr)
    png_bytes += chunk(b'IDAT', zlib.compress(bytes(raw_data), 9))
    png_bytes += chunk(b'IEND', b'')

    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'wb') as f:
        f.write(png_bytes)
    print(f"Created PNG: {filepath} ({len(png_bytes)} bytes)")


def generate_akuto_texture():
    """Generates the 128x128 high-definition texture for Akuto Sai V4."""
    # UV mapping coordinates:
    # 0..32, 0..32 -> Head & Face
    # 32..64, 0..32 -> Hair layers
    # 0..64, 32..64 -> Torso / Jacket / Shirt / Red Tie
    # 64..96, 0..48 -> Arms & Hands & Crimson Cuffs
    # 0..48, 64..96 -> Legs & Combat Boots
    # 48..112, 64..112 -> Coat tails & Crimson Runes
    # 96..128, 0..64 -> Spikes & Accents

    # Palette
    C_VOID_BLACK = (10, 10, 15, 255)
    C_CHARCOAL_DARK = (18, 18, 24, 255)
    C_CHARCOAL_LIGHT = (28, 28, 38, 255)
    C_WHITE_SHIRT = (242, 242, 248, 255)
    C_SHIRT_SHADOW = (205, 205, 218, 255)
    C_CRIMSON_TIE = (185, 0, 42, 255)
    C_CRIMSON_TIE_DARK = (120, 0, 26, 255)
    C_CRIMSON_GLOW = (235, 15, 60, 255)
    C_PURPLE_VOID = (65, 12, 85, 255)
    C_SKIN_PALE = (244, 232, 222, 255)
    C_SKIN_SHADOW = (222, 204, 192, 255)
    C_EYE_CRIMSON = (230, 0, 48, 255)
    C_EYE_WHITE = (255, 255, 255, 255)
    C_EYE_PUPIL = (35, 0, 10, 255)
    C_HAIR_BLACK = (12, 12, 18, 255)
    C_HAIR_HIGHLIGHT = (34, 34, 52, 255)
    C_HAIR_PURPLE = (48, 20, 64, 255)
    C_GOLD_ACCENT = (212, 175, 55, 255)
    C_SILVER_BUCKLE = (190, 195, 205, 255)

    def sample_pixel(x, y):
        # 1. Head & Face area: (0..32, 0..32)
        if 0 <= x < 32 and 0 <= y < 32:
            # Front face is roughly x: 8..24, y: 8..24
            if 8 <= x < 24 and 8 <= y < 24:
                # Eyes
                # Left eye at (11, 14), (12, 14), (11, 15), (12, 15)
                if (x in (11, 12) and y == 14):
                    return C_EYE_CRIMSON
                if (x == 12 and y == 15):
                    return C_EYE_PUPIL
                if (x == 10 and y == 14):
                    return C_EYE_WHITE
                if (x in (10, 11, 12) and y == 13):
                    return C_VOID_BLACK  # sharp eyebrow

                # Right eye at (19, 14), (20, 14), (19, 15), (20, 15)
                if (x in (19, 20) and y == 14):
                    return C_EYE_CRIMSON
                if (x == 19 and y == 15):
                    return C_EYE_PUPIL
                if (x == 21 and y == 14):
                    return C_EYE_WHITE
                if (x in (19, 20, 21) and y == 13):
                    return C_VOID_BLACK  # sharp eyebrow

                # Nose & mouth
                if x == 15 and y == 17:
                    return C_SKIN_SHADOW
                if 14 <= x <= 16 and y == 20:
                    return (180, 120, 120, 255)

                # Shading
                if y > 21:
                    return C_SKIN_SHADOW
                return C_SKIN_PALE
            elif y < 8:
                # Hair top on head
                if (x + y) % 3 == 0:
                    return C_HAIR_HIGHLIGHT
                if (x * 3 + y) % 5 == 0:
                    return C_HAIR_PURPLE
                return C_HAIR_BLACK
            else:
                # Sides/back of head
                if y > 16:
                    return C_SKIN_PALE if x < 8 else C_HAIR_BLACK
                return C_HAIR_BLACK

        # 2. Spiky Hair extensions: (32..64, 0..32)
        if 32 <= x < 64 and 0 <= y < 32:
            if (x + y * 2) % 4 == 0:
                return C_HAIR_HIGHLIGHT
            if (x * 2 + y) % 7 == 0:
                return C_HAIR_PURPLE
            if y % 5 == 0:
                return C_PURPLE_VOID
            return C_HAIR_BLACK

        # 3. Torso / Jacket / Shirt / Tie: (0..64, 32..64)
        if 0 <= x < 64 and 32 <= y < 64:
            # Front torso at x: 16..36, y: 32..56
            if 16 <= x < 36 and 32 <= y < 56:
                # White dress shirt and collar in center (x: 23..29, y: 32..44)
                if 24 <= x <= 28 and 32 <= y <= 44:
                    # Dark red tie running down center (x: 25..27)
                    if 25 <= x <= 27 and 34 <= y <= 46:
                        if y == 34 or y == 35:
                            return C_CRIMSON_TIE_DARK  # Tie knot
                        if (y + x) % 2 == 0:
                            return C_CRIMSON_TIE
                        return C_CRIMSON_GLOW
                    return C_WHITE_SHIRT if y < 40 else C_SHIRT_SHADOW
                
                # Jacket lapels (x: 21..23, 29..31)
                if x in (22, 23, 29, 30) and 34 <= y <= 48:
                    return C_CHARCOAL_LIGHT
                # Crimson trim on coat opening
                if x in (21, 31) and 33 <= y <= 50:
                    return C_CRIMSON_GLOW
                # Golden / Silver buttons
                if x in (23, 29) and y in (42, 46, 50):
                    return C_GOLD_ACCENT
                # Belt & Crimson buckle at bottom (y: 52..55)
                if 52 <= y <= 55:
                    if 24 <= x <= 28:
                        return C_CRIMSON_TIE_DARK if y == 53 or y == 54 else C_SILVER_BUCKLE
                    return C_VOID_BLACK

                # Void coat fabric
                if (x + y) % 6 == 0:
                    return C_CHARCOAL_DARK
                return C_VOID_BLACK
            else:
                # Back and sides of jacket
                if y in (33, 34) and (x % 4 == 0):
                    return C_CRIMSON_GLOW
                return C_VOID_BLACK

        # 4. Arms, Hands & Cuffs: (64..96, 0..48)
        if 64 <= x < 96 and 0 <= y < 48:
            # Hands at y: 36..46
            if 36 <= y <= 46:
                # Tactical black glove on knuckles, pale skin on wrists
                if y > 40:
                    return C_CHARCOAL_DARK if (x + y) % 2 == 0 else C_VOID_BLACK
                return C_SKIN_PALE
            # Crimson Cuffs at y: 30..35
            if 30 <= y <= 35:
                if y in (32, 33):
                    return C_CRIMSON_GLOW
                return C_CRIMSON_TIE_DARK
            # Sleeves
            if (x * 2 + y) % 8 == 0:
                return C_PURPLE_VOID
            return C_VOID_BLACK

        # 5. Legs & Boots: (0..48, 64..96)
        if 0 <= x < 48 and 64 <= y < 96:
            # Boots at y: 84..96
            if 84 <= y <= 96:
                if y == 85:
                    return C_SILVER_BUCKLE
                if y == 95:
                    return C_CHARCOAL_LIGHT
                return C_VOID_BLACK
            # Dark school uniform pants
            if (x + y) % 5 == 0:
                return C_CHARCOAL_DARK
            return C_CHARCOAL_LIGHT

        # 6. Coat Tails & Crimson Rune Patterns: (48..112, 64..112)
        if 48 <= x < 112 and 64 <= y < 112:
            # Inner lining is rich crimson
            if x >= 80:
                if (x + y) % 4 == 0:
                    return C_CRIMSON_GLOW
                return C_CRIMSON_TIE_DARK
            # Outer coat tails: Jet black with glowing reality-breaker rune borders
            if x in (49, 50, 78, 79) or y in (110, 111):
                return C_CRIMSON_GLOW
            # Runic patterns
            if ((x - 48) ^ (y - 64)) % 9 == 0:
                return C_PURPLE_VOID
            return C_VOID_BLACK

        # 7. Remaining details & Spikes:
        if (x + y) % 3 == 0:
            return C_PURPLE_VOID
        elif (x + y) % 2 == 0:
            return C_CHARCOAL_DARK
        return C_VOID_BLACK

    tex_path = os.path.join(RP_DIR, "textures", "entity", "akuto_sai_v4.png")
    write_png(tex_path, 128, 128, sample_pixel)


def generate_spawn_egg_texture():
    """Generates the 16x16 custom spawn egg item texture (black & crimson)."""
    C_BLACK = (12, 12, 18, 255)
    C_DARK_RED = (140, 0, 30, 255)
    C_CRIMSON = (235, 20, 65, 255)
    C_PURPLE = (75, 15, 95, 255)
    C_WHITE = (255, 255, 255, 255)
    C_TRANS = (0, 0, 0, 0)

    # Standard Minecraft egg silhouette (16x16)
    def egg_pixel(x, y):
        dx = x - 7.5
        dy = (y - 8.5) * 0.85
        dist_sq = dx * dx + dy * dy
        if dist_sq > 28:
            return C_TRANS
        if dist_sq > 24:
            return (5, 5, 10, 255)  # outline
        # Spots / runes
        if (x, y) in [(6, 5), (7, 5), (9, 8), (10, 8), (5, 10), (6, 10), (8, 12)]:
            return C_CRIMSON
        if (x, y) in [(7, 6), (9, 9), (5, 11)]:
            return C_WHITE
        if dist_sq > 16:
            return C_DARK_RED
        if (x + y) % 3 == 0:
            return C_PURPLE
        return C_BLACK

    egg_path = os.path.join(RP_DIR, "textures", "items", "akuto_sai_v4_egg.png")
    write_png(egg_path, 16, 16, egg_pixel)


def generate_particle_texture():
    """Generates a 128x128 particle texture atlas in RP/textures/particle/particles.png
    containing glowing runes, circular aura glyphs, and spark particles."""
    def particle_pixel(x, y):
        # 1. Aura Ring sprite at uv [0, 16] size [8, 8] -> x in 0..8, y in 16..24
        if 0 <= x < 8 and 16 <= y < 24:
            dx = x - 3.5
            dy = y - 19.5
            r = (dx * dx + dy * dy) ** 0.5
            if 2.2 <= r <= 3.6:
                return (235, 20, 60, 255)
            elif 1.2 <= r < 2.2:
                return (255, 120, 160, 255)
            elif r < 1.2:
                return (255, 255, 255, 255)
            return (0, 0, 0, 0)

        # 2. Black Energy sprite at uv [0, 0] size [8, 8] -> x in 0..8, y in 0..8
        if 0 <= x < 8 and 0 <= y < 8:
            dx = x - 3.5
            dy = y - 3.5
            r = (dx * dx + dy * dy) ** 0.5
            if r <= 3.2:
                alpha = int(255 * (1.0 - r / 3.5))
                return (20, 10, 30, alpha)
            return (0, 0, 0, 0)

        # 3. Crimson Sparks sprite at uv [16, 0] size [8, 8] -> x in 16..24, y in 0..8
        if 16 <= x < 24 and 0 <= y < 8:
            dx = x - 19.5
            dy = y - 3.5
            r = (dx * dx + dy * dy) ** 0.5
            if r <= 1.5:
                return (255, 255, 255, 255)
            elif r <= 3.0:
                return (230, 25, 65, int(255 * (1.0 - (r - 1.5) / 1.5)))
            return (0, 0, 0, 0)

        # 4. Void slash / burst at uv [24, 16] size [8, 8] -> x in 24..32, y in 16..24
        if 24 <= x < 32 and 16 <= y < 24:
            dx = x - 27.5
            dy = y - 19.5
            # Crescent blade shape
            if abs(dy) <= 2.5 and abs(dx - dy * 0.5) <= 1.5:
                return (255, 255, 255, 255)
            elif abs(dy) <= 3.5 and abs(dx - dy * 0.5) <= 2.5:
                return (180, 20, 80, 200)
            return (0, 0, 0, 0)

        # Default transparent background
        return (0, 0, 0, 0)

    part_path = os.path.join(RP_DIR, "textures", "particle", "particles.png")
    write_png(part_path, 128, 128, particle_pixel)


def generate_pack_icon(path, title):
    """Generates a stylish 64x64 pack icon for the Bedrock pack."""
    def icon_pixel(x, y):
        # Void gradient background
        border = (x < 3 or x >= 61 or y < 3 or y >= 61)
        if border:
            return (220, 20, 60, 255) if (x + y) % 4 == 0 else (120, 0, 30, 255)
        # Center "V4" insignia with glowing crimson aura
        dx = x - 32
        dy = y - 32
        r = (dx * dx + dy * dy) ** 0.5
        if r < 14:
            # Center bright core
            if 20 <= x <= 25 and 20 <= y <= 44:  # Left slash of V
                return (255, 255, 255, 255)
            if 25 <= x <= 30 and 38 <= y <= 44:
                return (255, 255, 255, 255)
            if 34 <= x <= 38 and 20 <= y <= 44:  # 4 vertical bar
                return (255, 255, 255, 255)
            if 30 <= x <= 42 and 34 <= y <= 37:  # 4 cross bar
                return (255, 255, 255, 255)
            return (200, 0, 40, 255)
        elif r < 24:
            if (x * 3 + y * 2) % 5 == 0:
                return (180, 0, 45, 255)
            return (40, 10, 50, 255)
        return (10, 10, 18, 255)

    write_png(path, 64, 64, icon_pixel)


def generate_geometry():
    """Builds the comprehensive, Bedrock 1.12.0+ geometry with all required bones."""
    geo = {
        "format_version": "1.12.0",
        "minecraft:geometry": [
            {
                "description": {
                    "identifier": "geometry.akuto_sai_v4",
                    "texture_width": 128,
                    "texture_height": 128,
                    "visible_bounds_width": 5.0,
                    "visible_bounds_height": 5.0,
                    "visible_bounds_offset": [0, 1.5, 0]
                },
                "bones": [
                    {
                        "name": "root",
                        "pivot": [0, 0, 0],
                        "locators": {
                            "root": [0, 0, 0]
                        }
                    },
                    {
                        "name": "body",
                        "parent": "root",
                        "pivot": [0, 24, 0],
                        "locators": {
                            "body": [0, 18, 0]
                        },
                        "cubes": [
                            # Slim anime athletic torso
                            {"origin": [-4.5, 12, -2.5], "size": [9, 12, 5], "uv": [16, 32]},
                            # Popped jacket collar
                            {"origin": [-5.0, 22.5, -3.0], "size": [10, 3, 6], "uv": [0, 32]},
                            # Front chest lapels & white shirt layer
                            {"origin": [-3.5, 14, -2.8], "size": [7, 9, 1], "uv": [20, 50]},
                            # Crimson waist sash / belt
                            {"origin": [-4.7, 11.2, -2.7], "size": [9.4, 1.8, 5.4], "uv": [0, 52]}
                        ]
                    },
                    {
                        "name": "head",
                        "parent": "body",
                        "pivot": [0, 24, 0],
                        "locators": {
                            "head": [0, 28, 0]
                        },
                        "cubes": [
                            # Sharp anime face & head
                            {"origin": [-4, 24, -4], "size": [8, 8, 8], "uv": [0, 0]},
                            # Sharp jaw / chin definition
                            {"origin": [-3.5, 23.6, -3.5], "size": [7, 1.2, 7], "uv": [32, 0]}
                        ]
                    },
                    {
                        "name": "hair",
                        "parent": "head",
                        "pivot": [0, 26, 0],
                        "cubes": [
                            # Main hair base
                            {"origin": [-4.3, 27, -4.3], "size": [8.6, 6, 8.6], "uv": [32, 8]},
                            # Back curtain of hair
                            {"origin": [-4.2, 22.5, 3.5], "size": [8.4, 8, 1.8], "uv": [48, 0]},
                            # Top crest spike 1
                            {"origin": [-2.5, 32.5, -2], "size": [4, 3.5, 4], "rotation": [-12, 0, 6], "uv": [96, 0]},
                            # Top crest spike 2
                            {"origin": [0.5, 33.0, -0.5], "size": [3.5, 4.0, 3.5], "rotation": [16, 12, -10], "uv": [96, 12]}
                        ]
                    },
                    {
                        "name": "hair_front",
                        "parent": "hair",
                        "pivot": [0, 28, -4],
                        "cubes": [
                            # Center forehead spike
                            {"origin": [-1.5, 24.5, -4.6], "size": [3, 4.5, 1], "rotation": [10, 0, 0], "uv": [64, 0]},
                            # Left bangs strand
                            {"origin": [-3.8, 25.0, -4.5], "size": [2, 4.0, 1], "rotation": [12, 0, 16], "uv": [64, 8]},
                            # Right bangs strand
                            {"origin": [1.8, 25.0, -4.5], "size": [2, 4.0, 1], "rotation": [12, 0, -16], "uv": [64, 16]}
                        ]
                    },
                    {
                        "name": "hair_left",
                        "parent": "hair",
                        "pivot": [-4, 27, 0],
                        "cubes": [
                            # Left side hair tuft
                            {"origin": [-5.0, 23.5, -3.2], "size": [1.5, 6.5, 6.4], "rotation": [0, 0, -10], "uv": [80, 0]},
                            # Left lateral flare spike
                            {"origin": [-5.4, 27.5, -1.0], "size": [1.5, 3.2, 3.2], "rotation": [0, 15, -22], "uv": [80, 14]}
                        ]
                    },
                    {
                        "name": "hair_right",
                        "parent": "hair",
                        "pivot": [4, 27, 0],
                        "cubes": [
                            # Right side hair tuft
                            {"origin": [3.5, 23.5, -3.2], "size": [1.5, 6.5, 6.4], "rotation": [0, 0, 10], "uv": [80, 0]},
                            # Right lateral flare spike
                            {"origin": [3.9, 27.5, -1.0], "size": [1.5, 3.2, 3.2], "rotation": [0, -15, 22], "uv": [80, 14]}
                        ]
                    },
                    {
                        "name": "coat",
                        "parent": "body",
                        "pivot": [0, 14, 0],
                        "cubes": [
                            # Upper coat flare / belt skirt
                            {"origin": [-4.8, 9, -2.8], "size": [9.6, 5, 5.6], "uv": [48, 64]}
                        ]
                    },
                    {
                        "name": "coat_tail_left",
                        "parent": "coat",
                        "pivot": [-2.5, 11, 2.5],
                        "cubes": [
                            # Long left coat tail flapping dynamically
                            {"origin": [-4.5, -1.0, 1.8], "size": [4.2, 12, 1], "rotation": [10, 0, -6], "uv": [48, 80]},
                            # Lower decorative taper
                            {"origin": [-4.4, -3.5, 2.1], "size": [4.0, 3, 0.8], "rotation": [16, 0, -8], "uv": [64, 80]}
                        ]
                    },
                    {
                        "name": "coat_tail_right",
                        "parent": "coat",
                        "pivot": [2.5, 11, 2.5],
                        "cubes": [
                            # Long right coat tail flapping dynamically
                            {"origin": [0.3, -1.0, 1.8], "size": [4.2, 12, 1], "rotation": [10, 0, 6], "uv": [48, 80]},
                            # Lower decorative taper
                            {"origin": [0.4, -3.5, 2.1], "size": [4.0, 3, 0.8], "rotation": [16, 0, 8], "uv": [64, 80]}
                        ]
                    },
                    {
                        "name": "left_arm",
                        "parent": "body",
                        "pivot": [5.5, 22, 0],
                        "cubes": [
                            # Left shoulder pad / coat sleeve
                            {"origin": [4.6, 17.5, -2.5], "size": [4.2, 5.5, 5.0], "uv": [64, 24]},
                            # Left upper arm
                            {"origin": [4.8, 12.5, -2.0], "size": [3.6, 6.0, 4.0], "uv": [64, 36]}
                        ]
                    },
                    {
                        "name": "left_hand",
                        "parent": "left_arm",
                        "pivot": [6.5, 13, 0],
                        "cubes": [
                            # Left forearm & tactical gloved hand
                            {"origin": [4.9, 7.5, -1.8], "size": [3.4, 6.0, 3.6], "uv": [80, 36]},
                            # Crimson anime coat cuff
                            {"origin": [4.7, 11.5, -2.1], "size": [3.8, 2.2, 4.2], "uv": [80, 24]}
                        ]
                    },
                    {
                        "name": "right_arm",
                        "parent": "body",
                        "pivot": [-5.5, 22, 0],
                        "cubes": [
                            # Right shoulder pad / coat sleeve
                            {"origin": [-8.8, 17.5, -2.5], "size": [4.2, 5.5, 5.0], "uv": [64, 24]},
                            # Right upper arm
                            {"origin": [-8.4, 12.5, -2.0], "size": [3.6, 6.0, 4.0], "uv": [64, 36]}
                        ]
                    },
                    {
                        "name": "right_hand",
                        "parent": "right_arm",
                        "pivot": [-6.5, 13, 0],
                        "cubes": [
                            # Right forearm & tactical gloved hand
                            {"origin": [-8.3, 7.5, -1.8], "size": [3.4, 6.0, 3.6], "uv": [80, 36]},
                            # Crimson anime coat cuff
                            {"origin": [-8.5, 11.5, -2.1], "size": [3.8, 2.2, 4.2], "uv": [80, 24]}
                        ]
                    },
                    {
                        "name": "left_leg",
                        "parent": "root",
                        "pivot": [2.2, 12, 0],
                        "cubes": [
                            # Left thigh uniform pants
                            {"origin": [0.5, 6.0, -2.0], "size": [3.5, 6.0, 4.0], "uv": [0, 64]},
                            # Left calf
                            {"origin": [0.6, 2.0, -1.8], "size": [3.3, 5.0, 3.6], "uv": [16, 64]}
                        ]
                    },
                    {
                        "name": "left_foot",
                        "parent": "left_leg",
                        "pivot": [2.2, 2, 0],
                        "cubes": [
                            # Left polished black anime combat boot
                            {"origin": [0.4, 0.0, -2.8], "size": [3.7, 2.6, 5.2], "uv": [0, 80]}
                        ]
                    },
                    {
                        "name": "right_leg",
                        "parent": "root",
                        "pivot": [-2.2, 12, 0],
                        "cubes": [
                            # Right thigh uniform pants
                            {"origin": [-4.0, 6.0, -2.0], "size": [3.5, 6.0, 4.0], "uv": [0, 64]},
                            # Right calf
                            {"origin": [-3.9, 2.0, -1.8], "size": [3.3, 5.0, 3.6], "uv": [16, 64]}
                        ]
                    },
                    {
                        "name": "right_foot",
                        "parent": "right_leg",
                        "pivot": [-2.2, 2, 0],
                        "cubes": [
                            # Right polished black anime combat boot
                            {"origin": [-4.1, 0.0, -2.8], "size": [3.7, 2.6, 5.2], "uv": [0, 80]}
                        ]
                    }
                ]
            }
        ]
    }

    geo_path = os.path.join(RP_DIR, "models", "entity", "akuto_sai_v4.geo.json")
    os.makedirs(os.path.dirname(geo_path), exist_ok=True)
    with open(geo_path, "w") as f:
        json.dump(geo, f, indent=2)
    print(f"Created Geometry: {geo_path}")


def generate_animations():
    """Builds the rich animation sets: idle, walk, attack, aura, teleport, reality_break, void_slash."""
    anim = {
        "format_version": "1.8.0",
        "animations": {
            "animation.akuto_sai_v4.idle": {
                "loop": True,
                "animation_length": 3.0,
                "bones": {
                    "body": {
                        "position": {
                            "0.0": [0, 0, 0],
                            "1.5": [0, 0.4, 0],
                            "3.0": [0, 0, 0]
                        }
                    },
                    "head": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "1.5": [-1.5, 1.0, 0],
                            "3.0": [0, 0, 0]
                        }
                    },
                    "hair": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "1.2": [1.5, 1.0, 1.0],
                            "2.4": [-1.0, -1.0, -0.5],
                            "3.0": [0, 0, 0]
                        }
                    },
                    "coat_tail_left": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "1.5": [6.0, 0, -3.0],
                            "3.0": [0, 0, 0]
                        }
                    },
                    "coat_tail_right": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "1.5": [6.0, 0, 3.0],
                            "3.0": [0, 0, 0]
                        }
                    },
                    "left_arm": {
                        "rotation": {
                            "0.0": [0, 0, 2],
                            "1.5": [0, 0, 4],
                            "3.0": [0, 0, 2]
                        }
                    },
                    "right_arm": {
                        "rotation": {
                            "0.0": [0, 0, -2],
                            "1.5": [0, 0, -4],
                            "3.0": [0, 0, -2]
                        }
                    }
                }
            },
            "animation.akuto_sai_v4.walk": {
                "loop": True,
                "anim_time_update": "query.modified_distance_moved",
                "bones": {
                    "left_leg": {
                        "rotation": ["math.cos(query.anim_time * 38) * 35.0", 0, 0]
                    },
                    "right_leg": {
                        "rotation": ["-math.cos(query.anim_time * 38) * 35.0", 0, 0]
                    },
                    "left_arm": {
                        "rotation": ["-math.cos(query.anim_time * 38) * 25.0", 0, 4]
                    },
                    "right_arm": {
                        "rotation": ["math.cos(query.anim_time * 38) * 25.0", 0, -4]
                    },
                    "coat_tail_left": {
                        "rotation": ["12.0 + math.abs(math.cos(query.anim_time * 38)) * 18.0", 0, -5]
                    },
                    "coat_tail_right": {
                        "rotation": ["12.0 + math.abs(math.cos(query.anim_time * 38)) * 18.0", 0, 5]
                    },
                    "hair": {
                        "rotation": ["math.sin(query.anim_time * 38) * 4.0", 0, 0]
                    }
                }
            },
            "animation.akuto_sai_v4.attack": {
                "loop": False,
                "animation_length": 0.45,
                "bones": {
                    "body": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.15": [-8, -25, 0],
                            "0.25": [12, 35, 0],
                            "0.45": [0, 0, 0]
                        },
                        "position": {
                            "0.0": [0, 0, 0],
                            "0.25": [0, 0, 1.2],
                            "0.45": [0, 0, 0]
                        }
                    },
                    "right_arm": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.15": [-40, -30, 20],
                            "0.25": [95, 15, -45],
                            "0.45": [0, 0, 0]
                        }
                    },
                    "left_arm": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.2": [-20, 15, -15],
                            "0.45": [0, 0, 0]
                        }
                    },
                    "coat_tail_left": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.25": [24, 0, -12],
                            "0.45": [0, 0, 0]
                        }
                    },
                    "coat_tail_right": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.25": [24, 0, 12],
                            "0.45": [0, 0, 0]
                        }
                    }
                }
            },
            "animation.akuto_sai_v4.aura": {
                "loop": True,
                "animation_length": 2.0,
                "particle_effects": {
                    "0.0": [
                        {"effect": "aura_ring", "locator": "root"},
                        {"effect": "black_energy", "locator": "body"}
                    ],
                    "0.5": [
                        {"effect": "crimson_energy", "locator": "head"}
                    ],
                    "1.0": [
                        {"effect": "aura_ring", "locator": "root"},
                        {"effect": "black_energy", "locator": "body"}
                    ],
                    "1.5": [
                        {"effect": "crimson_energy", "locator": "head"}
                    ]
                },
                "bones": {
                    "hair_front": {
                        "position": {
                            "0.0": [0, 0, 0],
                            "1.0": [0, 0.2, -0.1],
                            "2.0": [0, 0, 0]
                        }
                    },
                    "hair_left": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "1.0": [0, 4, -4],
                            "2.0": [0, 0, 0]
                        }
                    },
                    "hair_right": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "1.0": [0, -4, 4],
                            "2.0": [0, 0, 0]
                        }
                    }
                }
            },
            "animation.akuto_sai_v4.reality_break": {
                "loop": False,
                "animation_length": 1.5,
                "particle_effects": {
                    "0.5": [
                        {"effect": "reality_explosion", "locator": "body"}
                    ]
                },
                "bones": {
                    "body": {
                        "position": {
                            "0.0": [0, 0, 0],
                            "0.5": [0, 1.5, 0],
                            "1.0": [0, 2.0, 0],
                            "1.5": [0, 0, 0]
                        }
                    },
                    "left_arm": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.5": [-120, 40, -30],
                            "1.0": [-140, 20, -50],
                            "1.5": [0, 0, 0]
                        }
                    },
                    "right_arm": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.5": [-120, -40, 30],
                            "1.0": [-140, -20, 50],
                            "1.5": [0, 0, 0]
                        }
                    },
                    "coat_tail_left": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.7": [45, 10, -25],
                            "1.5": [0, 0, 0]
                        }
                    },
                    "coat_tail_right": {
                        "rotation": {
                            "0.0": [0, 0, 0],
                            "0.7": [45, -10, 25],
                            "1.5": [0, 0, 0]
                        }
                    }
                }
            },
            "animation.akuto_sai_v4.void_slash": {
                "loop": False,
                "animation_length": 0.6,
                "particle_effects": {
                    "0.2": [
                        {"effect": "void_slash", "locator": "body"}
                    ]
                },
                "bones": {
                    "body": {
                        "rotation": {
                            "0.0": [0, 30, 0],
                            "0.3": [0, -60, 0],
                            "0.6": [0, 0, 0]
                        }
                    },
                    "right_arm": {
                        "rotation": {
                            "0.0": [-60, 60, -30],
                            "0.25": [80, -70, 50],
                            "0.6": [0, 0, 0]
                        }
                    }
                }
            },
            "animation.akuto_sai_v4.teleport": {
                "loop": False,
                "animation_length": 0.5,
                "particle_effects": {
                    "0.1": [
                        {"effect": "teleport_burst", "locator": "root"}
                    ]
                },
                "bones": {
                    "body": {
                        "scale": {
                            "0.0": [1, 1, 1],
                            "0.2": [0.1, 1.8, 0.1],
                            "0.3": [0, 0, 0],
                            "0.4": [1.4, 0.6, 1.4],
                            "0.5": [1, 1, 1]
                        }
                    }
                }
            }
        }
    }

    anim_path = os.path.join(RP_DIR, "animations", "akuto_sai_v4.animation.json")
    os.makedirs(os.path.dirname(anim_path), exist_ok=True)
    with open(anim_path, "w") as f:
        json.dump(anim, f, indent=2)
    print(f"Created Animation: {anim_path}")


def generate_render_controllers():
    """Generates the render controller linking geometry and textures."""
    rc = {
        "format_version": "1.8.0",
        "render_controllers": {
            "controller.render.akuto_sai_v4": {
                "geometry": "Geometry.default",
                "materials": [{"*": "Material.default"}],
                "textures": ["Texture.default"]
            }
        }
    }
    rc_path = os.path.join(RP_DIR, "render_controllers", "akuto_sai_v4.render_controllers.json")
    os.makedirs(os.path.dirname(rc_path), exist_ok=True)
    with open(rc_path, "w") as f:
        json.dump(rc, f, indent=2)
    print(f"Created Render Controller: {rc_path}")


def generate_particles():
    """Generates Bedrock-compatible particle files for the multi-layered aura and attack effects."""
    particles_dir = os.path.join(RP_DIR, "particles")
    os.makedirs(particles_dir, exist_ok=True)

    # 1. Aura Ring (Feet circular aura)
    aura_ring = {
        "format_version": "1.10.0",
        "particle_effect": {
            "description": {
                "identifier": "akuto:aura_ring",
                "basic_render_parameters": {
                    "material": "particles_alpha",
                    "texture": "textures/particle/particles"
                }
            },
            "components": {
                "minecraft:emitter_rate_steady": {
                    "spawn_rate": 20,
                    "max_particles": 60
                },
                "minecraft:emitter_lifetime_looping": {
                    "active_time": 10.0
                },
                "minecraft:emitter_shape_disc": {
                    "radius": 1.4,
                    "surface_only": True,
                    "direction": [0, 1, 0]
                },
                "minecraft:particle_lifetime_expression": {
                    "max_lifetime": 0.8
                },
                "minecraft:particle_initial_speed": 0.5,
                "minecraft:particle_motion_dynamic": {
                    "linear_acceleration": [0, 0.8, 0]
                },
                "minecraft:particle_appearance_billboard": {
                    "size": [0.3, 0.3],
                    "facing_camera_mode": "rotate_xyz",
                    "uv": {
                        "texture_width": 128,
                        "texture_height": 128,
                        "uv": [0, 16],
                        "uv_size": [8, 8]
                    }
                },
                "minecraft:particle_appearance_tinting": {
                    "color": {
                        "interpolant": "v.particle_age / v.particle_lifetime",
                        "gradient": {
                            "0.0": "#b30026",
                            "0.5": "#4a0072",
                            "1.0": "#0a0a14"
                        }
                    }
                }
            }
        }
    }

    # 2. Black Energy (Torso upward moving dark void essence)
    black_energy = {
        "format_version": "1.10.0",
        "particle_effect": {
            "description": {
                "identifier": "akuto:black_energy",
                "basic_render_parameters": {
                    "material": "particles_alpha",
                    "texture": "textures/particle/particles"
                }
            },
            "components": {
                "minecraft:emitter_rate_steady": {
                    "spawn_rate": 24,
                    "max_particles": 80
                },
                "minecraft:emitter_lifetime_looping": {
                    "active_time": 10.0
                },
                "minecraft:emitter_shape_cylinder": {
                    "radius": 0.7,
                    "height": 1.5,
                    "direction": [0, 1, 0]
                },
                "minecraft:particle_lifetime_expression": {
                    "max_lifetime": 1.0
                },
                "minecraft:particle_initial_speed": 0.6,
                "minecraft:particle_motion_dynamic": {
                    "linear_acceleration": [0, 1.2, 0]
                },
                "minecraft:particle_appearance_billboard": {
                    "size": [0.35, 0.35],
                    "facing_camera_mode": "rotate_xyz",
                    "uv": {
                        "texture_width": 128,
                        "texture_height": 128,
                        "uv": [0, 0],
                        "uv_size": [8, 8]
                    }
                },
                "minecraft:particle_appearance_tinting": {
                    "color": {
                        "interpolant": "v.particle_age / v.particle_lifetime",
                        "gradient": {
                            "0.0": "#08080f",
                            "0.5": "#2a0536",
                            "1.0": "#e60039"
                        }
                    }
                }
            }
        }
    }

    # 3. Crimson Energy (Floating fiery crimson sparks around head and arms)
    crimson_energy = {
        "format_version": "1.10.0",
        "particle_effect": {
            "description": {
                "identifier": "akuto:crimson_energy",
                "basic_render_parameters": {
                    "material": "particles_alpha",
                    "texture": "textures/particle/particles"
                }
            },
            "components": {
                "minecraft:emitter_rate_steady": {
                    "spawn_rate": 18,
                    "max_particles": 50
                },
                "minecraft:emitter_lifetime_looping": {
                    "active_time": 10.0
                },
                "minecraft:emitter_shape_sphere": {
                    "radius": 1.0,
                    "direction": [0, 1, 0]
                },
                "minecraft:particle_lifetime_expression": {
                    "max_lifetime": 0.9
                },
                "minecraft:particle_initial_speed": 0.4,
                "minecraft:particle_motion_dynamic": {
                    "linear_acceleration": [0, 1.5, 0]
                },
                "minecraft:particle_appearance_billboard": {
                    "size": [0.25, 0.25],
                    "facing_camera_mode": "rotate_xyz",
                    "uv": {
                        "texture_width": 128,
                        "texture_height": 128,
                        "uv": [16, 0],
                        "uv_size": [8, 8]
                    }
                },
                "minecraft:particle_appearance_tinting": {
                    "color": {
                        "interpolant": "v.particle_age / v.particle_lifetime",
                        "gradient": {
                            "0.0": "#ff1a4a",
                            "0.6": "#b30026",
                            "1.0": "#3d0012"
                        }
                    }
                }
            }
        }
    }

    # 4. Void Slash (Wide dark purple & crimson slash wave)
    void_slash = {
        "format_version": "1.10.0",
        "particle_effect": {
            "description": {
                "identifier": "akuto:void_slash",
                "basic_render_parameters": {
                    "material": "particles_alpha",
                    "texture": "textures/particle/particles"
                }
            },
            "components": {
                "minecraft:emitter_rate_instant": {
                    "num_particles": 45
                },
                "minecraft:emitter_lifetime_once": {
                    "active_time": 0.1
                },
                "minecraft:emitter_shape_disc": {
                    "radius": 2.5,
                    "direction": [1, 0, 1]
                },
                "minecraft:particle_lifetime_expression": {
                    "max_lifetime": 0.5
                },
                "minecraft:particle_initial_speed": 4.0,
                "minecraft:particle_motion_dynamic": {
                    "linear_acceleration": [0, 0, 0],
                    "linear_drag_coefficient": 3.0
                },
                "minecraft:particle_appearance_billboard": {
                    "size": [0.5, 0.5],
                    "facing_camera_mode": "rotate_xyz",
                    "uv": {
                        "texture_width": 128,
                        "texture_height": 128,
                        "uv": [24, 16],
                        "uv_size": [8, 8]
                    }
                },
                "minecraft:particle_appearance_tinting": {
                    "color": {
                        "interpolant": "v.particle_age / v.particle_lifetime",
                        "gradient": {
                            "0.0": "#e60039",
                            "0.4": "#6b0080",
                            "1.0": "#080812"
                        }
                    }
                }
            }
        }
    }

    # 5. Reality Explosion / Break (Shockwave blast with expanding rings)
    reality_explosion = {
        "format_version": "1.10.0",
        "particle_effect": {
            "description": {
                "identifier": "akuto:reality_explosion",
                "basic_render_parameters": {
                    "material": "particles_alpha",
                    "texture": "textures/particle/particles"
                }
            },
            "components": {
                "minecraft:emitter_rate_instant": {
                    "num_particles": 90
                },
                "minecraft:emitter_lifetime_once": {
                    "active_time": 0.2
                },
                "minecraft:emitter_shape_sphere": {
                    "radius": 1.2,
                    "direction": "outwards"
                },
                "minecraft:particle_lifetime_expression": {
                    "max_lifetime": 1.2
                },
                "minecraft:particle_initial_speed": 5.5,
                "minecraft:particle_motion_dynamic": {
                    "linear_acceleration": [0, 0.5, 0],
                    "linear_drag_coefficient": 2.2
                },
                "minecraft:particle_appearance_billboard": {
                    "size": [0.6, 0.6],
                    "facing_camera_mode": "rotate_xyz",
                    "uv": {
                        "texture_width": 128,
                        "texture_height": 128,
                        "uv": [0, 32],
                        "uv_size": [8, 8]
                    }
                },
                "minecraft:particle_appearance_tinting": {
                    "color": {
                        "interpolant": "v.particle_age / v.particle_lifetime",
                        "gradient": {
                            "0.0": "#ffffff",
                            "0.2": "#ff1a4a",
                            "0.6": "#4d0066",
                            "1.0": "#05050a"
                        }
                    }
                }
            }
        }
    }

    # 6. Teleport Burst (Disappearance & reappearance collapse effect)
    teleport_burst = {
        "format_version": "1.10.0",
        "particle_effect": {
            "description": {
                "identifier": "akuto:teleport_burst",
                "basic_render_parameters": {
                    "material": "particles_alpha",
                    "texture": "textures/particle/particles"
                }
            },
            "components": {
                "minecraft:emitter_rate_instant": {
                    "num_particles": 60
                },
                "minecraft:emitter_lifetime_once": {
                    "active_time": 0.1
                },
                "minecraft:emitter_shape_cylinder": {
                    "radius": 1.0,
                    "height": 2.2,
                    "direction": [0, 1, 0]
                },
                "minecraft:particle_lifetime_expression": {
                    "max_lifetime": 0.7
                },
                "minecraft:particle_initial_speed": 2.5,
                "minecraft:particle_motion_dynamic": {
                    "linear_acceleration": [0, 2.0, 0]
                },
                "minecraft:particle_appearance_billboard": {
                    "size": [0.4, 0.4],
                    "facing_camera_mode": "rotate_xyz",
                    "uv": {
                        "texture_width": 128,
                        "texture_height": 128,
                        "uv": [16, 16],
                        "uv_size": [8, 8]
                    }
                },
                "minecraft:particle_appearance_tinting": {
                    "color": {
                        "interpolant": "v.particle_age / v.particle_lifetime",
                        "gradient": {
                            "0.0": "#100020",
                            "0.5": "#e60039",
                            "1.0": "#ff4d6d"
                        }
                    }
                }
            }
        }
    }

    particle_map = {
        "akuto_aura_ring.particle.json": aura_ring,
        "akuto_black_energy.particle.json": black_energy,
        "akuto_crimson_energy.particle.json": crimson_energy,
        "akuto_void_slash.particle.json": void_slash,
        "akuto_reality_explosion.particle.json": reality_explosion,
        "akuto_teleport_burst.particle.json": teleport_burst
    }

    for fname, pdata in particle_map.items():
        with open(os.path.join(particles_dir, fname), "w") as f:
            json.dump(pdata, f, indent=2)
    print(f"Generated {len(particle_map)} particle definitions in {particles_dir}")


def generate_client_entity():
    """Generates the client entity JSON linking geometry, textures, animations, particles, and render controller."""
    client_entity = {
        "format_version": "1.10.0",
        "minecraft:client_entity": {
            "description": {
                "identifier": "akuto:sai_v4",
                "materials": {
                    "default": "entity_alphatest"
                },
                "textures": {
                    "default": "textures/entity/akuto_sai_v4"
                },
                "geometry": {
                    "default": "geometry.akuto_sai_v4"
                },
                "animations": {
                    "idle": "animation.akuto_sai_v4.idle",
                    "walk": "animation.akuto_sai_v4.walk",
                    "attack": "animation.akuto_sai_v4.attack",
                    "aura": "animation.akuto_sai_v4.aura",
                    "reality_break": "animation.akuto_sai_v4.reality_break",
                    "void_slash": "animation.akuto_sai_v4.void_slash",
                    "teleport": "animation.akuto_sai_v4.teleport"
                },
                "scripts": {
                    "animate": [
                        "idle",
                        "aura",
                        {"walk": "query.modified_move_speed"},
                        {"attack": "variable.attack_time"}
                    ]
                },
                "particle_effects": {
                    "aura_ring": "akuto:aura_ring",
                    "black_energy": "akuto:black_energy",
                    "crimson_energy": "akuto:crimson_energy",
                    "void_slash": "akuto:void_slash",
                    "reality_explosion": "akuto:reality_explosion",
                    "teleport_burst": "akuto:teleport_burst"
                },
                "render_controllers": [
                    "controller.render.akuto_sai_v4"
                ],
                "spawn_egg": {
                    "texture": "akuto_sai_v4_egg",
                    "base_color": "#0a0a14",
                    "overlay_color": "#e60039"
                }
            }
        }
    }

    ce_path = os.path.join(RP_DIR, "entity", "akuto_sai_v4.entity.json")
    os.makedirs(os.path.dirname(ce_path), exist_ok=True)
    with open(ce_path, "w") as f:
        json.dump(client_entity, f, indent=2)
    print(f"Created Client Entity: {ce_path}")


def generate_item_texture():
    """Generates textures/item_texture.json for custom spawn egg."""
    item_texture = {
        "resource_pack_name": "Akuto_Sai_V4_RP",
        "texture_name": "atlas.items",
        "texture_data": {
            "akuto_sai_v4_egg": {
                "textures": "textures/items/akuto_sai_v4_egg"
            }
        }
    }
    it_path = os.path.join(RP_DIR, "textures", "item_texture.json")
    with open(it_path, "w") as f:
        json.dump(item_texture, f, indent=2)
    print(f"Created item_texture.json: {it_path}")


def generate_texts():
    """Generates localization files."""
    texts_dir = os.path.join(RP_DIR, "texts")
    os.makedirs(texts_dir, exist_ok=True)

    with open(os.path.join(texts_dir, "en_US.lang"), "w", encoding="utf-8") as f:
        f.write("entity.akuto:sai_v4.name=Akuto Sai — Reality Breaker\n")
        f.write("item.spawn_egg.entity.akuto:sai_v4.name=Akuto Sai V4 Spawn Egg\n")
        f.write("action.hint.exit.akuto:sai_v4=Reality bends to Akuto Sai\n")

    with open(os.path.join(texts_dir, "languages.json"), "w") as f:
        json.dump(["en_US"], f, indent=2)
    print(f"Created language files in {texts_dir}")


def generate_behavior_entity():
    """Builds the comprehensive Behavior Pack entity with 9,000,000,000 HP, 9B attack damage,
    boss health bar, one-shot Warden capabilities, abilities, and player safety filters."""
    bp_entity = {
        "format_version": "1.20.80",
        "minecraft:entity": {
            "description": {
                "identifier": "akuto:sai_v4",
                "is_spawnable": True,
                "is_summonable": True,
                "is_experimental": False
            },
            "component_groups": {
                "akuto:reality_break_mode": {
                    "minecraft:spell_effects": {
                        "add_effects": [
                            {"effect": "strength", "duration": 10, "amplifier": 255, "visible": False},
                            {"effect": "speed", "duration": 10, "amplifier": 5, "visible": False}
                        ]
                    }
                }
            },
            "components": {
                "minecraft:is_hidden_when_invisible": {
                    "value": False
                },
                "minecraft:type_family": {
                    "family": ["monster", "boss", "akuto", "mob"]
                },
                "minecraft:collision_box": {
                    "width": 0.8,
                    "height": 2.2
                },
                "minecraft:physics": {},
                "minecraft:pushable": {
                    "is_pushable": False,
                    "is_pushable_by_piston": False
                },
                # Boss Stats: 2,000,000,000 Health & Attack Damage (Immense god-tier stats fitting signed 32-bit int without Bedrock C++ overflow)
                "minecraft:health": {
                    "value": 2000000000,
                    "max": 2000000000
                },
                "minecraft:attack": {
                    "damage": 2000000000
                },
                # Knockback resistance 100%
                "minecraft:knockback_resistance": {
                    "value": 1.0
                },
                # Complete immunities & damage resistance
                "minecraft:fire_immune": True,
                "minecraft:fall_damage": False,
                "minecraft:damage_sensor": {
                    "triggers": [
                        {"cause": "fire", "deals_damage": False},
                        {"cause": "fire_tick", "deals_damage": False},
                        {"cause": "lava", "deals_damage": False},
                        {"cause": "fall", "deals_damage": False},
                        {"cause": "drowning", "deals_damage": False},
                        {"cause": "entity_explosion", "deals_damage": False},
                        {"cause": "block_explosion", "deals_damage": False},
                        {"cause": "suffocation", "deals_damage": False},
                        {"cause": "void", "deals_damage": False}
                    ]
                },
                # Extreme Regeneration
                "minecraft:spell_effects": {
                    "add_effects": [
                        {"effect": "regeneration", "duration": 999999, "amplifier": 255, "visible": False},
                        {"effect": "resistance", "duration": 999999, "amplifier": 4, "visible": False}
                    ]
                },
                # Boss Bar
                "minecraft:boss": {
                    "hud_range": 64,
                    "name": "AKUTO SAI — REALITY BREAKER",
                    "should_darken_sky": True
                },
                # Movement: Very fast
                "minecraft:movement": {
                    "value": 0.45
                },
                "minecraft:movement.basic": {},
                "minecraft:navigation.walk": {
                    "can_climb": True,
                    "can_walk": True,
                    "can_pass_doors": True
                },
                "minecraft:jump.static": {},
                "minecraft:can_climb": {},
                # Targets: Hostile mobs, Warden, Wither, Ender Dragon
                # PLAYER SAFETY: DO NOT target player unless provoked via hurt_by_target!
                "minecraft:behavior.hurt_by_target": {
                    "priority": 1
                },
                "minecraft:behavior.nearest_attackable_target": {
                    "priority": 2,
                    "entity_types": [
                        {
                            "filters": {
                                "any_of": [
                                    {"test": "is_family", "subject": "other", "value": "monster"},
                                    {"test": "is_family", "subject": "other", "value": "warden"},
                                    {"test": "is_family", "subject": "other", "value": "wither"},
                                    {"test": "is_family", "subject": "other", "value": "dragon"}
                                ]
                            },
                            "max_dist": 48
                        }
                    ],
                    "must_see": False
                },
                "minecraft:behavior.melee_attack": {
                    "priority": 3,
                    "speed_multiplier": 1.5,
                    "track_target": True,
                    "reach_multiplier": 2.5
                },
                "minecraft:behavior.random_stroll": {
                    "priority": 6,
                    "speed_multiplier": 0.9
                },
                "minecraft:behavior.look_at_player": {
                    "priority": 7,
                    "target_distance": 16.0,
                    "probability": 0.4
                },
                "minecraft:behavior.random_look_around": {
                    "priority": 8
                },
                # Loot drop: Nether Star
                "minecraft:loot": {
                    "table": "loot_tables/entities/akuto_sai_v4.json"
                }
            }
        }
    }

    bp_ent_path = os.path.join(BP_DIR, "entities", "akuto_sai_v4.json")
    os.makedirs(os.path.dirname(bp_ent_path), exist_ok=True)
    with open(bp_ent_path, "w") as f:
        json.dump(bp_entity, f, indent=2)
    print(f"Created BP Entity: {bp_ent_path}")


def generate_loot_table():
    """Generates a reward loot table dropping Nether Stars upon defeat."""
    loot = {
        "pools": [
            {
                "rolls": 1,
                "entries": [
                    {
                        "type": "item",
                        "name": "minecraft:nether_star",
                        "weight": 1,
                        "functions": [
                            {
                                "function": "set_count",
                                "count": {"min": 1, "max": 4}
                            }
                        ]
                    }
                ]
            }
        ]
    }
    loot_path = os.path.join(BP_DIR, "loot_tables", "entities", "akuto_sai_v4.json")
    os.makedirs(os.path.dirname(loot_path), exist_ok=True)
    with open(loot_path, "w") as f:
        json.dump(loot, f, indent=2)
    print(f"Created Loot Table: {loot_path}")


def generate_manifests():
    """Generates manifests with matching UUID dependencies and min_engine_version [1, 21, 0]."""
    # Behavior Pack Manifest
    bp_manifest = {
        "format_version": 2,
        "header": {
            "name": f"{ADDON_NAME} (Behavior Pack)",
            "description": "Behavior Pack for Akuto Sai V4 featuring 9B HP, one-shot Warden damage, boss bar, and reality-breaking powers.",
            "uuid": UUID_BP_HEADER,
            "version": [4, 0, 0],
            "min_engine_version": [1, 21, 0]
        },
        "modules": [
            {
                "description": "Akuto Sai V4 Behavior Logic",
                "type": "data",
                "uuid": UUID_BP_MODULE,
                "version": [4, 0, 0]
            }
        ],
        "dependencies": [
            {
                "uuid": UUID_RP_HEADER,
                "version": [4, 0, 0]
            }
        ]
    }

    with open(os.path.join(BP_DIR, "manifest.json"), "w") as f:
        json.dump(bp_manifest, f, indent=2)

    # Resource Pack Manifest
    rp_manifest = {
        "format_version": 2,
        "header": {
            "name": f"{ADDON_NAME} (Resource Pack)",
            "description": "Resource Pack for Akuto Sai V4 featuring custom 3D anime geometry, layered aura particles, HD textures, and custom animations.",
            "uuid": UUID_RP_HEADER,
            "version": [4, 0, 0],
            "min_engine_version": [1, 21, 0]
        },
        "modules": [
            {
                "description": "Akuto Sai V4 Client Assets",
                "type": "resources",
                "uuid": UUID_RP_MODULE,
                "version": [4, 0, 0]
            }
        ],
        "dependencies": [
            {
                "uuid": UUID_BP_HEADER,
                "version": [4, 0, 0]
            }
        ]
    }

    with open(os.path.join(RP_DIR, "manifest.json"), "w") as f:
        json.dump(rp_manifest, f, indent=2)
    print("Generated manifests for both Behavior Pack and Resource Pack with mutual UUID dependencies.")


def validate_all_json():
    """Validates every single JSON file in BP and RP for syntax and integrity."""
    error_count = 0
    checked_count = 0
    for root, _, files in os.walk(BASE_DIR):
        for f in files:
            if f.endswith(".json"):
                checked_count += 1
                fpath = os.path.join(root, f)
                try:
                    with open(fpath, "r", encoding="utf-8") as jf:
                        json.load(jf)
                except Exception as e:
                    print(f"ERROR in {fpath}: {e}")
                    error_count += 1

    print(f"JSON Validation: Checked {checked_count} JSON files. Errors: {error_count}")
    if error_count > 0:
        raise ValueError(f"Encountered {error_count} JSON validation errors.")


def package_mcaddon():
    """Packs the Behavior Pack and Resource Pack folders into:
    1. Akuto_Sai_V4_Reality_Breaker.mcaddon (combined addon)
    2. Akuto_Sai_V4_BP.mcpack (behavior pack standalone)
    3. Akuto_Sai_V4_RP.mcpack (resource pack standalone)
    4. Akuto_Sai_V4_Reality_Breaker.zip (manual development packs archive)
    """
    output_path = os.path.abspath(MCADDON_FILENAME)
    public_output_path = os.path.abspath(os.path.join("public", MCADDON_FILENAME))
    bp_mcpack_path = os.path.abspath("Akuto_Sai_V4_BP.mcpack")
    rp_mcpack_path = os.path.abspath("Akuto_Sai_V4_RP.mcpack")
    zip_path = os.path.abspath("Akuto_Sai_V4_Reality_Breaker.zip")

    os.makedirs("public", exist_ok=True)

    # 1. Package combined .mcaddon
    for p in [output_path, public_output_path]:
        if os.path.exists(p):
            os.remove(p)

    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for pack_name, pack_dir in [("Akuto_Sai_V4_BP", BP_DIR), ("Akuto_Sai_V4_RP", RP_DIR)]:
            for root, _, files in os.walk(pack_dir):
                for f in files:
                    full_path = os.path.join(root, f)
                    rel_path = os.path.relpath(full_path, BASE_DIR)
                    zf.write(full_path, rel_path)

    shutil.copy2(output_path, public_output_path)

    # 2. Package Behavior Pack .mcpack
    with zipfile.ZipFile(bp_mcpack_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(BP_DIR):
            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, BP_DIR)
                zf.write(full_path, rel_path)
    shutil.copy2(bp_mcpack_path, os.path.join("public", "Akuto_Sai_V4_BP.mcpack"))

    # 3. Package Resource Pack .mcpack
    with zipfile.ZipFile(rp_mcpack_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(RP_DIR):
            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, RP_DIR)
                zf.write(full_path, rel_path)
    shutil.copy2(rp_mcpack_path, os.path.join("public", "Akuto_Sai_V4_RP.mcpack"))

    # 4. Package .zip archive
    shutil.copy2(output_path, zip_path)
    shutil.copy2(zip_path, os.path.join("public", "Akuto_Sai_V4_Reality_Breaker.zip"))

    size = os.path.getsize(output_path)
    print("=" * 60)
    print(f"SUCCESS: Created .mcaddon archive at {output_path} ({size / 1024:.1f} KB)")
    print(f"SUCCESS: Created BP .mcpack at {bp_mcpack_path}")
    print(f"SUCCESS: Created RP .mcpack at {rp_mcpack_path}")
    print(f"Available for direct download at /public/{MCADDON_FILENAME}")
    print("=" * 60)
    return output_path, size


def main():
    if os.path.exists(BASE_DIR):
        shutil.rmtree(BASE_DIR)

    os.makedirs(BP_DIR, exist_ok=True)
    os.makedirs(RP_DIR, exist_ok=True)

    print("Building Akuto Sai V4 — Reality Breaker Addon...")
    generate_pack_icon(os.path.join(BP_DIR, "pack_icon.png"), "BP")
    generate_pack_icon(os.path.join(RP_DIR, "pack_icon.png"), "RP")

    generate_akuto_texture()
    generate_spawn_egg_texture()
    generate_particle_texture()
    generate_geometry()
    generate_animations()
    generate_render_controllers()
    generate_particles()
    generate_client_entity()
    generate_item_texture()
    generate_texts()

    generate_behavior_entity()
    generate_loot_table()
    generate_manifests()

    validate_all_json()
    addon_path, addon_size = package_mcaddon()
    print("Build complete!")


if __name__ == "__main__":
    main()
