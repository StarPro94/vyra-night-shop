// Vyra Night Shop — VYRA wordmark + NIGHT SHOP.
// On utilise le R Pricedown natif (sans tail custom). La tentative précédente de
// simuler la queue GTA via une barre horizontale manuelle ne rendait pas bien hors
// contexte web où le feature OpenType ss01 fait le boulot proprement.

import { textPath } from "./svg-utils.mjs";
import { BRAND } from "./brand-tokens.mjs";

// Render the VYRA wordmark (Pricedown Black, natural glyph, no manual tail).
// Returns an SVG fragment (<g>…</g>) ready to embed.
export function renderVyraWordmark({
  cx,
  baselineY,
  fontSize,
  color = BRAND.text,
  id = "vyra-wordmark",
}) {
  const vyraText = textPath("VYRA", cx, baselineY, fontSize);
  return {
    svg: `<g id="${id}"><path d="${vyraText.d}" fill="${color}"/></g>`,
    width: vyraText.width,
    height: vyraText.height,
  };
}

// Render the NIGHT SHOP secondary wordmark. Neon glow optional (filter url must exist in <defs>).
export function renderNightShop({
  cx,
  baselineY,
  fontSize,
  color = BRAND.vyra,
  filterUrl = null,
  align = "center",
  id = "night-shop",
}) {
  const t = textPath("NIGHT SHOP", cx, baselineY, fontSize, align);
  const filterAttr = filterUrl ? ` filter="url(#${filterUrl})"` : "";
  return {
    svg: `<g id="${id}"${filterAttr}><path d="${t.d}" fill="${color}"/></g>`,
    width: t.width,
    height: t.height,
  };
}

// Reusable neon-glow filter definition (green). Place inside <defs>.
export function neonGlowFilterDef(id = "neon-glow-green") {
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="2.5" result="blur1"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2"/>
    <feMerge>
      <feMergeNode in="blur2"/>
      <feMergeNode in="blur1"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>`;
}
