export type Offer = {
  id: string;
  metier: string;
  specialite: string;
  titre: string;
  ville: string;
  departement: string;
  lat: number;
  lng: number;
  contrat: "CDI" | "CDD" | "Remplacement" | "Libéral";
  temps: string;
  salaire?: string;
  infos: string[];
  boost?: boolean;
};

// Annonces de démonstration — données fictives
export const DEMO_OFFERS: Offer[] = [
  { id: "1", metier: "Vétérinaire", specialite: "Canine", titre: "Vétérinaire canin(e) – CDI temps plein", ville: "Lyon", departement: "69", lat: 45.764, lng: 4.8357, contrat: "CDI", temps: "4j/sem", salaire: "42k–52k €", infos: ["Zéro garde"], boost: true },
  { id: "2", metier: "Vétérinaire", specialite: "Rurale", titre: "Vétérinaire rurale – clinique mixte bovins", ville: "Rennes", departement: "35", lat: 48.1173, lng: -1.6778, contrat: "CDI", temps: "Temps plein", salaire: "45k–55k €", infos: ["Véhicule fourni", "Gardes rémunérées"] },
  { id: "3", metier: "ASV", specialite: "Canine", titre: "Auxiliaire spécialisé(e) vétérinaire", ville: "Nantes", departement: "44", lat: 47.2184, lng: -1.5536, contrat: "CDI", temps: "35h/sem", salaire: "24k–27k €", infos: ["Samedis libres"] },
  { id: "4", metier: "Vétérinaire", specialite: "NAC", titre: "Vétérinaire NAC – centre spécialisé", ville: "Bordeaux", departement: "33", lat: 44.8378, lng: -0.5792, contrat: "CDD", temps: "4j/sem", infos: ["Formation continue"] },
  { id: "5", metier: "Vétérinaire", specialite: "Mixte", titre: "Remplacement été – clinique mixte", ville: "Aurillac", departement: "15", lat: 44.9264, lng: 2.4397, contrat: "Remplacement", temps: "Temps plein", salaire: "450 €/jour", infos: ["Logement fourni"] },
  { id: "6", metier: "Vétérinaire", specialite: "Équine", titre: "Vétérinaire équin(e) – clinique de référé", ville: "Caen", departement: "14", lat: 49.1829, lng: -0.3707, contrat: "CDI", temps: "Temps plein", salaire: "48k–60k €", infos: ["Gardes rémunérées"], boost: true },
  { id: "7", metier: "ASV", specialite: "Urgences", titre: "ASV urgences – nuits et week-ends", ville: "Paris", departement: "75", lat: 48.8566, lng: 2.3522, contrat: "CDI", temps: "32h/sem", salaire: "28k–31k €", infos: ["Primes de nuit"] },
  { id: "8", metier: "Vétérinaire", specialite: "Canine", titre: "Associé(e) – reprise de parts", ville: "Annecy", departement: "74", lat: 45.8992, lng: 6.1294, contrat: "Libéral", temps: "4j/sem", infos: ["Zéro garde", "Samedis libres"] },
  { id: "9", metier: "Vétérinaire", specialite: "Canine", titre: "Vétérinaire généraliste – clinique urbaine", ville: "Toulouse", departement: "31", lat: 43.6047, lng: 1.4442, contrat: "CDI", temps: "Temps plein", salaire: "40k–48k €", infos: ["Plateau technique complet"] },
  { id: "10", metier: "Vétérinaire", specialite: "Rurale", titre: "Vétérinaire rurale – secteur laitier", ville: "Besançon", departement: "25", lat: 47.2378, lng: 6.0241, contrat: "CDD", temps: "Temps plein", salaire: "42k–50k €", infos: ["Véhicule fourni"] },
];

export const METIERS = ["Tous", "Vétérinaire", "ASV"] as const;
export const CONTRATS = ["Tous", "CDI", "CDD", "Remplacement", "Libéral"] as const;
