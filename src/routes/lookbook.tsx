import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/lookbook")({ component: Lookbook });

function Lookbook() {
  const shots = [
    { src: "/editorial/hero.jpg", cap: "Emerald silk, 22k haar" },
    { src: "/editorial/bridal.jpg", cap: "Courtyard, morning" },
    { src: "/editorial/lookbook.jpg", cap: "Tuesday gold" },
    { src: "/editorial/hand-stack.jpg", cap: "The stack" },
    { src: "/editorial/everyday.jpg", cap: "Chai and a chain" },
    { src: "/products/lahore-jhumkas.jpg", cap: "Lahore jhumkas" },
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Lookbook</p>
      <h1 className="mt-2 font-display text-5xl">Worn, not staged</h1>
      <div className="mt-10 columns-1 gap-4 md:columns-2">
        {shots.map((s) => (
          <figure key={s.src} className="mb-4 break-inside-avoid">
            <img src={s.src} alt={s.cap} className="w-full rounded-2xl object-cover" />
            <figcaption className="mt-2 text-sm text-stone">{s.cap}</figcaption>
          </figure>
        ))}
      </div>
      <Link to="/shop" className="mt-8 inline-block text-sm underline">
        Shop the house
      </Link>
    </main>
  );
}
