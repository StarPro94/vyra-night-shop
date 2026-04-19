export const siteConfig = {
  name: "Vyra Night Shop",
  tagline: "Ouvert quand les autres dorment",
  description:
    "Vyra Night Shop, votre épicerie de nuit à Villers-Cotterêts. Snacks, softs, alcools, bières, spiritueux, puff, CBD, tabac et accessoires OCB. Ouvert tard, 7j/7. À emporter et en livraison.",
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
    { id: "softs", label: "Softs", icon: "glass" },
    { id: "alcools", label: "Alcools", icon: "bottle" },
    { id: "puff-cbd", label: "Puff & CBD", icon: "leaf" },
    { id: "tabac", label: "Tabac & Accessoires", icon: "flame" },
  ],
  marqueeMessages: [
    "Ouvert 7j/7 jusqu'à 02h",
    "Bières, spiritueux, mini-bouteilles flash",
    "Red Bull, Monster, sodas import",
    "Puff JNR jusqu'à 50 000 puffs",
    "OCB, tubes, briquets, accessoires",
    "Livraison à Villers-Cotterêts",
    "Paiement CB / espèces / sans contact",
  ],
} as const;

export type Category = (typeof siteConfig.categories)[number]["id"];
