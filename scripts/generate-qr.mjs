import { JSDOM } from "jsdom";
import sharp from "sharp";
import opentype from "opentype.js";
import fs from "node:fs";
import path from "node:path";

// Provide a DOM for qr-code-styling before importing it.
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.self = dom.window;
globalThis.XMLSerializer = dom.window.XMLSerializer;
globalThis.HTMLElement = dom.window.HTMLElement;

const { default: QRCodeStyling } = await import("qr-code-styling");

const url = process.argv[2] || "https://vyra-night-shop.vercel.app";
const outputDir = path.resolve("public/images");
const size = 1024;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Vyra brand colors
const vyra = "#66BB6A";
const vyraDark = "#388E3C";
const bg = "#0A0A0A";
const text = "#F5F5F5";

// ---- Load Pricedown font and vectorize logo text ----
// OTF kept in scripts/assets/ (gitignored, desktop-license usage only).
// opentype.js needs the raw OTF/TTF — WOFF2 would require extra decoding.
const fontSrc = path.resolve("scripts/assets/Pricedown-Bl.otf");
if (!fs.existsSync(fontSrc)) {
  console.error(`Font not found: ${fontSrc}`);
  console.error("Place Pricedown Bl.otf in scripts/assets/Pricedown-Bl.otf");
  process.exit(1);
}
const font = opentype.loadSync(fontSrc);

/**
 * Generate an SVG <path> for text aligned to a specific anchor.
 * align: "center" centers the text at anchorX, "right" aligns end at anchorX.
 */
function textPath(str, anchorX, baselineY, fontSize, align = "center") {
  const p = font.getPath(str, 0, 0, fontSize);
  const bb = p.getBoundingBox();
  const textWidth = bb.x2 - bb.x1;
  let offsetX;
  if (align === "right") {
    offsetX = anchorX - bb.x2;
  } else {
    offsetX = anchorX - (bb.x1 + textWidth / 2);
  }
  const positioned = font.getPath(str, offsetX, baselineY, fontSize);
  return { d: positioned.toPathData(3), width: textWidth };
}

// Generate the QR code (without image — logo injected post-process).
const qrCode = new QRCodeStyling({
  jsdom: JSDOM,
  type: "svg",
  width: size,
  height: size,
  data: url,
  margin: 16,
  qrOptions: {
    errorCorrectionLevel: "H",
  },
  backgroundOptions: {
    color: bg,
  },
  dotsOptions: {
    type: "dots",
    gradient: {
      type: "linear",
      rotation: Math.PI / 2,
      colorStops: [
        { offset: 0, color: vyra },
        { offset: 1, color: vyraDark },
      ],
    },
  },
  cornersSquareOptions: {
    type: "dot",
    color: vyra,
  },
  cornersDotOptions: {
    type: "dot",
    color: vyra,
  },
});

const rawSvg = (await qrCode.getRawData("svg")).toString();

// ---- Build logo badge: rectangular with real VYRA + NIGHT SHOP text ----
// Logo footprint: wider than tall to host the stacked wordmark.
const logoW = size * 0.34;  // 348px for 1024 QR
const logoH = size * 0.24;  // 246px
const logoX = (size - logoW) / 2;
const logoY = (size - logoH) / 2;
const radius = 12;

// Mask a generous rectangle behind the logo so surrounding dots don't bleed.
const maskPad = 28;
const mask = `<rect
  x="${logoX - maskPad}" y="${logoY - maskPad}"
  width="${logoW + maskPad * 2}" height="${logoH + maskPad * 2}"
  fill="${bg}" rx="${radius + 4}"/>`;

// Text rendering: VYRA big & white, NIGHT SHOP smaller & Vyra green, stacked.
const vyraFontSize = logoH * 0.62;          // ~152px for 246 badge
const nightFontSize = logoH * 0.16;         // ~39px

const vyraCenterX = size / 2;
const vyraBaselineY = logoY + logoH * 0.66; // slight vertical weighting
const vyraText = textPath("VYRA", vyraCenterX, vyraBaselineY, vyraFontSize);

// ---- Add GTA-style tail on the R ----
// Pricedown Bl's native R has no tail, but the iconic GTA logo does.
// We draw a diagonal extension from the bottom of R's right leg.
const vyraBbox = font.getPath("VYRA", 0, 0, vyraFontSize).getBoundingBox();
const vyraLeft = vyraCenterX - (vyraBbox.x2 - vyraBbox.x1) / 2;
const vyPath = font.getPath("VY", 0, 0, vyraFontSize);
const vyrPath = font.getPath("VYR", 0, 0, vyraFontSize);
const rLeftX = vyraLeft + vyPath.getBoundingBox().x2;
const rRightX = vyraLeft + vyrPath.getBoundingBox().x2;
const rWidth = rRightX - rLeftX;
// Match the hero logo: a solid horizontal bar BELOW the R, extending LEFT
// from the bottom of R's right leg, with a diagonal cut on the top-left
// (mirrors the Pricedown-style L-shaped extension visible in the wordmark).
const barH = vyraFontSize * 0.18;         // bar thickness
const barRightX = rRightX;                // aligns with R's right edge
const barLeftX = rLeftX;                  // extends to R's left edge
const barTopY = vyraBaselineY;            // exactly at baseline (no overlap)
const barBottomY = vyraBaselineY + barH;
const cutW = barH * 0.7;                  // diagonal cut on top-left
const tailPath = `M ${barLeftX + cutW} ${barTopY}
  L ${barRightX} ${barTopY}
  L ${barRightX} ${barBottomY}
  L ${barLeftX} ${barBottomY}
  Z`;

// "NIGHT SHOP" centered — feels more balanced inside the QR badge than the
// right-aligned hero layout
const nightBaselineY = logoY + logoH * 0.92;
const nightText = textPath("NIGHT SHOP", size / 2, nightBaselineY, nightFontSize);

const logo = `
  <rect x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}"
        fill="${bg}" stroke="${vyra}" stroke-width="2.5" rx="${radius}"/>
  <path d="${vyraText.d}" fill="${text}"/>
  <path d="${tailPath}" fill="${text}"/>
  <path d="${nightText.d}" fill="${vyra}"/>
`;

const styledSvg = rawSvg.replace("</svg>", `${mask}${logo}</svg>`);

// Write SVG
const svgPath = path.join(outputDir, "vyra-qr-code.svg");
fs.writeFileSync(svgPath, styledSvg, "utf-8");
console.log(`SVG QR Code saved: ${svgPath}`);

// Rasterize SVG -> PNG via sharp
const pngPath = path.join(outputDir, "vyra-qr-code.png");
await sharp(Buffer.from(styledSvg), { density: 300 })
  .resize(size, size)
  .png()
  .toFile(pngPath);
console.log(`PNG QR Code saved: ${pngPath}`);
console.log(`URL: ${url}`);
