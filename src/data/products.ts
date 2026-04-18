import type { Category } from "./site";

export interface Product {
  name: string;
  category: Category;
  description?: string;
  image?: string;
  badge?: "nouveau" | "populaire" | "import-usa" | "import-japon";
}

export const products: Product[] = [
  // Snacks
  { name: "Lay's Classic", category: "snacks", badge: "populaire" },
  { name: "Takis Fuego", category: "snacks", badge: "populaire" },
  { name: "Doritos Nacho Cheese", category: "snacks" },
  { name: "Pringles Original", category: "snacks" },
  { name: "Oreo Original", category: "snacks" },
  { name: "Haribo Goldbears", category: "snacks" },
  { name: "M&M's Peanut", category: "snacks" },
  { name: "Kit Kat", category: "snacks" },

  // Boissons
  { name: "Red Bull Energy", category: "boissons", badge: "populaire" },
  { name: "Monster Energy", category: "boissons" },
  { name: "Coca-Cola 33cl", category: "boissons" },
  { name: "Fanta Orange", category: "boissons" },
  { name: "Desperados 33cl", category: "boissons" },
  { name: "Heineken 50cl", category: "boissons" },
  { name: "Jack Daniel's & Cola", category: "boissons" },
  { name: "Smirnoff Ice", category: "boissons" },

  // Puff & CBD
  { name: "Puff Jetable 600", category: "puff-cbd", badge: "populaire" },
  { name: "Puff Rechargeable", category: "puff-cbd", badge: "nouveau" },
  { name: "Fleurs CBD Premium", category: "puff-cbd" },
  { name: "Huile CBD 10%", category: "puff-cbd" },
  { name: "Résine CBD", category: "puff-cbd" },
  { name: "Infusion CBD", category: "puff-cbd" },

  // Imports US & Japon
  {
    name: "Fanta Grape (USA)",
    category: "importes",
    badge: "import-usa",
  },
  {
    name: "Mountain Dew (USA)",
    category: "importes",
    badge: "import-usa",
  },
  {
    name: "Takis Blue Heat (USA)",
    category: "importes",
    badge: "import-usa",
  },
  {
    name: "Ramune Soda (Japon)",
    category: "importes",
    badge: "import-japon",
  },
  {
    name: "Pocky Matcha (Japon)",
    category: "importes",
    badge: "import-japon",
  },
  {
    name: "Hi-Chew Fruits (Japon)",
    category: "importes",
    badge: "import-japon",
  },
];

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}
