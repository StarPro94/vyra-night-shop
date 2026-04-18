// Vyra Night Shop — Story Instagram portrait (1080×1920 = 9:16).
// Safe zones : top 220px (username/timestamp IG), bottom 300px (reply bar).
// Usage: node scripts/generate-story-ig.mjs [url]
// Output: public/images/vyra-story-ig.{svg,png}

import path from "node:path";
import fs from "node:fs";
import {
  BRAND,
  SITE_FLAVOR,
  ADDRESS,
  DEFAULT_URL,
  CATEGORIES,
  HOURS,
} from "./lib/brand-tokens.mjs";
import { textPath, textBBox, svgDoc, rasterize, ensureDir } from "./lib/svg-utils.mjs";
import { renderVyraWordmark, renderNightShop } from "./lib/wordmark.mjs";
import { renderSerialNumber } from "./lib/serial-number.mjs";
import { renderFrameCorners } from "./lib/frame-corners.mjs";
import { renderSkyline } from "./lib/skyline.mjs";
import { renderMarqueeStrip } from "./lib/marquee-strip.mjs";
import { renderFloatingStickers } from "./lib/stickers.mjs";
import { buildQrGlowupSvg } from "./lib/qr-glowup.mjs";

const CANVAS_W = 1080;
const CANVAS_H = 1920;

function extractInnerSvg(svgString) {
  const openMatch = svgString.match(/<svg[^>]*>/);
  if (!openMatch) throw new Error("SVG wrapper not found");
  const start = openMatch.index + openMatch[0].length;
  const end = svgString.lastIndexOf("</svg>");
  return svgString.slice(start, end);
}

// Chaque catégorie dans sa couleur du hero.
function buildCategoriesLine({ cx, y, fontSize = 34 }) {
  const gap = 42;
  const widths = CATEGORIES.map((c) => textBBox(c.label, fontSize).width);
  const total = widths.reduce((a, b) => a + b, 0) + (CATEGORIES.length - 1) * gap;
  let x = cx - total / 2;
  const parts = [];
  CATEGORIES.forEach((cat, i) => {
    const p = textPath(cat.label, x, y, fontSize, "left");
    parts.push(`<path d="${p.d}" fill="${cat.color}"/>`);
    x += widths[i];
    if (i < CATEGORIES.length - 1) {
      const sepCx = x + gap / 2;
      parts.push(
        `<text x="${sepCx}" y="${y}" text-anchor="middle" ` +
        `font-family="Arial, sans-serif" font-size="${fontSize}" ` +
        `fill="${BRAND.textSubtle}">·</text>`
      );
      x += gap;
    }
  });
  return parts.join("");
}

// Info block avec @insta mis en valeur (dernière ligne plus grande, vert vif).
function buildInfoBlock({ cx, y }) {
  const addressY = y;
  const hoursY = y + 46;
  const handleY = y + 115;
  return `
    <text x="${cx}" y="${addressY}" text-anchor="middle"
      font-family="Consolas, Menlo, 'Courier New', monospace"
      font-size="22" font-weight="700" letter-spacing="3"
      fill="${BRAND.text}">${escapeXml(ADDRESS)}</text>
    <text x="${cx}" y="${hoursY}" text-anchor="middle"
      font-family="Consolas, Menlo, 'Courier New', monospace"
      font-size="22" font-weight="700" letter-spacing="3"
      fill="${BRAND.textMuted}">${escapeXml(`${HOURS.open}–${HOURS.close} · 7J/7 · LIVRAISON`)}</text>
    <text x="${cx}" y="${handleY}" text-anchor="middle"
      font-family="Arial Black, Arial, sans-serif"
      font-size="40" font-weight="900" letter-spacing="3"
      fill="${BRAND.vyra}">@VYRA_NIGHTSHOP</text>`;
}

function escapeXml(s) {
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function main() {
  const url = process.argv[2] && !process.argv[2].startsWith("--")
    ? process.argv[2]
    : DEFAULT_URL;
  const outputDir = path.resolve("public/images");
  ensureDir(outputDir);

  const cx = CANVAS_W / 2;

  // ── Layout vertical (top → bottom) ──────────────────────────────
  // Safe zone top: 220. On démarre le serial-number juste en-dessous.
  const serialY = 255;
  const serial = renderSerialNumber({
    cx, y: serialY, fontSize: 18, starColor: SITE_FLAVOR.saOrange,
  });

  // VYRA réduit pour laisser place à 4 stickers autour + info block aéré.
  const vyraFontSize = 210;
  const vyraBaseline = 460;
  const vyraWordmark = renderVyraWordmark({
    cx, baselineY: vyraBaseline, fontSize: vyraFontSize, color: BRAND.text,
  });

  const nightFontSize = 54;
  const nightBaseline = vyraBaseline + 62;     // 522
  const nightShop = renderNightShop({
    cx, baselineY: nightBaseline, fontSize: nightFontSize,
    color: BRAND.vyra, filterUrl: "story-neon-glow",
  });

  const catY = nightBaseline + 58;             // 580
  const categoriesLine = buildCategoriesLine({ cx, y: catY, fontSize: 28 });

  // QR 640×640 centré. Plus petit que précédemment pour dégager du bas.
  const qrSize = 640;
  const qrCoreSvg = await buildQrGlowupSvg({ url, size: 1024, withFrame: false });
  const qrInner = extractInnerSvg(qrCoreSvg);
  const qrScale = qrSize / 1024;
  const qrX = (CANVAS_W - qrSize) / 2;
  const qrY = catY + 38;                        // 618, ends at 1258
  const qrHalo = `<rect x="${qrX - 20}" y="${qrY - 20}"
    width="${qrSize + 40}" height="${qrSize + 40}" rx="16"
    fill="${BRAND.vyra}" opacity="0.22" filter="url(#story-qr-halo)"/>`;
  const qrEmbed = `<g transform="translate(${qrX}, ${qrY}) scale(${qrScale})">${qrInner}</g>`;

  // CTA sous QR.
  const ctaY = qrY + qrSize + 62;               // 1320
  const ctaText = "SCAN POUR COMMANDER";
  const ctaPath = textPath(ctaText, cx, ctaY, 44);
  const cta = `<path d="${ctaPath.d}" fill="${BRAND.vyra}"/>`;

  // Info block aéré. @insta bien visible en dernière ligne, gros + vert.
  const infoY = ctaY + 48;                      // 1368 (address, hours, then @insta bigger)
  const infoBlock = buildInfoBlock({ cx, y: infoY });

  // Skyline site-flavor (multi-color enseignes).
  const skylineH = 90;
  const skylineY = 1620;                        // ends at 1710
  const skyline = renderSkyline({
    x: 0, y: skylineY, width: CANVAS_W, height: skylineH, variant: "site",
  });

  // Marquee orange à la toute fin.
  const marqueeH = 70;
  const marqueeY = CANVAS_H - marqueeH;         // 1850
  const marquee = renderMarqueeStrip({
    x: 0, y: marqueeY, width: CANVAS_W, height: marqueeH,
    messages: ["OUVERT 7J/7", "LIVRAISON V-C", "SNACKS US/JP", "CBD PREMIUM"],
    fontSize: 22, theme: "orange",
  });

  // 4 stickers flottants — 2 en haut (corners), 2 au milieu de VYRA (sides).
  // Placés aux edges gauches/droits du canvas pour ne pas chevaucher le wordmark.
  const stickers = renderFloatingStickers({
    fontSize: 22,
    positions: [
      { cx: 920, cy: 315, rotation: -6 },  // top-right: SNACKS (orange)
      { cx: 160, cy: 355, rotation: 5 },   // top-left: CBD & PUFF (vert)
      { cx: 170, cy: 525, rotation: -4 },  // mid-left: IMPORT US/JP (mauve) — hauteur NIGHT SHOP
      { cx: 910, cy: 505, rotation: 7 },   // mid-right: LIVRAISON (violet)
    ],
  });

  // Frame corners discrets sur canvas (pas sur safe zones).
  const frameCorners = renderFrameCorners({
    x: 40, y: 230, width: CANVAS_W - 80, height: CANVAS_H - 230 - 310,
    size: 56, thickness: 3,
  });

  const defs = `
    <radialGradient id="story-bg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="${BRAND.bg}"/>
      <stop offset="100%" stop-color="${BRAND.bgDeep}"/>
    </radialGradient>
    <filter id="story-qr-halo" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
    <filter id="story-neon-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2" result="b1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b2"/>
      <feMerge>
        <feMergeNode in="b2"/>
        <feMergeNode in="b1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="story-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/>
    </filter>
    <pattern id="story-grain" x="0" y="0" width="256" height="256" patternUnits="userSpaceOnUse">
      <rect width="256" height="256" filter="url(#story-noise)"/>
    </pattern>`;

  const canvasBg = `<rect x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#story-bg)"/>`;
  const grain = `<rect x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#story-grain)" opacity="0.035"/>`;

  const svg = svgDoc(
    CANVAS_W,
    CANVAS_H,
    canvasBg +
      qrHalo +
      qrEmbed +
      serial +
      vyraWordmark.svg +
      nightShop.svg +
      stickers +
      categoriesLine +
      cta +
      infoBlock +
      skyline +
      marquee +
      frameCorners +
      grain,
    { defs }
  );

  const svgPath = path.join(outputDir, "vyra-story-ig.svg");
  fs.writeFileSync(svgPath, svg, "utf-8");
  console.log(`SVG written: ${svgPath}`);

  const pngPath = path.join(outputDir, "vyra-story-ig.png");
  await rasterize(svg, pngPath, { width: CANVAS_W, height: CANVAS_H, density: 300 });
  console.log(`PNG written: ${pngPath}`);
  console.log(`URL: ${url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
