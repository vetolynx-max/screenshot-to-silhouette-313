import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { MapPin, SlidersHorizontal, Briefcase, Clock, Map as MapIcon, List, Stethoscope, HeartPulse } from "lucide-react";
import lynx from "@/assets/vetolynx-lynx.png.asset.json";
import { DEMO_OFFERS, METIERS, CONTRATS, type Offer } from "@/lib/offers";
import { cn } from "@/lib/utils";

const OffersMap = lazy(() => import("@/components/OffersMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vetolynx — Offres d'emploi vétérinaires sur la carte" },
      { name: "description", content: "Catalogue d'offres d'emploi vétérinaires et ASV : liste et carte interactive synchronisées." },
      { property: "og:title", content: "Vetolynx — Offres d'emploi vétérinaires" },
      { property: "og:description", content: "Trouvez un poste vétérinaire ou ASV près de chez vous, sur la carte." },
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
  const PhotoIcon = o.metier === "ASV" ? HeartPulse : Stethoscope;
  return (
    <article
      id={`offer-${o.id}`}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card shadow-card transition",
        selected ? "border-primary-glow shadow-selected" : "hover:border-primary-glow/50",
      )}
    >
      <div className="relative flex h-28 items-center justify-center bg-accent">
        <PhotoIcon className="h-10 w-10 text-primary/30" aria-hidden />
        <span className="absolute bottom-2 right-2 text-[10px] font-medium text-muted-foreground">Photo démo</span>
        <div className="absolute left-2 top-2 flex gap-1">
          <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">{o.metier}</span>
          <span className="rounded-md bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground">{o.specialite}</span>
        </div>
        {o.boost && (
          <span className="absolute right-2 top-2 rounded-md bg-boost px-2 py-0.5 text-[11px] font-bold text-boost-foreground">BOOST</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="text-sm font-bold leading-snug text-foreground">{o.titre}</h3>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {o.ville} · {o.departement}
        </p>
        <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5", chip.blue)}><Briefcase className="h-3 w-3" />{o.contrat}</span>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5", chip.violet)}><Clock className="h-3 w-3" />{o.temps}</span>
          {o.salaire && <span className={cn("rounded-full px-2 py-0.5", chip.amber)}>{o.salaire}</span>}
          {o.infos.map((i) => (
            <span key={i} className={cn("rounded-full px-2 py-0.5", chip.teal)}>{i}</span>
          ))}
        </div>
        <button className="mt-auto rounded-lg bg-gradient-primary py-2 text-sm font-bold text-primary-foreground">Voir l'offre →</button>
      </div>
    </article>
  );
}

function Catalogue() {
  const [metier, setMetier] = useState<string>("Tous");
  const [contrat, setContrat] = useState<string>("Tous");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"liste" | "carte">("liste");
  const listRef = useRef<HTMLDivElement>(null);

  const offers = useMemo(
    () => DEMO_OFFERS.filter((o) => (metier === "Tous" || o.metier === metier) && (contrat === "Tous" || o.contrat === contrat)),
    [metier, contrat],
  );

  useEffect(() => {
    if (!selected) return;
    document.getElementById(`offer-${selected}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  const filterBtn = (active: boolean) =>
    cn("rounded-full border px-3 py-1 text-xs font-semibold transition", active ? "border-filter bg-filter text-filter-foreground" : "bg-card text-foreground hover:border-filter");

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
              <h1 className="text-base font-bold text-foreground">{offers.length} offres dans la zone</h1>
              <button onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-2 rounded-lg bg-filter px-4 py-2 text-sm font-bold text-filter-foreground">
                <SlidersHorizontal className="h-4 w-4" /> Filtres
              </button>
            </div>
            {showFilters && (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="w-16 text-xs font-semibold text-muted-foreground">Métier</span>
                  {METIERS.map((m) => <button key={m} className={filterBtn(metier === m)} onClick={() => setMetier(m)}>{m}</button>)}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="w-16 text-xs font-semibold text-muted-foreground">Contrat</span>
                  {CONTRATS.map((c) => <button key={c} className={filterBtn(contrat === c)} onClick={() => setContrat(c)}>{c}</button>)}
                </div>
              </div>
            )}
          </div>
          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-3 pb-20 md:pb-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {offers.map((o) => (
                <OfferCard key={o.id} o={o} selected={o.id === selected} onSelect={() => setSelected(o.id)} />
              ))}
            </div>
            {offers.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Aucune offre ne correspond à ces filtres.</p>}
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
