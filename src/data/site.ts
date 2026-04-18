export const siteConfig = {
  name: "Vyra Night Shop",
  tagline: "Ouvert quand les autres dorment",
  description:
    "Vyra Night Shop, votre épicerie de nuit à Villers-Cotterêts. Snacks, boissons, alcool, puff, CBD et produits importés USA et Japon. Ouvert tard, 7j/7. À emporter et en livraison.",
  url: "https://vyra-night-shop.vercel.app",
  address: {
    street: "14 rue Léveillé",
    city: "Villers-Cotterêts",
    postalCode: "02600",
    region: "Aisne",
    country: "FR",
  },
  geo: {
    latitude: 49.2533,
    longitude: 3.09,
  },
  phone: "+33757539924",
  phoneDisplay: "07 57 53 99 24",
  whatsapp: "33757539924",
  instagram: "vyra_nightshop",
  hours: {
    label: "Tous les jours",
    open: "18:00",
    close: "02:00",
  },
  categories: [
    { id: "snacks", label: "Snacks", icon: "cookie" },
    { id: "boissons", label: "Boissons", icon: "glass" },
    { id: "puff-cbd", label: "Puff & CBD", icon: "leaf" },
    { id: "importes", label: "Imports", icon: "globe" },
  ],
  marqueeMessages: [
    "Ouvert 7j/7 jusqu'à 02h",
    "Monster & sodas import USA",
    "Ramen & snacks Japon",
    "CBD premium & puff nouveaux goûts",
    "Livraison à Villers-Cotterêts",
    "Paiement CB / espèces / sans contact",
  ],
} as const;

export type Category = (typeof siteConfig.categories)[number]["id"];
