import { hasCoords, type Offer } from "./offers";

export type Filters = {
  q: string; // ville, département ou région
  profession: string; // "" = toutes
  specialite: string;
  contrat: string;
  temps: "" | "plein" | "partiel";
  /** Expérience du candidat en années ; "" = non renseignée */
  experience: string;
  /** Poste à pourvoir au plus tard le (ISO) */
  debutAvant: string;
  /** Rémunération annuelle minimum en k€ */
  remunMin: string;
  /** Recherche par rayon autour d'une ville du catalogue */
  centre: string;
  rayon: string; // km
};

export const EMPTY_FILTERS: Filters = {
  q: "", profession: "", specialite: "", contrat: "", temps: "",
  experience: "", debutAvant: "", remunMin: "", centre: "", rayon: "",
};

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function applyFilters(offers: Offer[], f: Filters): Offer[] {
  const q = norm(f.q);
  const centre = f.centre ? offers.find((o) => o.ville === f.centre && hasCoords(o)) : undefined;
  const rayon = Number(f.rayon);
  const exp = f.experience === "" ? null : Number(f.experience);
  const remunMin = f.remunMin === "" ? null : Number(f.remunMin);

  return offers.filter((o) => {
    if (q && !norm(o.ville).includes(q) && !norm(o.region).includes(q) && norm(o.departement) !== q) return false;
    if (f.profession && o.profession !== f.profession) return false;
    if (f.specialite && o.specialite !== f.specialite) return false;
    if (f.contrat && o.contrat !== f.contrat) return false;
    if (f.temps === "plein" && !o.tempsPlein) return false;
    if (f.temps === "partiel" && o.tempsPlein) return false;
    if (exp !== null && o.experienceMin > exp) return false;
    if (f.debutAvant && o.debut > f.debutAvant) return false;
    // Rémunération : seules les offres annuelles renseignées peuvent être comparées
    if (remunMin !== null && (!o.remun || o.remun.unite !== "an" || (o.remun.max ?? o.remun.min) < remunMin)) return false;
    if (centre && rayon > 0) {
      if (!hasCoords(o) || distanceKm(centre as { lat: number; lng: number }, o) > rayon) return false;
    }
    return true;
  });
}
