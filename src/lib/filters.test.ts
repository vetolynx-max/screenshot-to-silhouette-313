import { describe, expect, it } from "vitest";
import { applyFilters, EMPTY_FILTERS } from "./filters";
import { DEMO_OFFERS, hasCoords } from "./offers";

const ids = (f: Partial<typeof EMPTY_FILTERS>) => applyFilters(DEMO_OFFERS, { ...EMPTY_FILTERS, ...f }).map((o) => o.id);

describe("filtres du catalogue", () => {
  it("sans filtre, toutes les offres", () => expect(ids({})).toHaveLength(10));
  it("profession ASV", () => expect(ids({ profession: "ASV" })).toEqual(["3", "7"]));
  it("temps partiel", () => expect(ids({ temps: "partiel" })).toEqual(["4", "7", "8"]));
  it("localisation par région sans accents", () => expect(ids({ q: "auvergne" })).toEqual(["1", "5", "8"]));
  it("localisation par numéro de département", () => expect(ids({ q: "75" })).toEqual(["7"]));
  it("rayon 150 km autour de Lyon", () => expect(ids({ centre: "Lyon", rayon: "150" })).toEqual(["1", "8"]));
  it("débutant : seulement offres sans expérience requise", () => expect(ids({ experience: "0" })).toEqual(["1", "3", "5", "9"]));
  it("rémunération ≥ 50k exclut les offres sans salaire et au jour", () => expect(ids({ remunMin: "50" })).toEqual(["1", "2", "6", "10"]));
  it("prise de poste avant le 31/12/2026", () => expect(ids({ debutAvant: "2026-12-31" })).toEqual(["1", "3", "7", "9"]));
  it("coordonnées invalides : pas de marqueur", () => {
    expect(hasCoords({ ...DEMO_OFFERS[0], lat: null })).toBe(false);
    expect(hasCoords({ ...DEMO_OFFERS[0], lat: 120 })).toBe(false);
  });
});
