#!/usr/bin/env python3
"""Compute WCAG contrast ratio for hsl primary vs white."""
import colorsys


def hsl_to_rgb(h, s, l):
    return colorsys.hls_to_rgb(h / 360, l, s)


def rel_lum(r, g, b):
    def lin(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = lin(r), lin(g), lin(b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(l1, l2):
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


white = rel_lum(1, 1, 1)
for lightness in range(20, 35):
    r, g, b = hsl_to_rgb(211, 1.0, lightness / 100)
    ratio = contrast(white, rel_lum(r, g, b))
    print(f"L={lightness}% -> #{int(r*255):02x}{int(g*255):02x}{int(b*255):02x} contrast={ratio:.2f}:1")
