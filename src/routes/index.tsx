import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import ServiceOverlay from "@/components/salon/ServiceOverlay";

import { useScrollProgress } from "@/components/salon/useScrollProgress";
import type { HotspotId } from "@/components/salon/SalonScene";

const SalonScene = lazy(() => import("@/components/salon/SalonScene"));


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Lumière — Virtual Luxury Beauty Salon" },
      { name: "description", content: "An immersive 3D virtual tour of a five-star beauty salon. Hair, nails, facials, and curated skincare — booked with cinematic ease." },
    ],
  }),
  component: Index,
  ssr: false,
});

const CHAPTERS = [
  { eyebrow: "Chapter I", title: "Approach", body: "Brushed brass doors part to reveal a sanctuary cast in candlelight and marble." },
  { eyebrow: "Chapter II", title: "Foyer", body: "Hand-bottled elixirs orbit the reception in a quiet, holographic ballet." },
  { eyebrow: "Chapter III", title: "Hair Atelier", body: "Master stylists at private velvet vanities. A scissor's hush, a couture finish." },
  { eyebrow: "Chapter IV", title: "Nails Bar", body: "Pastel rose lacquer, hand-painted on a champagne-marble counter." },
  { eyebrow: "Chapter V", title: "Facial Suite", body: "Bespoke protocols beneath warm gold light. Skin, restored to first light." },
  { eyebrow: "Chapter VI", title: "VIP Chamber", body: "By appointment only. A private apothecary, your name etched in brass." },
];

function Index() {
  const scroll = useScrollProgress();
  const [open, setOpen] = useState<HotspotId | null>(null);

  return (
    <div className="relative bg-background text-foreground">
      {/* Fixed 3D stage */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<div className="flex h-full items-center justify-center text-xs tracking-[0.3em] uppercase text-muted-foreground">Entering Maison Lumière…</div>}>
          <SalonScene scroll={scroll} onHotspot={setOpen} />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,oklch(0.08_0.005_60/0.85))]" />
      </div>

      {/* Top nav */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-12">
        <div>
          <p className="font-display text-xl tracking-wide text-foreground">Maison <span className="text-gold">Lumière</span></p>
          <p className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground">Est. Paris · MMXIV</p>
        </div>
        <nav className="hidden items-center gap-8 text-[0.65rem] tracking-[0.35em] uppercase text-muted-foreground sm:flex">
          <a className="transition hover:text-gold" href="#tour">Tour</a>
          <a className="transition hover:text-gold" href="#services">Services</a>
          <a className="transition hover:text-gold" href="#apothecary">Apothecary</a>
        </nav>
        <button
          onClick={() => setOpen("facial")}
          className="rounded-sm border border-[oklch(0.82_0.09_85)]/50 px-4 py-2 text-[0.65rem] tracking-[0.35em] uppercase text-gold transition hover:bg-[oklch(0.82_0.09_85)]/10"
        >
          Reserve
        </button>
      </header>

      {/* Scroll content overlays */}
      <main className="relative z-10">
        {/* HERO */}
        <section className="relative flex min-h-screen items-end px-6 pb-28 sm:px-16">
          <div className="max-w-xl">
            <p className="text-[0.7rem] tracking-[0.5em] uppercase text-gold">A Virtual Salon</p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-7xl">
              An hour inside <span className="italic text-gold-gradient">Maison Lumière</span>.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Step from the street into our atelier. Wander the floor, meet the artisans, and reserve your ritual — all without leaving your seat.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#tour"
                className="group inline-flex items-center gap-3 rounded-sm bg-gold-gradient px-6 py-3 text-xs tracking-[0.35em] uppercase text-[oklch(0.14_0.005_60)] shadow-soft transition hover:brightness-110"
              >
                Begin the Tour
                <span className="transition group-hover:translate-x-1">↓</span>
              </a>
              <button
                onClick={() => setOpen("product")}
                className="text-xs tracking-[0.35em] uppercase text-muted-foreground transition hover:text-gold"
              >
                View Apothecary →
              </button>
            </div>
          </div>

          {/* scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="mx-auto h-12 w-px bg-gradient-to-b from-transparent via-[oklch(0.82_0.09_85)] to-transparent" />
            <p className="mt-3 text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground">Scroll to enter</p>
          </div>
        </section>

        {/* TOUR CHAPTERS */}
        <section id="tour" className="relative">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.title}
              className={`flex min-h-screen items-center px-6 sm:px-16 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div className="max-w-sm rounded-sm border border-[oklch(0.82_0.09_85)]/25 bg-[oklch(0.12_0.005_60)]/70 p-8 backdrop-blur-md shadow-luxe">
                <p className="text-[0.6rem] tracking-[0.4em] uppercase text-gold">{c.eyebrow}</p>
                <h2 className="mt-3 font-display text-4xl text-foreground">{c.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                <div className="hairline mt-6 pt-4 text-[0.6rem] tracking-[0.35em] uppercase text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* SERVICES GRID */}
        <section id="services" className="relative min-h-screen bg-[oklch(0.1_0.005_60)]/85 px-6 py-32 backdrop-blur-md sm:px-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-gold">The Carte</p>
            <h2 className="mt-4 font-display text-5xl sm:text-6xl">Rituals of the house.</h2>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground">
              Four ateliers, one philosophy: time, taken slowly. Tap any room above, or browse below.
            </p>

            <div className="mt-16 grid gap-px bg-[oklch(0.82_0.09_85)]/20 sm:grid-cols-2">
              {(["hair", "nails", "facial", "product"] as HotspotId[]).map((id) => {
                const meta = {
                  hair: { t: "Hair Atelier", s: "From $185", d: "Cuts, color, blow-outs." },
                  nails: { t: "Nails Bar", s: "From $75", d: "Manicure, pedicure, art." },
                  facial: { t: "Facial Suite", s: "From $220", d: "Bespoke skincare protocols." },
                  product: { t: "Apothecary", s: "From $95", d: "Serums, oils, elixirs." },
                }[id];
                return (
                  <button
                    key={id}
                    onClick={() => setOpen(id)}
                    className="group relative bg-[oklch(0.12_0.005_60)] p-10 text-left transition hover:bg-[oklch(0.16_0.006_60)]"
                  >
                    <p className="text-[0.6rem] tracking-[0.4em] uppercase text-gold">{meta.s}</p>
                    <h3 className="mt-3 font-display text-3xl">{meta.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{meta.d}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.35em] uppercase text-foreground transition group-hover:text-gold">
                      View & Book →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* APOTHECARY */}
        <section id="apothecary" className="relative min-h-screen px-6 py-32 sm:px-16">
          <div className="mx-auto grid max-w-5xl items-center gap-16 sm:grid-cols-2">
            <div>
              <p className="text-[0.65rem] tracking-[0.5em] uppercase text-gold">Apothecary</p>
              <h2 className="mt-4 font-display text-5xl sm:text-6xl">Bottled in Provence.</h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                A holographic vitrine above the reception desk holds the house collection — small-batch elixirs blended by our in-house perfumer. Hover the bottle to begin.
              </p>
              <button
                onClick={() => setOpen("product")}
                className="mt-8 inline-flex items-center gap-3 rounded-sm border border-[oklch(0.82_0.09_85)]/50 px-6 py-3 text-xs tracking-[0.35em] uppercase text-gold transition hover:bg-[oklch(0.82_0.09_85)]/10"
              >
                Explore the Collection
              </button>
            </div>
            <div className="hairline pt-6">
              <ul className="space-y-5">
                {[
                  ["No.07", "Radiance Serum", "$185"],
                  ["Velours", "Hair Oil", "$125"],
                  ["Pearl", "Night Crème", "$240"],
                  ["Rose Quartz", "Mist", "$95"],
                ].map(([n, t, p]) => (
                  <li key={n} className="flex items-baseline justify-between">
                    <div>
                      <p className="font-display text-2xl">{n}</p>
                      <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground">{t}</p>
                    </div>
                    <span className="font-display text-xl text-gold">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative border-t border-[oklch(0.82_0.09_85)]/20 bg-[oklch(0.09_0.005_60)] px-6 py-16 sm:px-16">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="font-display text-2xl">Maison <span className="text-gold">Lumière</span></p>
              <p className="mt-2 text-xs tracking-[0.3em] uppercase text-muted-foreground">
                14 Rue de Sèvres · Paris VI
              </p>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">By appointment · +33 1 42 22 00 00</p>
            </div>
            <p className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground">
              © MMXXVI — A virtual experience
            </p>
          </div>
        </footer>
      </main>

      {/* Progress rail */}
      <div className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 sm:block">
        <div className="relative h-64 w-px bg-[oklch(0.82_0.09_85)]/20">
          <div
            className="absolute left-0 top-0 w-px bg-gold-gradient transition-[height] duration-150"
            style={{ height: `${scroll * 100}%` }}
          />
        </div>
      </div>

      <ServiceOverlay id={open} onClose={() => setOpen(null)} />
    </div>
  );
}
