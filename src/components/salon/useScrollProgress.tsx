import { useEffect } from "react";
import type { HotspotId } from "./SalonScene";

interface Service { name: string; duration: string; price: string; note?: string }

const DATA: Record<HotspotId, { title: string; tagline: string; services: Service[] }> = {
  hair: {
    title: "Hair Atelier",
    tagline: "Couture cuts, color & ceremonial blow-outs by master stylists.",
    services: [
      { name: "Signature Cut & Style", duration: "75 min", price: "$185" },
      { name: "Balayage Composition", duration: "180 min", price: "$420", note: "Most requested" },
      { name: "Silk Press Ritual", duration: "120 min", price: "$240" },
      { name: "Bridal Atelier Package", duration: "240 min", price: "$680" },
    ],
  },
  nails: {
    title: "Nails Bar",
    tagline: "Hand-painted artistry on champagne-marble manicure stations.",
    services: [
      { name: "Maison Manicure", duration: "45 min", price: "$75" },
      { name: "Gel Sculpture", duration: "75 min", price: "$120" },
      { name: "Pedicure Lumière", duration: "60 min", price: "$95" },
      { name: "Crystal Couture Set", duration: "120 min", price: "$220" },
    ],
  },
  facial: {
    title: "Facial Suite",
    tagline: "Bespoke skincare protocols in a private VIP chamber.",
    services: [
      { name: "Lumière Glow Facial", duration: "60 min", price: "$220" },
      { name: "Diamond Microdermabrasion", duration: "75 min", price: "$320" },
      { name: "LED & Cryo Ritual", duration: "90 min", price: "$380", note: "VIP exclusive" },
      { name: "24K Gold Renewal", duration: "120 min", price: "$580" },
    ],
  },
  product: {
    title: "Maison Apothecary",
    tagline: "Curated serums, oils & elixirs — bottled by hand in Provence.",
    services: [
      { name: "No.07 Radiance Serum", duration: "30 ml", price: "$185" },
      { name: "Velours Hair Oil", duration: "50 ml", price: "$125" },
      { name: "Pearl Night Crème", duration: "50 ml", price: "$240" },
      { name: "Rose Quartz Mist", duration: "100 ml", price: "$95" },
    ],
  },
};

export default function ServiceOverlay({ id, onClose }: { id: HotspotId | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!id) return null;
  const d = DATA[id];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center sm:p-8">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-sm border border-[oklch(0.82_0.09_85)]/40 bg-[oklch(0.14_0.005_60)] shadow-luxe animate-[scale-in_0.25s_ease-out]">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
        <div className="grain relative p-8 sm:p-10">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 text-[oklch(0.72_0.015_70)] transition hover:text-[oklch(0.82_0.09_85)]"
          >
            ✕
          </button>
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-gold">Maison Lumière</p>
          <h3 className="mt-3 font-display text-4xl text-foreground">{d.title}</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{d.tagline}</p>

          <div className="hairline mt-6 pt-6">
            <ul className="space-y-4">
              {d.services.map((s) => (
                <li key={s.name} className="group flex items-baseline justify-between gap-4">
                  <div>
                    <p className="font-display text-lg text-foreground transition group-hover:text-[oklch(0.82_0.09_85)]">
                      {s.name}
                      {s.note && (
                        <span className="ml-2 align-middle text-[0.6rem] tracking-[0.25em] uppercase text-[oklch(0.88_0.05_25)]">
                          · {s.note}
                        </span>
                      )}
                    </p>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground">{s.duration}</p>
                  </div>
                  <span className="font-display text-xl text-gold">{s.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-8 w-full overflow-hidden rounded-sm border border-[oklch(0.82_0.09_85)]/50 bg-gold-gradient py-3 text-sm tracking-[0.3em] uppercase text-[oklch(0.14_0.005_60)] transition hover:brightness-110">
            Book Now
          </button>
          <p className="mt-3 text-center text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground">
            Concierge replies within the hour
          </p>
        </div>
      </div>
    </div>
  );
}
