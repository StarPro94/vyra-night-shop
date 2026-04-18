// Vyra Night Shop — Pixel skyline silhouette + enseignes statiques.
// Adapté du hero du site (src/components/Hero.astro:261-335).
//
// variant "brand" : pixels/enseignes en nuances de vert uniquement (pour le QR brand)
// variant "site"  : mix multicolore (vert + orange + violet + mauve) comme le hero web

import { BRAND, SITE_FLAVOR } from "./brand-tokens.mjs";

const BUILDINGS = [
  [0, 130, 60, 70], [60, 100, 80, 100], [140, 120, 50, 80], [190, 80, 95, 120],
  [285, 110, 60, 90], [345, 70, 110, 130], [455, 95, 75, 105], [530, 55, 130, 145],
  [660, 85, 70, 115], [730, 110, 50, 90], [780, 65, 120, 135], [900, 100, 80, 100],
  [980, 75, 100, 125], [1080, 115, 55, 85], [1135, 90, 85, 110], [1220, 105, 70, 95],
  [1290, 130, 55, 70], [1345, 95, 95, 105],
];

const WINDOWS = [
  [70, 115, 6], [82, 115, 6], [200, 100, 5], [215, 100, 5], [260, 120, 5],
  [360, 90, 6], [380, 90, 6], [400, 110, 6], [550, 75, 7], [580, 75, 7],
  [610, 95, 7], [800, 85, 6], [830, 85, 6], [860, 105, 6], [1000, 95, 6],
  [1030, 95, 6], [1160, 110, 5], [1370, 115, 6], [1400, 115, 6],
];

const STARS = [
  [75, 135, 4], [210, 130, 4], [395, 130, 5], [570, 110, 5],
  [815, 120, 4], [1020, 130, 4], [1380, 140, 4],
];

// Enseignes "brand" — tout vert.
const ENSEIGNES_BRAND = [
  { x: 205, y: 90, w: 38, h: 8, color: BRAND.vyra },
  { x: 560, y: 68, w: 55, h: 10, color: BRAND.vyraLight },
  { x: 810, y: 78, w: 48, h: 9, color: BRAND.neonLive },
  { x: 1005, y: 88, w: 42, h: 8, color: BRAND.vyra },
  { x: 1370, y: 107, w: 40, h: 7, color: BRAND.vyraLight },
];

// Enseignes "site" — mix GTA SA comme le hero (vert + orange + violet + mauve).
const ENSEIGNES_SITE = [
  { x: 205, y: 90, w: 38, h: 8, color: BRAND.vyra },
  { x: 560, y: 68, w: 55, h: 10, color: SITE_FLAVOR.saOrange },
  { x: 810, y: 78, w: 48, h: 9, color: SITE_FLAVOR.saViolet },
  { x: 1005, y: 88, w: 42, h: 8, color: SITE_FLAVOR.saMauve },
  { x: 1370, y: 107, w: 40, h: 7, color: BRAND.vyra },
];

export function renderSkyline({ x, y, width, height, variant = "brand" }) {
  const enseignes = variant === "site" ? ENSEIGNES_SITE : ENSEIGNES_BRAND;
  const windowColor = variant === "site" ? SITE_FLAVOR.saOrange : BRAND.vyra;

  const buildings = BUILDINGS
    .map(([bx, by, bw, bh]) => `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}"/>`)
    .join("");
  const windows = WINDOWS
    .map(([wx, wy, ws]) => `<rect x="${wx}" y="${wy}" width="${ws}" height="${ws}"/>`)
    .join("");
  const stars = STARS
    .map(([sx, sy, ss]) => `<rect x="${sx}" y="${sy}" width="${ss}" height="${ss}"/>`)
    .join("");
  const enseigneRects = enseignes
    .map((e) => `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" fill="${e.color}"/>`)
    .join("");

  const fade = `<rect x="0" y="0" width="1440" height="200" fill="url(#skyline-fade)"/>`;

  return `<svg x="${x}" y="${y}" width="${width}" height="${height}"
    viewBox="0 0 1440 200" preserveAspectRatio="xMidYEnd slice">
    <defs>
      <linearGradient id="skyline-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${BRAND.bgDeep}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${BRAND.bgDeep}" stop-opacity="0.8"/>
      </linearGradient>
    </defs>
    <g fill="${BRAND.surface}">${buildings}</g>
    <g fill="${windowColor}" opacity="0.75">${windows}</g>
    <g fill="${BRAND.text}" opacity="0.35">${stars}</g>
    ${enseigneRects}
    ${fade}
  </svg>`;
}
