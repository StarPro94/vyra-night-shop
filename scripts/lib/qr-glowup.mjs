// Vyra Night Shop — QR glow-up builder.
// Produit un SVG carré 1024×1024 (core) ou 1200×1400 (with frame).
//
// Modules QR : fond noir uni, dots gradient vert, corners gradient vert, badge central
// VYRA + NIGHT SHOP, halo néon sous le QR, grain subtil. Catégories colorées en
// blanc avec séparateurs gris. Accents ponctuels rose (✦ gauche scan strip).

import { JSDOM } from "jsdom";
import { BRAND, SITE_FLAVOR, ADDRESS, HOURS, CATEGORIES } from "./brand-tokens.mjs";
import { textPath, textBBox, svgDoc } from "./svg-utils.mjs";
import { renderVyraWordmark } from "./wordmark.mjs";
import { renderSerialNumber } from "./serial-number.mjs";
import { renderFrameCorners } from "./frame-corners.mjs";

// ──────────────────────────────────────────────────────────────────
// JSDOM shim for qr-code-styling (needs DOM for its internal SVG API)
// ──────────────────────────────────────────────────────────────────
let _qrCodeStyling = null;
async function getQRCodeStyling() {
  if (_qrCodeStyling) return _qrCodeStyling;
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.self = dom.window;
  globalThis.XMLSerializer = dom.window.XMLSerializer;
  globalThis.HTMLElement = dom.window.HTMLElement;
  const mod = await import("qr-code-styling");
  _qrCodeStyling = mod.default;
  return _qrCodeStyling;
}

// Generate the raw QR SVG string, then strip the outer <svg> wrapper so it can
// be embedded inside a larger canvas. Keeps <defs>/<clipPath>/etc intact.
async function buildQrModulesSvg(url, size) {
  const QRCodeStyling = await getQRCodeStyling();
  const qr = new QRCodeStyling({
    jsdom: JSDOM,
    type: "svg",
    width: size,
    height: size,
    data: url,
    margin: 16,
    qrOptions: { errorCorrectionLevel: "H" },
    backgroundOptions: { color: BRAND.bg },
    dotsOptions: {
      type: "dots",
      gradient: {
        type: "linear",
        rotation: Math.PI / 2,
        colorStops: [
          { offset: 0, color: BRAND.vyra },
          { offset: 1, color: BRAND.vyraDark },
        ],
      },
    },
    cornersSquareOptions: {
      type: "dot",
      gradient: {
        type: "linear",
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: BRAND.vyraLight },
          { offset: 1, color: BRAND.vyraDark },
        ],
      },
    },
    cornersDotOptions: { type: "dot", color: BRAND.vyra },
  });
  const raw = (await qr.getRawData("svg")).toString();
  return { raw, rawSize: size };
}

// Strip the outer <svg>…</svg> and the XML prolog so the remaining fragment
// can be wrapped in a <g transform="translate(x,y)"> inside our own doc.
function extractSvgInner(raw) {
  const openMatch = raw.match(/<svg[^>]*>/);
  if (!openMatch) throw new Error("QR SVG opening tag not found");
  const bodyStart = openMatch.index + openMatch[0].length;
  const bodyEnd = raw.lastIndexOf("</svg>");
  return raw.slice(bodyStart, bodyEnd);
}

// Compose the central badge (VYRA + NIGHT SHOP + halo).
// Placed relative to the QR modules (cx, cy are in QR-local coords).
function buildCentralBadge({ qrSize }) {
  const cx = qrSize / 2;
  const cy = qrSize / 2;
  const logoW = qrSize * 0.34;
  const logoH = qrSize * 0.24;
  const logoX = cx - logoW / 2;
  const logoY = cy - logoH / 2;
  const radius = 12;

  // Mask padding: opaque black rectangle behind the badge stops QR dots from
  // encroaching. Error correction H (30%) easily absorbs this footprint.
  const maskPad = 28;
  const mask = `<rect x="${logoX - maskPad}" y="${logoY - maskPad}"
    width="${logoW + maskPad * 2}" height="${logoH + maskPad * 2}"
    fill="${BRAND.bg}" rx="${radius + 4}"/>`;

  // Neon halo behind the badge only (never on QR modules).
  const haloRect = `<rect x="${logoX}" y="${logoY}"
    width="${logoW}" height="${logoH}" rx="${radius}"
    fill="none" stroke="${BRAND.vyraLight}" stroke-width="6" opacity="0.35"
    filter="url(#qr-badge-halo)"/>`;

  // Badge frame + subtle inner vyraDim tint for depth.
  const frame = `<rect x="${logoX}" y="${logoY}"
    width="${logoW}" height="${logoH}" rx="${radius}"
    fill="${BRAND.bg}" stroke="${BRAND.vyra}" stroke-width="2.5"/>`;
  const innerTint = `<rect x="${logoX + 4}" y="${logoY + 4}"
    width="${logoW - 8}" height="${logoH - 8}" rx="${radius - 2}"
    fill="${BRAND.vyraDim}" opacity="0.25"/>`;

  // VYRA + R-tail
  const vyraFontSize = logoH * 0.62;
  const vyraBaselineY = logoY + logoH * 0.66;
  const wordmark = renderVyraWordmark({
    cx,
    baselineY: vyraBaselineY,
    fontSize: vyraFontSize,
    color: BRAND.text,
  });

  // NIGHT SHOP
  const nightFontSize = logoH * 0.16;
  const nightBaselineY = logoY + logoH * 0.92;
  const nightText = textPath("NIGHT SHOP", cx, nightBaselineY, nightFontSize);
  const nightSvg = `<path d="${nightText.d}" fill="${BRAND.vyra}"/>`;

  return `${mask}${haloRect}${frame}${innerTint}${wordmark.svg}${nightSvg}`;
}

// Bottom "SCAN & COMMANDE" strip — ✦ symétriques en vert Vyra des deux côtés.
function buildScanStrip({ cx, y }) {
  const text = `SCAN & COMMANDE · ${HOURS.open}-${HOURS.close} · 7J/7`;
  const fontSize = 34;
  const tp = textPath(text.replace(/·/g, "•"), cx, y, fontSize);

  const sparkleSize = fontSize * 0.8;
  const leftX = cx - tp.width / 2 - sparkleSize - 20;
  const rightX = cx + tp.width / 2 + 20;

  const sparkle = (x, color) =>
    `<text x="${x}" y="${y}" text-anchor="start"
           font-family="Arial, sans-serif" font-size="${sparkleSize}"
           fill="${color}">✦</text>`;

  return `<g id="scan-strip">
    <path d="${tp.d}" fill="${BRAND.text}"/>
    ${sparkle(leftX, BRAND.vyra)}
    ${sparkle(rightX, BRAND.vyra)}
  </g>`;
}

// Subtle noise/grain overlay — replicates .noise-overlay from global.css.
function buildGrainOverlay({ width, height, opacity = 0.025 }) {
  return `<rect x="0" y="0" width="${width}" height="${height}"
    fill="url(#qr-grain)" opacity="${opacity}"/>`;
}

// ──────────────────────────────────────────────────────────────────
// Main builder
// ──────────────────────────────────────────────────────────────────
export async function buildQrGlowupSvg({
  url,
  size = 1024,
  withFrame = true,
} = {}) {
  const { raw } = await buildQrModulesSvg(url, size);
  const qrInner = extractSvgInner(raw);

  // Core SVG (QR modules + central badge). Coordinates are QR-local (0..size).
  const centralBadge = buildCentralBadge({ qrSize: size });

  if (!withFrame) {
    // Just the QR + badge, no outer frame. Used when embedded in posters.
    const defs = `
      <filter id="qr-badge-halo" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6"/>
      </filter>
      <filter id="qr-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/>
      </filter>
      <pattern id="qr-grain" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        <rect width="200" height="200" filter="url(#qr-noise)"/>
      </pattern>`;
    return svgDoc(size, size, qrInner + centralBadge + buildGrainOverlay({ width: size, height: size }), { defs });
  }

  // Framed layout:
  //   canvas: 1200 × 1400
  //   QR placed at (88, 192) size 1024×1024
  //   Top 192px → serial number + "NIGHT SHOP QR"
  //   Bottom 208px → SCAN strip + frame corners extend around the full frame
  const canvasW = 1200;
  const canvasH = 1400;
  const qrX = (canvasW - size) / 2;
  const qrY = 192;

  const defs = `
    <filter id="qr-soft-halo" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
    <filter id="qr-badge-halo" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
    <filter id="qr-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/>
    </filter>
    <pattern id="qr-grain" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
      <rect width="200" height="200" filter="url(#qr-noise)"/>
    </pattern>
    <radialGradient id="frame-bg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="${BRAND.bg}"/>
      <stop offset="100%" stop-color="${BRAND.bgDeep}"/>
    </radialGradient>`;

  const canvasBg = `<rect x="0" y="0" width="${canvasW}" height="${canvasH}" fill="url(#frame-bg)"/>`;

  // Neon halo glow under the QR block.
  const qrHalo = `<rect x="${qrX - 24}" y="${qrY - 24}"
    width="${size + 48}" height="${size + 48}" rx="16"
    fill="${BRAND.vyra}" opacity="0.18" filter="url(#qr-soft-halo)"/>`;

  // Serial number near top.
  const serialY = 96;
  const serial = renderSerialNumber({
    cx: canvasW / 2,
    y: serialY,
    fontSize: 20,
  });

  // Catégories de l'offre entre serial-number et QR — en blanc, séparateurs "·"
  // gris neutre dans des gaps fixes pour un spacing propre.
  const catY = 158;
  const catFontSize = 32;
  const catGap = 48;
  const catWidths = CATEGORIES.map((c) => textBBox(c.label, catFontSize).width);
  const totalCatWidth =
    catWidths.reduce((a, b) => a + b, 0) + (CATEGORIES.length - 1) * catGap;
  let catX = canvasW / 2 - totalCatWidth / 2;
  const categoriesParts = [];
  CATEGORIES.forEach((cat, i) => {
    const p = textPath(cat.label, catX, catY, catFontSize, "left");
    categoriesParts.push(`<path d="${p.d}" fill="${BRAND.text}"/>`);
    catX += catWidths[i];
    if (i < CATEGORIES.length - 1) {
      const sepCx = catX + catGap / 2;
      categoriesParts.push(
        `<text x="${sepCx}" y="${catY}" text-anchor="middle" ` +
        `font-family="Arial, sans-serif" font-size="${catFontSize}" ` +
        `fill="${BRAND.textSubtle}">·</text>`
      );
      catX += catGap;
    }
  });
  const categoriesLine = categoriesParts.join("");

  // Bottom scan strip baseline.
  const scanY = qrY + size + 130;
  const scanStrip = buildScanStrip({ cx: canvasW / 2, y: scanY });

  // Frame corners extend along the full canvas edges (not just QR).
  const frameCorners = renderFrameCorners({
    x: 32,
    y: 32,
    width: canvasW - 64,
    height: canvasH - 64,
    size: 64,
    thickness: 3,
  });

  // QR modules embedded via translate (keeps internal defs/clipPaths working
  // because qr-code-styling references them by absolute id inside the fragment).
  const qrEmbed = `<g transform="translate(${qrX}, ${qrY})">${qrInner}${centralBadge}</g>`;

  // Grain overlay across the full canvas.
  const grain = buildGrainOverlay({ width: canvasW, height: canvasH, opacity: 0.035 });

  return svgDoc(
    canvasW,
    canvasH,
    canvasBg + qrHalo + qrEmbed + serial + categoriesLine + scanStrip + frameCorners + grain,
    { defs }
  );
}
