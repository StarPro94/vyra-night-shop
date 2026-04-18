// Vyra Night Shop — 4 L-shaped decorations at corners of a frame (trading-card feel).
// Inspired by .corner-decor in src/styles/global.css.
// Les 4 coins sont TOUJOURS en vert Vyra uniforme (symétrie visuelle propre). Variant-agnostic.

import { BRAND } from "./brand-tokens.mjs";

const L_THICKNESS = 2.5;   // stroke width of each L
const DEFAULT_SIZE = 42;   // arm length for 1024px canvas; scale up for posters

function cornerColors() {
  // Uniforme pour les deux variantes: 4 coins en vert Vyra.
  // Les accents GTA (orange/violet) se jouent ailleurs (stars, séparateurs ✦).
  return {
    tl: BRAND.vyra,
    tr: BRAND.vyra,
    bl: BRAND.vyra,
    br: BRAND.vyra,
  };
}

// Render 4 L-shaped corner markers inside the rectangle {x, y, width, height}.
// Each L sits flush with its corner, pointing inward.
export function renderFrameCorners({
  x,
  y,
  width,
  height,
  size = DEFAULT_SIZE,
  thickness = L_THICKNESS,
  // variant param kept for API compatibility but coins restent uniformes verts.
  // eslint-disable-next-line no-unused-vars
  variant = "strict",
}) {
  const c = cornerColors();
  const t = thickness;
  const x2 = x + width;
  const y2 = y + height;

  // Each L = two rects (horizontal + vertical arm) meeting at the corner.
  const tl = `
    <rect x="${x}" y="${y}" width="${size}" height="${t}" fill="${c.tl}"/>
    <rect x="${x}" y="${y}" width="${t}" height="${size}" fill="${c.tl}"/>`;
  const tr = `
    <rect x="${x2 - size}" y="${y}" width="${size}" height="${t}" fill="${c.tr}"/>
    <rect x="${x2 - t}" y="${y}" width="${t}" height="${size}" fill="${c.tr}"/>`;
  const bl = `
    <rect x="${x}" y="${y2 - t}" width="${size}" height="${t}" fill="${c.bl}"/>
    <rect x="${x}" y="${y2 - size}" width="${t}" height="${size}" fill="${c.bl}"/>`;
  const br = `
    <rect x="${x2 - size}" y="${y2 - t}" width="${size}" height="${t}" fill="${c.br}"/>
    <rect x="${x2 - t}" y="${y2 - size}" width="${t}" height="${size}" fill="${c.br}"/>`;

  return `<g id="frame-corners">${tl}${tr}${bl}${br}</g>`;
}
