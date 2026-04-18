// Vyra Night Shop — Brand tokens for print/social generators.
// Source de vérité: src/styles/global.css + src/data/site.ts.
// Dupliqué ici car l'import TS depuis MJS demande tsx/esbuild (dép supplémentaire).

// Palette BRAND — vert + noir TRÈS dominants.
// C'est la vraie DA boutique. Aucun accent extérieur ne doit empiéter.
export const BRAND = {
  bg: "#0A0A0A",
  bgDeep: "#050505",
  surface: "#141414",
  surfaceBorder: "#2A2A2A",
  text: "#F5F5F5",
  textMuted: "#B3B3B3",
  textSubtle: "#808080",
  vyra: "#66BB6A",
  vyraLight: "#81C784",
  vyraDark: "#388E3C",
  vyraDim: "#1B3A1B",
  neonLive: "#4ADE80",
};

// Accents site-flavor: orange/violet/mauve du site GTA SA.
// Réservés à la variante "accent" en micro-touches homéopathiques.
export const SITE_FLAVOR = {
  saOrange: "#E8935A",
  saViolet: "#9B6BB0",
  saVioletLight: "#B388C9",
  saMauve: "#D4849A",
  saTan: "#D4A76A",
};


export const ADDRESS = "14 RUE LEVEILLÉ · 02600 VILLERS-COTTERÊTS";

// Catégories affichées sur le site (siteConfig.categories.label + hero).
// Chacune garde son code couleur (voir CATEGORY_COLORS ci-dessous).
// "IMPORTS" sans accent pour matcher le hero et éviter les soucis glyph Pricedown.
export const CATEGORIES = [
  { label: "SNACKS", color: "#E8935A" },        // sa-orange
  { label: "BOISSONS", color: "#66BB6A" },      // vyra
  { label: "PUFF & CBD", color: "#D4849A" },    // sa-mauve
  { label: "IMPORTS", color: "#B388C9" },       // sa-violet-light
];

// Miroir de siteConfig.marqueeMessages (src/data/site.ts).
// À re-synchroniser si le fichier source change.
export const MARQUEE_MESSAGES = [
  "Ouvert 7j/7 jusqu'à 02h",
  "Monster & sodas import USA",
  "Ramen & snacks Japon",
  "CBD premium & puff nouveaux goûts",
  "Livraison à Villers-Cotterêts",
  "Paiement CB / espèces / sans contact",
];

export const HOURS = { open: "18:00", close: "02:00" };
export const DEFAULT_URL = "https://vyra-night-shop.vercel.app";
