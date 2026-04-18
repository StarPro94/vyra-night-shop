// Vyra Night Shop — Floating stickers (inspirés du hero site).
// Petits badges inclinés avec border coloré + fond translucide + label en majuscules.
// Reprend le feel .sticker de src/styles/global.css (hero tiles autour du VYRA).

import { BRAND, SITE_FLAVOR } from "./brand-tokens.mjs";

// Quatre stickers canoniques (order matches hero floating order).
export const CANONICAL_STICKERS = [
  { label: "SNACKS", color: SITE_FLAVOR.saOrange, rotation: -5 },
  { label: "CBD & PUFF", color: BRAND.vyra, rotation: 4 },
  { label: "IMPORT US/JP", color: SITE_FLAVOR.saMauve, rotation: -3 },
  { label: "LIVRAISON", color: SITE_FLAVOR.saVioletLight, rotation: 6 },
];

// Render a single sticker at position {cx, cy} with given rotation.
// fontSize controls overall scaling. Uses system font (Arial Black) for legibility.
export function renderSticker({
  cx,
  cy,
  label,
  color,
  rotation = 0,
  fontSize = 36,
  padX = null,
  padY = null,
}) {
  const px = padX ?? fontSize * 0.6;
  const py = padY ?? fontSize * 0.35;
  // Approx width via char count (Arial Black, caps, letter-spacing).
  // Not pixel-perfect but visually balanced — paired with generous padding.
  const charW = fontSize * 0.72;
  const textW = label.length * charW;
  const w = textW + px * 2;
  const h = fontSize + py * 2;

  return `<g transform="translate(${cx}, ${cy}) rotate(${rotation})">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4"
          fill="rgba(10,10,10,0.72)" stroke="${color}" stroke-width="2"/>
    <text x="0" y="${fontSize * 0.34}" text-anchor="middle"
          font-family="Arial Black, Arial, sans-serif"
          font-size="${fontSize}" font-weight="900"
          letter-spacing="1.5" fill="${color}">${escapeXml(label)}</text>
  </g>`;
}

// Render the 4 canonical stickers at 4 positions around a central focal point.
// positions is an array of {cx, cy, rotation?} — sticker labels rotate through them.
export function renderFloatingStickers({ positions, fontSize = 36 }) {
  return positions
    .map((pos, i) => {
      const st = CANONICAL_STICKERS[i % CANONICAL_STICKERS.length];
      return renderSticker({
        cx: pos.cx,
        cy: pos.cy,
        label: st.label,
        color: st.color,
        rotation: pos.rotation ?? st.rotation,
        fontSize,
      });
    })
    .join("");
}

function escapeXml(s) {
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
