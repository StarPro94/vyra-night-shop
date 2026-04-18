// Vyra Night Shop — Serial-number strip (top of QR frame / flyer header).
// "★ 14 RUE LEVEILLÉ · 02600 VILLERS-COTTERÊTS ★" — echo du hero.
// Étoiles en vert Vyra (dominante brand), texte en gris neutre.

import { BRAND, ADDRESS } from "./brand-tokens.mjs";

// Render the serial-number strip centered at cx, with a given y baseline.
// fontSize suggestion: 14-22px depending on canvas.
export function renderSerialNumber({
  cx,
  y,
  fontSize = 18,
  text = ADDRESS,
  color = BRAND.textMuted,
  starColor = BRAND.vyra,
}) {
  // <text> element with system-font fallback — resvg renders Helvetica/Arial cleanly
  // and avoids bundling Space Mono via opentype.js (600 KB overhead).
  return `<g id="serial-number">
    <text x="${cx}" y="${y}" text-anchor="middle"
          font-family="Consolas, Menlo, 'Courier New', monospace"
          font-size="${fontSize}"
          font-weight="700"
          letter-spacing="3"
          fill="${color}">
      <tspan fill="${starColor}">★</tspan>
      <tspan dx="10">${escapeXml(text)}</tspan>
      <tspan dx="10" fill="${starColor}">★</tspan>
    </text>
  </g>`;
}

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
