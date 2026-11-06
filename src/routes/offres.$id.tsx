import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DEMO_OFFERS, formatRemun } from "@/lib/offers";

// Page d'attente : la fiche détaillée sera construite dans un module ultérieur.
export const Route = createFileRoute("/offres/$id")({
  loader: ({ params }) => {
    const offer = DEMO_OFFERS.find((o) => o.id === params.id);
    if (!offer) throw notFound();
    return offer;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titre ?? "Offre"} — Vetolynx` },
      { name: "description", content: `Offre ${loaderData?.profession ?? ""} à ${loaderData?.ville ?? ""} (démonstration).` },
      { property: "og:title", content: `${loaderData?.titre ?? "Offre"} — Vetolynx` },
      { property: "og:description", content: "Offre d'emploi vétérinaire de démonstration." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p className="mb-4 text-foreground">Cette offre n'existe pas.</p>
      <Link to="/" className="font-bold text-primary underline">Retour au catalogue</Link>
    </div>
  ),
  component: OfferStub,
});

function OfferStub() {
  const o = Route.useLoaderData();
  const remun = formatRemun(o.remun);
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour au catalogue
      </Link>
      <p className="text-xs font-bold uppercase text-muted-foreground">{o.profession} · {o.specialite}</p>
      <h1 className="mt-1 text-2xl font-bold text-foreground">{o.titre}</h1>
      <p className="mt-1 text-foreground">{o.clinique} — {o.ville} ({o.departement})</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {o.contrat} · {o.tempsPlein ? "Temps plein" : "Temps partiel"} ({o.rythme}){remun ? ` · ${remun}` : ""}
      </p>
      <div className="mt-6 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        La fiche détaillée de l'offre (description, missions, contact) n'existe pas encore : elle sera construite dans le prochain module. Annonce de démonstration.
      </div>
    </div>
  );
}
