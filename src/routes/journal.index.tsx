import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, ARTICLE_CATEGORY } from "@/lib/journal";

export const Route = createFileRoute("/journal/")({
  component: Journal,
});

function Journal() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone">The Journal</p>
      <h1 className="mt-2 font-display text-5xl">Style, care, the bench</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Couture week notes, how to wash silver without erasing it, and the looks we would actually wear on a Tuesday.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {ARTICLES.map((a) => (
          <Link key={a.slug} to="/journal/$slug" params={{ slug: a.slug }} className="block">
            <img src={a.image} alt="" className="aspect-[16/9] w-full rounded-2xl object-cover" />
            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-stone">
              {ARTICLE_CATEGORY[a.category]} · {a.readMin} min
            </p>
            <h2 className="mt-1 font-display text-3xl leading-tight">{a.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{a.dek}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
