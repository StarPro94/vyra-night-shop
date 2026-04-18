// Vyra Night Shop — Flyer A4 portrait (2480×3508 @ 300dpi).
// Usage: node scripts/generate-flyer-a4.mjs [url]
// Output: public/images/vyra-flyer-a4.{svg,png}

import path from "node:path";
import fs from "node:fs";
import {
  BRAND,
  SITE_FLAVOR,
  ADDRESS,
  DEFAULT_URL,
  CATEGORIES,
  HOURS,
  PHONE_DISPLAY,
} from "./lib/brand-tokens.mjs";
import { textPath, textBBox, svgDoc, rasterize, ensureDir } from "./lib/svg-utils.mjs";
import { renderVyraWordmark, renderNightShop } from "./lib/wordmark.mjs";
import { renderSerialNumber } from "./lib/serial-number.mjs";
import { renderFrameCorners } from "./lib/frame-corners.mjs";
import { renderSkyline } from "./lib/skyline.mjs";
import { renderMarqueeStrip } from "./lib/marquee-strip.mjs";
import { renderFloatingStickers } from "./lib/stickers.mjs";
import { buildQrGlowupSvg } from "./lib/qr-glowup.mjs";

const CANVAS_W = 2480;
const CANVAS_H = 3508;
const SIDE_MARGIN = 120;

// Extract the inner content of our own svgDoc wrapper so we can embed it inside the poster.
function extractInnerSvg(svgString) {
  const openMatch = svgString.match(/<svg[^>]*>/);
  if (!openMatch) throw new Error("SVG wrapper not found");
  const start = openMatch.index + openMatch[0].length;
  const end = svgString.lastIndexOf("</svg>");
  return svgString.slice(start, end);
}

// Chaque catégorie dans sa couleur du hero (src/components/Hero.astro:186-190).
function buildCategoriesLine({ cx, y, fontSize = 70 }) {
  const gap = 90;
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

function buildInfoBlock({ cx, y }) {
  // 4 lignes info : adresse · horaires · @insta · WhatsApp/tel
  // <text> system font. Tracking large, couleur gris-clair, séparateurs en vert.
  const lines = [
    { text: ADDRESS, color: BRAND.text },
    { text: `OUVERT DE ${HOURS.open} À ${HOURS.close} · 7J/7`, color: BRAND.textMuted },
    { text: `@VYRA_NIGHTSHOP · ${PHONE_DISPLAY}`, color: BRAND.vyra },
  ];
  const fs = 38;
  const lineHeight = fs * 1.8;
  return lines
    .map(
      (line, i) =>
        `<text x="${cx}" y="${y + i * lineHeight}" text-anchor="middle"
          font-family="Consolas, Menlo, 'Courier New', monospace"
          font-size="${fs}" font-weight="700" letter-spacing="4"
          fill="${line.color}">${escapeXml(line.text)}</text>`
    )
    .join("");
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

  // ── Layout ─────────────────────────────────────────────────────
  // Tous les Y sont des baselines pour textes, ou top-left pour blocs.
  const cx = CANVAS_W / 2;

  // ── Layout vertical (top → bottom) ─────────────────────────────
  // Serial tout en haut, VYRA + NIGHT SHOP + cat, QR au centre, CTA + info,
  // skyline + marquee en bas. Gaps calculés pour ne PAS se chevaucher.

  const serialY = 220;
  const serial = renderSerialNumber({
    cx, y: serialY, fontSize: 36, starColor: SITE_FLAVOR.saOrange,
  });

  const vyraFontSize = 520;
  const vyraBaseline = 800;
  const vyraWordmark = renderVyraWordmark({
    cx, baselineY: vyraBaseline, fontSize: vyraFontSize, color: BRAND.text,
  });

  const nightFontSize = 130;
  const nightBaseline = vyraBaseline + 140;   // 940
  const nightShop = renderNightShop({
    cx, baselineY: nightBaseline, fontSize: nightFontSize,
    color: BRAND.vyra, filterUrl: "flyer-neon-glow",
  });

  const catY = nightBaseline + 110;           // 1050
  const categoriesLine = buildCategoriesLine({ cx, y: catY, fontSize: 68 });

  // QR 1500×1500, scaled from core 1024. Y positionné avec une bonne marge
  // après la categories line.
  const qrSize = 1500;
  const qrCoreSvg = await buildQrGlowupSvg({ url, size: 1024, withFrame: false });
  const qrInner = extractInnerSvg(qrCoreSvg);
  const qrScale = qrSize / 1024;
  const qrX = (CANVAS_W - qrSize) / 2;
  const qrY = 1140;                            // QR ends at 2640
  const qrHalo = `<rect x="${qrX - 40}" y="${qrY - 40}"
    width="${qrSize + 80}" height="${qrSize + 80}" rx="24"
    fill="${BRAND.vyra}" opacity="0.18" filter="url(#flyer-qr-halo)"/>`;
  const qrEmbed = `<g transform="translate(${qrX}, ${qrY}) scale(${qrScale})">${qrInner}</g>`;

  const ctaY = qrY + qrSize + 110;             // 2750
  const ctaText = "SCAN POUR LE CATALOGUE";
  const ctaPath = textPath(ctaText, cx, ctaY, 80);
  const cta = `<path d="${ctaPath.d}" fill="${BRAND.vyra}"/>`;

  const arrowY = ctaY + 56;                    // 2806
  const arrow = `<text x="${cx}" y="${arrowY}" text-anchor="middle"
    font-family="Arial, sans-serif" font-size="44" fill="${BRAND.vyraLight}">▼</text>`;

  const infoY = ctaY + 130;                    // 2880, 3 lines at lineHeight 68 → 2880,2948,3016
  const infoBlock = buildInfoBlock({ cx, y: infoY });

  // Skyline juste au-dessus du marquee, variante site (multi-color enseignes).
  const skylineH = 220;
  const skylineY = 3188;
  const skyline = renderSkyline({
    x: 0, y: skylineY, width: CANVAS_W, height: skylineH, variant: "site",
  });

  const marqueeH = 100;
  const marqueeY = CANVAS_H - marqueeH;
  // Marquee orange comme le hero du site (echo GTA SA).
  const marquee = renderMarqueeStrip({
    x: 0, y: marqueeY, width: CANVAS_W, height: marqueeH, fontSize: 40,
    theme: "orange",
    messages: [
      "OUVERT 7J/7",
      "IMPORTS US & JP",
      "CBD PREMIUM",
      "LIVRAISON V-C",
    ],
  });

  // Stickers flottants inclinés autour du VYRA — feel hero du site.
  const stickers = renderFloatingStickers({
    fontSize: 48,
    positions: [
      { cx: 2100, cy: 340, rotation: -6 },  // top-right: SNACKS (orange)
      { cx: 400,  cy: 420, rotation: 5 },   // top-left: CBD & PUFF (vert)
      { cx: 420,  cy: 840, rotation: -4 },  // bottom-left: IMPORT US/JP (mauve)
      { cx: 2080, cy: 890, rotation: 7 },   // bottom-right: LIVRAISON (violet)
    ],
  });


  // Frame corners (4 L verts) — s'arrêtent au-dessus du marquee orange
  // pour ne pas chevaucher la bande de bas de page.
  const frameCorners = renderFrameCorners({
    x: 60,
    y: 60,
    width: CANVAS_W - 120,
    height: marqueeY - 60 - 20,   // laisse 20px d'air entre frame et marquee
    size: 120,
    thickness: 5,
  });

  // Fond radial + grain.
  const defs = `
    <radialGradient id="flyer-bg" cx="50%" cy="50%" r="85%">
      <stop offset="0%" stop-color="${BRAND.bg}"/>
      <stop offset="100%" stop-color="${BRAND.bgDeep}"/>
    </radialGradient>
    <filter id="flyer-qr-halo" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="flyer-neon-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b2"/>
      <feMerge>
        <feMergeNode in="b2"/>
        <feMergeNode in="b1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="flyer-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/>
    </filter>
    <pattern id="flyer-grain" x="0" y="0" width="256" height="256" patternUnits="userSpaceOnUse">
      <rect width="256" height="256" filter="url(#flyer-noise)"/>
    </pattern>`;

  const canvasBg = `<rect x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#flyer-bg)"/>`;
  const grain = `<rect x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#flyer-grain)" opacity="0.035"/>`;

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
      arrow +
      infoBlock +
      skyline +
      marquee +
      frameCorners +
      grain,
    { defs }
  );

  const svgPath = path.join(outputDir, "vyra-flyer-a4.svg");
  fs.writeFileSync(svgPath, svg, "utf-8");
  console.log(`SVG written: ${svgPath}`);

  const pngPath = path.join(outputDir, "vyra-flyer-a4.png");
  await rasterize(svg, pngPath, { width: CANVAS_W, height: CANVAS_H, density: 300 });
  console.log(`PNG written: ${pngPath}`);
  console.log(`URL: ${url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
