import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { MapPin, SlidersHorizontal, Briefcase, Clock, Map as MapIcon, List, Building2, X } from "lucide-react";
import lynx from "@/assets/vetolynx-lynx.png.asset.json";
import { DEMO_OFFERS, PROFESSIONS, CONTRATS, hasCoords, formatRemun, formatExperience, formatDebut, type Offer } from "@/lib/offers";
import { applyFilters, EMPTY_FILTERS, type Filters } from "@/lib/filters";
import { cn } from "@/lib/utils";

const OffersMap = lazy(() => import("@/components/OffersMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vetolynx — Offres d'emploi vétérinaires sur la carte" },
      { name: "description", content: "Catalogue d'offres d'emploi vétérinaires et ASV : liste et carte interactive synchronisées." },
      { property: "og:title", content: "Vetolynx — Offres d'emploi vétérinaires" },
      { property: "og:description", content: "Trouvez un poste vétérinaire ou ASV près de chez vous, sur la carte." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Catalogue,
});

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src={lynx.url} alt="Vetolynx" className="h-8 w-auto" />
      <span className="text-lg font-extrabold tracking-tight text-foreground">Vetolynx</span>
    </div>
  );
}

const chip = {
  blue: "bg-chip-blue text-chip-blue-foreground",
  teal: "bg-chip-teal text-chip-teal-foreground",
  amber: "bg-chip-amber text-chip-amber-foreground",
  violet: "bg-chip-violet text-chip-violet-foreground",
};

function OfferCard({ o, selected, onSelect }: { o: Offer; selected: boolean; onSelect: () => void }) {
  const remun = formatRemun(o.remun);
  return (
    <article
      id={`offer-${o.id}`}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col gap-2 rounded-xl border bg-card p-3 shadow-card transition",
        selected ? "border-primary-glow shadow-selected" : "hover:border-primary-glow/50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">{o.profession}</span>
          <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold text-foreground">{o.specialite}</span>
        </div>
        {o.boost && <span className="rounded-md bg-boost px-2 py-0.5 text-[11px] font-bold text-boost-foreground">BOOST</span>}
      </div>
      <h3 className="text-sm font-bold leading-snug text-foreground">{o.titre}</h3>
      <p className="flex items-center gap-1 text-xs text-foreground"><Building2 className="h-3.5 w-3.5 shrink-0" /> {o.clinique}</p>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0" /> {o.ville} ({o.departement}) · {o.region}
      </p>
      <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5", chip.blue)}><Briefcase className="h-3 w-3" />{o.contrat}</span>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5", chip.violet)}><Clock className="h-3 w-3" />{o.tempsPlein ? "Temps plein" : "Temps partiel"} · {o.rythme}</span>
        {remun && <span className={cn("rounded-full px-2 py-0.5", chip.amber)}>{remun}</span>}
      </div>
      <p className="text-[11px] text-muted-foreground">{formatExperience(o.experienceMin)} · Début {formatDebut(o.debut)}</p>
      {o.infos.length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
          {o.infos.map((i) => <span key={i} className={cn("rounded-full px-2 py-0.5", chip.teal)}>{i}</span>)}
        </div>
      )}
      <Link
        to="/offres/$id"
        params={{ id: o.id }}
        onClick={(e) => e.stopPropagation()}
        className="mt-auto rounded-lg bg-gradient-primary py-2 text-center text-sm font-bold text-primary-foreground"
      >
        Voir l'offre →
      </Link>
    </article>
  );
}

const SPECIALITES = Array.from(new Set(DEMO_OFFERS.map((o) => o.specialite))).sort();
const VILLES = Array.from(new Set(DEMO_OFFERS.filter(hasCoords).map((o) => o.ville))).sort();

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-muted-foreground">
      {label}
      {children}
    </label>
  );
}
const inputCls = "h-9 w-full min-w-0 rounded-md border bg-card px-2 text-sm font-normal text-foreground";

function Catalogue() {
  const [f, setF] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"liste" | "carte">("liste");
  const listRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((p) => ({ ...p, [k]: v }));

  const offers = useMemo(() => applyFilters(DEMO_OFFERS, f), [f]);

  // Désélectionne une offre masquée par les filtres
  useEffect(() => {
    if (selected && !offers.some((o) => o.id === selected)) setSelected(null);
  }, [offers, selected]);

  useEffect(() => {
    if (!selected) return;
    document.getElementById(`offer-${selected}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  const active: { key: (keyof Filters)[]; label: string }[] = [];
  if (f.q) active.push({ key: ["q"], label: `Lieu : ${f.q}` });
  if (f.profession) active.push({ key: ["profession"], label: f.profession });
  if (f.specialite) active.push({ key: ["specialite"], label: f.specialite });
  if (f.contrat) active.push({ key: ["contrat"], label: f.contrat });
  if (f.temps) active.push({ key: ["temps"], label: f.temps === "plein" ? "Temps plein" : "Temps partiel" });
  if (f.experience) active.push({ key: ["experience"], label: f.experience === "0" ? "Débutant" : `Mon exp. : ${f.experience} an(s)` });
  if (f.debutAvant) active.push({ key: ["debutAvant"], label: `Début avant le ${formatDebut(f.debutAvant)}` });
  if (f.remunMin) active.push({ key: ["remunMin"], label: `≥ ${f.remunMin}k € /an` });
  if (f.centre && f.rayon) active.push({ key: ["centre", "rayon"], label: `${f.rayon} km autour de ${f.centre}` });

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 md:px-8">
        <Logo />
        <span className="rounded-md bg-chip-amber px-2 py-1 text-[11px] font-bold text-chip-amber-foreground">Annonces de démonstration</span>
      </header>

      <main className="relative flex min-h-0 flex-1">
        <section className={cn("flex min-h-0 w-full flex-col border-r md:flex md:w-2/5", mobileView === "carte" && "hidden")}>
          <div className="shrink-0 border-b bg-card px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-foreground">{offers.length} offre{offers.length > 1 ? "s" : ""} sur {DEMO_OFFERS.length}</h1>
              <button onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-2 rounded-lg bg-filter px-4 py-2 text-sm font-bold text-filter-foreground">
                <SlidersHorizontal className="h-4 w-4" /> Filtres{active.length > 0 ? ` (${active.length})` : ""}
              </button>
            </div>
            <input
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Ville, département (ex. 69) ou région"
              aria-label="Localisation"
              className={cn(inputCls, "mt-3")}
            />
            {showFilters && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Field label="Profession">
                  <select className={inputCls} value={f.profession} onChange={(e) => set("profession", e.target.value)}>
                    <option value="">Toutes</option>
                    {PROFESSIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Spécialité">
                  <select className={inputCls} value={f.specialite} onChange={(e) => set("specialite", e.target.value)}>
                    <option value="">Toutes</option>
                    {SPECIALITES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Contrat">
                  <select className={inputCls} value={f.contrat} onChange={(e) => set("contrat", e.target.value)}>
                    <option value="">Tous</option>
                    {CONTRATS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Temps de travail">
                  <select className={inputCls} value={f.temps} onChange={(e) => set("temps", e.target.value as Filters["temps"])}>
                    <option value="">Tous</option>
                    <option value="plein">Temps plein</option>
                    <option value="partiel">Temps partiel</option>
                  </select>
                </Field>
                <Field label="Mon expérience">
                  <select className={inputCls} value={f.experience} onChange={(e) => set("experience", e.target.value)}>
                    <option value="">Peu importe</option>
                    <option value="0">Débutant</option>
                    <option value="1">1 an</option>
                    <option value="3">3 ans</option>
                    <option value="5">5 ans et +</option>
                  </select>
                </Field>
                <Field label="Début avant le">
                  <input type="date" className={inputCls} value={f.debutAvant} onChange={(e) => set("debutAvant", e.target.value)} />
                </Field>
                <Field label="Salaire min. (k€/an)">
                  <select className={inputCls} value={f.remunMin} onChange={(e) => set("remunMin", e.target.value)}>
                    <option value="">Peu importe</option>
                    {[25, 30, 40, 45, 50].map((v) => <option key={v} value={v}>{v}k €</option>)}
                  </select>
                </Field>
                <Field label="Autour de">
                  <select className={inputCls} value={f.centre} onChange={(e) => setF((p) => ({ ...p, centre: e.target.value, rayon: e.target.value ? p.rayon || "100" : "" }))}>
                    <option value="">—</option>
                    {VILLES.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Rayon">
                  <select className={inputCls} value={f.rayon} disabled={!f.centre} onChange={(e) => set("rayon", e.target.value)}>
                    {!f.centre && <option value="">—</option>}
                    {[25, 50, 100, 200, 300].map((v) => <option key={v} value={v}>{v} km</option>)}
                  </select>
                </Field>
              </div>
            )}
            {active.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {active.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => setF((p) => ({ ...p, ...Object.fromEntries(a.key.map((k) => [k, ""])) }))}
                    className="inline-flex items-center gap-1 rounded-full border border-filter bg-filter px-2.5 py-0.5 text-[11px] font-semibold text-filter-foreground"
                    aria-label={`Retirer le filtre ${a.label}`}
                  >
                    {a.label} <X className="h-3 w-3" />
                  </button>
                ))}
                <button onClick={() => setF(EMPTY_FILTERS)} className="text-xs font-bold text-primary underline">
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-3 pb-20 md:pb-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {offers.map((o) => (
                <OfferCard key={o.id} o={o} selected={o.id === selected} onSelect={() => setSelected(o.id)} />
              ))}
            </div>
            {offers.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Aucune offre ne correspond à ces critères.{" "}
                <button onClick={() => setF(EMPTY_FILTERS)} className="font-bold text-primary underline">Réinitialiser les filtres</button>
              </div>
            )}
            <footer className="mt-6 flex items-center justify-center gap-2 border-t pt-4 text-xs text-muted-foreground">
              <img src={lynx.url} alt="" className="h-5 w-auto" /> Vetolynx — recrutement vétérinaire
            </footer>
          </div>
        </section>

        <section className={cn("min-h-0 w-full md:block md:w-3/5", mobileView === "liste" && "hidden")}>
          <ClientOnly fallback={<div className="h-full w-full bg-muted" />}>
            <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Chargement de la carte…</div>}>
              <OffersMap offers={offers} selectedId={selected} onSelect={setSelected} />
            </Suspense>
          </ClientOnly>
        </section>

        <button
          onClick={() => setMobileView((v) => (v === "liste" ? "carte" : "liste"))}
          className="absolute bottom-4 left-1/2 z-[1100] inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-card md:hidden"
        >
          {mobileView === "liste" ? <><MapIcon className="h-4 w-4" /> Carte</> : <><List className="h-4 w-4" /> Liste</>}
        </button>
      </main>
    </div>
  );
}
