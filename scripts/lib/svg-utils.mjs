// Vyra Night Shop — SVG building + rasterization helpers.
// Singleton font loading (Pricedown OTF) pour éviter de recharger à chaque appel.

import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

const FONT_PATH = path.resolve("scripts/assets/Pricedown-Bl.otf");

let _pricedown = null;

export function loadPricedown() {
  if (_pricedown) return _pricedown;
  if (!fs.existsSync(FONT_PATH)) {
    throw new Error(
      `Pricedown font missing at ${FONT_PATH}. ` +
      `Desktop-license OTF required for vector rendering.`
    );
  }
  _pricedown = opentype.loadSync(FONT_PATH);
  return _pricedown;
}

// Generate an SVG path string for text, with positional anchor.
// align: "center" centers text at anchorX, "right" aligns end at anchorX, "left" aligns start.
export function textPath(str, anchorX, baselineY, fontSize, align = "center", font = null) {
  const f = font || loadPricedown();
  const p = f.getPath(str, 0, 0, fontSize);
  const bb = p.getBoundingBox();
  const textWidth = bb.x2 - bb.x1;
  let offsetX;
  if (align === "right") {
    offsetX = anchorX - bb.x2;
  } else if (align === "left") {
    offsetX = anchorX - bb.x1;
  } else {
    offsetX = anchorX - (bb.x1 + textWidth / 2);
  }
  const positioned = f.getPath(str, offsetX, baselineY, fontSize);
  return {
    d: positioned.toPathData(3),
    width: textWidth,
    height: bb.y2 - bb.y1,
    bbox: bb,
  };
}

// Get text bounding box without building the path string (cheap).
export function textBBox(str, fontSize, font = null) {
  const f = font || loadPricedown();
  const p = f.getPath(str, 0, 0, fontSize);
  const bb = p.getBoundingBox();
  return { width: bb.x2 - bb.x1, height: bb.y2 - bb.y1, bbox: bb };
}

// Wrap children in a root <svg> with explicit width + height + viewBox.
// Explicit width/height is CRITICAL for sharp/resvg rasterization density.
export function svgDoc(width, height, children, { defs = "" } = {}) {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    (defs ? `<defs>${defs}</defs>` : "") +
    children +
    `</svg>`
  );
}

// Rasterize SVG string to PNG via sharp.
// density=300 gives print-quality output; resize locks final pixel dimensions.
export async function rasterize(svgString, outPath, { width, height, density = 300 } = {}) {
  const buf = Buffer.from(svgString);
  const pipeline = sharp(buf, { density });
  if (width && height) {
    pipeline.resize(width, height);
  }
  await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outPath);
}

// Ensure an output directory exists.
export function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
