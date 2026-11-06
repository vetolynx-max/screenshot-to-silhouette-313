export type Contrat = "CDI" | "CDD" | "Remplacement" | "Collaboration / libéral";
export type Profession = "Vétérinaire" | "ASV";

export type Offer = {
  id: string;
  profession: Profession;
  specialite: string;
  titre: string;
  /** Nom de la structure — fictif (démo) */
  clinique: string;
  ville: string;
  departement: string;
  region: string;
  /** Coordonnées ; null si inconnues → pas de marqueur */
  lat: number | null;
  lng: number | null;
  contrat: Contrat;
  tempsPlein: boolean;
  /** Détail du rythme affiché, ex. « 4j/sem » */
  rythme: string;
  /** Années d'expérience minimum demandées (0 = débutant accepté) */
  experienceMin: number;
  /** Date de prise de poste (ISO yyyy-mm-dd) */
  debut: string;
  /** Rémunération ; unite "an" en k€ brut annuel, "jour" en € par jour */
  remun?: { min: number; max?: number; unite: "an" | "jour" };
  infos: string[];
  boost?: boolean;
};

// Annonces de démonstration — toutes les données sont fictives
export const DEMO_OFFERS: Offer[] = [
  { id: "1", profession: "Vétérinaire", specialite: "Canine", titre: "Vétérinaire canin(e) – CDI temps plein", clinique: "Clinique des Brotteaux (démo)", ville: "Lyon", departement: "69", region: "Auvergne-Rhône-Alpes", lat: 45.764, lng: 4.8357, contrat: "CDI", tempsPlein: true, rythme: "4j/sem", experienceMin: 0, debut: "2026-12-01", remun: { min: 42, max: 52, unite: "an" }, infos: ["Zéro garde"], boost: true },
  { id: "2", profession: "Vétérinaire", specialite: "Rurale", titre: "Vétérinaire rurale – clinique mixte bovins", clinique: "Cabinet du Pays de Rennes (démo)", ville: "Rennes", departement: "35", region: "Bretagne", lat: 48.1173, lng: -1.6778, contrat: "CDI", tempsPlein: true, rythme: "Temps plein", experienceMin: 2, debut: "2027-01-05", remun: { min: 45, max: 55, unite: "an" }, infos: ["Véhicule fourni", "Gardes rémunérées"] },
  { id: "3", profession: "ASV", specialite: "Canine", titre: "Auxiliaire spécialisé(e) vétérinaire", clinique: "Clinique de l'Erdre (démo)", ville: "Nantes", departement: "44", region: "Pays de la Loire", lat: 47.2184, lng: -1.5536, contrat: "CDI", tempsPlein: true, rythme: "35h/sem", experienceMin: 0, debut: "2026-11-23", remun: { min: 24, max: 27, unite: "an" }, infos: ["Samedis libres"] },
  { id: "4", profession: "Vétérinaire", specialite: "NAC", titre: "Vétérinaire NAC – centre spécialisé", clinique: "Centre NAC Bordeaux (démo)", ville: "Bordeaux", departement: "33", region: "Nouvelle-Aquitaine", lat: 44.8378, lng: -0.5792, contrat: "CDD", tempsPlein: false, rythme: "3j/sem", experienceMin: 1, debut: "2027-02-01", infos: ["Formation continue"] },
  { id: "5", profession: "Vétérinaire", specialite: "Mixte", titre: "Remplacement été – clinique mixte", clinique: "Clinique du Cantal (démo)", ville: "Aurillac", departement: "15", region: "Auvergne-Rhône-Alpes", lat: 44.9264, lng: 2.4397, contrat: "Remplacement", tempsPlein: true, rythme: "Temps plein", experienceMin: 0, debut: "2027-07-01", remun: { min: 450, unite: "jour" }, infos: ["Logement fourni"] },
  { id: "6", profession: "Vétérinaire", specialite: "Équine", titre: "Vétérinaire équin(e) – clinique de référé", clinique: "Pôle équin de Normandie (démo)", ville: "Caen", departement: "14", region: "Normandie", lat: 49.1829, lng: -0.3707, contrat: "CDI", tempsPlein: true, rythme: "Temps plein", experienceMin: 3, debut: "2027-01-15", remun: { min: 48, max: 60, unite: "an" }, infos: ["Gardes rémunérées"], boost: true },
  { id: "7", profession: "ASV", specialite: "Urgences", titre: "ASV urgences – nuits et week-ends", clinique: "Urgences Vétérinaires Paris (démo)", ville: "Paris", departement: "75", region: "Île-de-France", lat: 48.8566, lng: 2.3522, contrat: "CDI", tempsPlein: false, rythme: "32h/sem", experienceMin: 1, debut: "2026-12-15", remun: { min: 28, max: 31, unite: "an" }, infos: ["Primes de nuit"] },
  { id: "8", profession: "Vétérinaire", specialite: "Canine", titre: "Associé(e) – reprise de parts", clinique: "Clinique du Lac (démo)", ville: "Annecy", departement: "74", region: "Auvergne-Rhône-Alpes", lat: 45.8992, lng: 6.1294, contrat: "Collaboration / libéral", tempsPlein: false, rythme: "4j/sem", experienceMin: 5, debut: "2027-03-01", infos: ["Zéro garde", "Samedis libres"] },
  { id: "9", profession: "Vétérinaire", specialite: "Canine", titre: "Vétérinaire généraliste – clinique urbaine", clinique: "Clinique Capitole (démo)", ville: "Toulouse", departement: "31", region: "Occitanie", lat: 43.6047, lng: 1.4442, contrat: "CDI", tempsPlein: true, rythme: "Temps plein", experienceMin: 0, debut: "2026-12-01", remun: { min: 40, max: 48, unite: "an" }, infos: ["Plateau technique complet"] },
  { id: "10", profession: "Vétérinaire", specialite: "Rurale", titre: "Vétérinaire rurale – secteur laitier", clinique: "Cabinet du Doubs (démo)", ville: "Besançon", departement: "25", region: "Bourgogne-Franche-Comté", lat: 47.2378, lng: 6.0241, contrat: "CDD", tempsPlein: true, rythme: "Temps plein", experienceMin: 1, debut: "2027-01-02", remun: { min: 42, max: 50, unite: "an" }, infos: ["Véhicule fourni"] },
];

export const PROFESSIONS: Profession[] = ["Vétérinaire", "ASV"];
export const CONTRATS: Contrat[] = ["CDI", "CDD", "Remplacement", "Collaboration / libéral"];

export function hasCoords(o: Offer): o is Offer & { lat: number; lng: number } {
  return (
    typeof o.lat === "number" && typeof o.lng === "number" &&
    Number.isFinite(o.lat) && Number.isFinite(o.lng) &&
    Math.abs(o.lat) <= 90 && Math.abs(o.lng) <= 180
  );
}

export function formatRemun(r: Offer["remun"]): string | null {
  if (!r) return null;
  if (r.unite === "jour") return `${r.min} €/jour`;
  return r.max ? `${r.min}k–${r.max}k € /an` : `dès ${r.min}k € /an`;
}

export function formatExperience(n: number): string {
  return n === 0 ? "Débutant accepté" : `${n} an${n > 1 ? "s" : ""} d'exp. min.`;
}

export function formatDebut(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
