import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Offer } from "@/lib/offers";

type Props = {
  offers: Offer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function icon(o: Offer, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="vl-marker${o.boost ? " boost" : ""}${active ? " active" : ""}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function popupHtml(o: Offer) {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  return `<div style="min-width:200px">
    <div style="font-size:11px;font-weight:700;opacity:.7;text-transform:uppercase">${esc(o.metier)} · ${esc(o.specialite)}</div>
    <div style="font-weight:700;margin:2px 0 4px">${esc(o.titre)}</div>
    <div>${esc(o.ville)} (${esc(o.departement)}) · ${esc(o.contrat)} · ${esc(o.temps)}</div>
    ${o.salaire ? `<div style="font-weight:600;margin-top:4px">${esc(o.salaire)}</div>` : ""}
    <div style="font-size:11px;opacity:.6;margin-top:6px">Annonce de démonstration</div>
  </div>`;
}

export default function OffersMap({ offers, selectedId, onSelect }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { zoomControl: true }).setView([46.6, 2.4], 6);
    let errors = 0;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    })
      .on("tileerror", () => {
        errors += 1;
        if (errors > 4) setTileError(true);
      })
      .on("tileload", () => setTileError(false))
      .addTo(m);
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
      markers.current.clear();
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    markers.current.forEach((mk) => mk.remove());
    markers.current.clear();
    offers.forEach((o) => {
      const mk = L.marker([o.lat, o.lng], { icon: icon(o, o.id === selectedId), title: o.titre })
        .bindPopup(popupHtml(o))
        .on("click", () => onSelectRef.current(o.id))
        .addTo(m);
      markers.current.set(o.id, mk);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offers]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    offers.forEach((o) => markers.current.get(o.id)?.setIcon(icon(o, o.id === selectedId)));
    const mk = selectedId ? markers.current.get(selectedId) : null;
    if (mk) {
      mk.setZIndexOffset(1000);
      m.panTo(mk.getLatLng(), { animate: true });
      mk.openPopup();
    }
  }, [selectedId, offers]);

  return (
    <div className="relative h-full w-full">
      <div ref={el} className="h-full w-full" aria-label="Carte des annonces" />
      {tileError && (
        <div className="absolute inset-x-4 top-4 z-[1000] rounded-lg border border-destructive bg-card p-3 text-sm text-destructive shadow-card">
          Le fond de carte OpenStreetMap n'a pas pu être chargé. Vérifiez votre connexion puis rechargez la page.
        </div>
      )}
      <div className="absolute right-3 top-3 z-[1000] rounded-md bg-card px-2 py-1 text-xs font-bold text-foreground shadow-card">
        {offers.length}/{offers.length}
      </div>
    </div>
  );
}
