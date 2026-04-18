// Vyra Night Shop — Marquee ticker strip.
// theme "green"  : bande vert Vyra (brand strict)
// theme "orange" : bande sa-orange (echo du hero site GTA SA)
// Texte noir contrasté dans les deux cas, séparateurs ✦ plus sombres.

import { BRAND, SITE_FLAVOR, MARQUEE_MESSAGES } from "./brand-tokens.mjs";

const THEMES = {
  green: { bg: BRAND.vyra, sep: BRAND.vyraDark },
  orange: { bg: SITE_FLAVOR.saOrange, sep: "#A15F2E" },
};

export function renderMarqueeStrip({
  x,
  y,
  width,
  height,
  messages = MARQUEE_MESSAGES,
  fontSize = null,
  theme = "green",
}) {
  const fs = fontSize || Math.floor(height * 0.42);
  const { bg, sep } = THEMES[theme] || THEMES.green;
  const fg = BRAND.bg;
  const borderColor = BRAND.bgDeep;

  const items = [];
  messages.forEach((msg, i) => {
    if (i > 0) items.push({ text: "✦", color: sep });
    items.push({ text: msg.toUpperCase(), color: fg });
  });

  const tspans = items
    .map((it, i) => {
      const dx = i === 0 ? 0 : 32;
      return `<tspan dx="${dx}" fill="${it.color}">${escapeXml(it.text)}</tspan>`;
    })
    .join("");

  const textY = y + height / 2 + fs * 0.34;

  return `<g id="marquee-strip">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${bg}"/>
    <rect x="${x}" y="${y}" width="${width}" height="3" fill="${borderColor}"/>
    <rect x="${x}" y="${y + height - 3}" width="${width}" height="3" fill="${borderColor}"/>
    <text x="${x + width / 2}" y="${textY}" text-anchor="middle"
          font-family="Arial Black, Arial, sans-serif"
          font-size="${fs}" font-weight="900"
          letter-spacing="2">${tspans}</text>
  </g>`;
}

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
