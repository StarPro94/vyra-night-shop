export const siteConfig = {
  name: "Vyra Night Shop",
  tagline: "Ouvert quand les autres dorment",
  description:
    "Vyra Night Shop, votre epicerie de nuit a Villers-Cotterets. Snacks, boissons, alcool, puff, CBD et produits importes USA et Japon. Ouvert tard, 7j/7. A emporter et en livraison.",
  url: "https://vyra-night-shop.vercel.app",
  address: {
    street: "14 rue Leveille",
    city: "Villers-Cotterets",
    postalCode: "02600",
    region: "Aisne",
    country: "FR",
  },
  geo: {
    latitude: 49.2533,
    longitude: 3.09,
  },
  phone: "+33XXXXXXXXX", // A remplir
  whatsapp: "33XXXXXXXXX", // A remplir (sans le +)
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
    { id: "importes", label: "Importes", icon: "globe" },
  ],
  marqueeMessages: [
    "Ouvert 7j/7 jusqu'a 02h",
    "Monster & sodas import USA",
    "Ramen & snacks Japon",
    "CBD premium & puff nouveaux gouts",
    "Livraison a Villers-Cotterets",
    "Paiement CB / especes / sans contact",
  ],
} as const;

export type Category = (typeof siteConfig.categories)[number]["id"];
