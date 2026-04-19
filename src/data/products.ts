import type { Category } from "./site";

export interface Product {
  name: string;
  category: Category;
  price: number | "variable";
  description?: string;
  image?: string;
  badge?: "nouveau" | "populaire" | "import-usa" | "import-japon";
  options?: string[];
}

export const products: Product[] = [
  // ─── Snacks ─────────────────────────────────────────
  { name: "Barbe à papa", category: "snacks", price: 2.8 },
  { name: "Barre céréales", category: "snacks", price: 1.8 },
  { name: "Buenos Dias", category: "snacks", price: 2.0 },
  { name: "Carambar", category: "snacks", price: 0.2 },
  { name: "Cheetos", category: "snacks", price: 2.5, badge: "import-usa" },
  { name: "Chips Bretz", category: "snacks", price: 3.5 },
  { name: "Cookie", category: "snacks", price: 2.5 },
  { name: "Fini (bonbons)", category: "snacks", price: 2.0 },
  { name: "Hello Panda", category: "snacks", price: 2.0, badge: "import-japon" },
  { name: "Kinder Crispy", category: "snacks", price: 5.0 },
  { name: "Kinder Cornetti", category: "snacks", price: 6.5 },
  { name: "Kinder Tronky", category: "snacks", price: 2.0 },
  { name: "Malabar", category: "snacks", price: 0.2 },
  { name: "Mochi", category: "snacks", price: 5.0, badge: "import-japon" },
  { name: "Plantin", category: "snacks", price: 1.5 },
  { name: "Pop-corn import", category: "snacks", price: 5.5, badge: "import-usa" },
  { name: "Reese's Classique", category: "snacks", price: 2.0, badge: "import-usa" },
  { name: "Reese's Premium", category: "snacks", price: 3.5, badge: "populaire" },

  // ─── Softs ──────────────────────────────────────────
  { name: "Red Bull", category: "softs", price: 2.5, badge: "populaire" },
  { name: "Red Bull Goût", category: "softs", price: 3.0 },
  { name: "Monster", category: "softs", price: 2.5, badge: "populaire" },
  { name: "Crazy Tiger", category: "softs", price: 3.9 },
  { name: "Canette soft", category: "softs", price: 1.5 },
  { name: "Canette classique", category: "softs", price: 1.5 },
  { name: "Canette import", category: "softs", price: 3.0, badge: "import-usa" },
  { name: "Bouteille soft", category: "softs", price: 3.5 },
  { name: "Jus", category: "softs", price: 3.0 },
  { name: "Cristaline 1L", category: "softs", price: 2.0 },
  { name: "Cristaline 50cl", category: "softs", price: 1.0 },

  // ─── Alcools — Bières ────────────────────────────────
  { name: "Desperados bouteille", category: "alcools", price: 4.0, badge: "populaire" },
  { name: "Desperados canette", category: "alcools", price: 3.0 },
  { name: "Corona", category: "alcools", price: 3.0, badge: "populaire" },
  { name: "Leffe", category: "alcools", price: 3.5 },
  { name: "Leffe canette", category: "alcools", price: 3.2 },
  { name: "Pack Leffe", category: "alcools", price: 11.0 },
  { name: "Chouffe", category: "alcools", price: 3.5 },
  { name: "Goudale", category: "alcools", price: 3.0 },
  { name: "Casteel", category: "alcools", price: 3.8 },
  { name: "Canette HK", category: "alcools", price: 2.0 },
  { name: "Pack HK", category: "alcools", price: 9.5 },
  { name: "Smirnoff Ice", category: "alcools", price: 3.0 },
  { name: "8.6", category: "alcools", price: 2.5 },
  { name: "8.6 Extrem", category: "alcools", price: 3.0 },

  // ─── Alcools — Spiritueux ───────────────────────────
  { name: "Jack Daniel's 70cl", category: "alcools", price: 29.0, badge: "populaire" },
  { name: "Jack Daniel's Goût 70cl", category: "alcools", price: 31.0 },
  { name: "Hennessy", category: "alcools", price: 50.0, badge: "populaire" },
  { name: "Chivas", category: "alcools", price: 40.0 },
  { name: "Ciroc", category: "alcools", price: 45.0 },
  { name: "Absolut 70cl", category: "alcools", price: 24.9 },
  { name: "Absolut Goût 70cl", category: "alcools", price: 27.0 },
  { name: "Captain Morgan", category: "alcools", price: 20.9 },
  { name: "Ricard", category: "alcools", price: 21.5 },
  { name: "Clan 1L", category: "alcools", price: 30.0 },
  { name: "Saint James Ambré", category: "alcools", price: 19.5 },
  { name: "Saint James Blanc", category: "alcools", price: 19.5 },
  { name: "Tequila", category: "alcools", price: 19.5 },
  { name: "Get 27", category: "alcools", price: 15.9 },
  { name: "Get 31", category: "alcools", price: 19.9 },
  { name: "Malibu", category: "alcools", price: 13.9 },
  { name: "Vody's", category: "alcools", price: 4.5 },
  { name: "Vody's P", category: "alcools", price: 5.0 },
  { name: "Lavish", category: "alcools", price: 4.5 },

  // ─── Alcools — Mini-bouteilles Flash (regroupées) ───
  {
    name: "Mini-bouteille Flash",
    category: "alcools",
    price: 5.5,
    description: "Mignonnettes toutes marques",
    options: [
      "Absolut — 11 €",
      "Ballantines — 13 €",
      "Clan — 9 €",
      "Jack — 13,50 €",
      "Peel — 6,70 €",
      "Polia — 5,50 €",
      "Rhum — 6 €",
      "Sobieski — 6,80 €",
    ],
  },
  {
    name: "Formule Flash",
    category: "alcools",
    price: 10.0,
    description: "Assortiments mini-bouteilles",
    options: [
      "Formule à 10 €",
      "Formule à 11 €",
      "Formule à 13,50 €",
    ],
  },

  // ─── Puff & CBD ──────────────────────────────────────
  { name: "JNR 50K", category: "puff-cbd", price: 26.0, badge: "populaire" },
  { name: "JNR 43K", category: "puff-cbd", price: 22.0 },
  { name: "JNR 33K", category: "puff-cbd", price: 20.0 },
  { name: "JNR 28K", category: "puff-cbd", price: 18.9 },
  { name: "Al Fakher 30K", category: "puff-cbd", price: 20.0 },
  { name: "Ape 32K", category: "puff-cbd", price: 14.9 },
  { name: "JNR E-liquide", category: "puff-cbd", price: 3.5 },
  { name: "CBD", category: "puff-cbd", price: "variable", description: "Plusieurs variétés disponibles" },

  // ─── Tabac & Accessoires — OCB / feuilles / tubes ──
  { name: "OCB Slim", category: "tabac", price: 1.5, badge: "populaire" },
  { name: "OCB Court", category: "tabac", price: 1.3 },
  { name: "OCB Slim + Filtres", category: "tabac", price: 2.0 },
  { name: "Feuilles SMK", category: "tabac", price: 1.2 },
  { name: "Feuilles SMK Court", category: "tabac", price: 1.0 },
  { name: "Filtre OCB", category: "tabac", price: 1.0 },
  { name: "Filtre OCB Premium", category: "tabac", price: 2.0 },
  { name: "Filtre Bleu OCB", category: "tabac", price: 2.0 },
  { name: "Rolls OCB", category: "tabac", price: 2.5 },
  { name: "Tube OCB 100", category: "tabac", price: 1.8 },
  { name: "Tube OCB 250", category: "tabac", price: 3.9 },
  { name: "Tube OCB 500", category: "tabac", price: 6.9 },
  { name: "Tubeuse", category: "tabac", price: 4.0 },
  { name: "Tubeuse OCB", category: "tabac", price: 9.95 },
  { name: "Rouleuse", category: "tabac", price: 3.0 },

  // ─── Tabac — Briquets ───────────────────────────────
  { name: "Grand Bic", category: "tabac", price: 2.0 },
  { name: "Petit Bic", category: "tabac", price: 1.5 },
  { name: "Briquet électrique", category: "tabac", price: 1.3 },
  { name: "Briquet Belflamme", category: "tabac", price: 1.0 },

  // ─── Tabac — Accessoires divers ─────────────────────
  { name: "Grinder métal", category: "tabac", price: 6.5 },
  { name: "Grinder plastique", category: "tabac", price: 2.0 },
  { name: "Charbon rouge", category: "tabac", price: 1.5 },
  { name: "Clippers", category: "tabac", price: 2.0 },
  { name: "Fresh Coco", category: "tabac", price: 8.5 },
  { name: "Poppers", category: "tabac", price: 8.0 },
  { name: "Snuss Pablo", category: "tabac", price: 7.0 },
];

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}
