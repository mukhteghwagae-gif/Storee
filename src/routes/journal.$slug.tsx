import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLE_BY_SLUG, ARTICLE_CATEGORY, ARTICLES } from "@/lib/journal";

export const Route = createFileRoute("/journal/$slug")({ component: Article });

function Article() {
  const { slug } = Route.useParams();
  const a = ARTICLE_BY_SLUG[slug];
  if (!a) {
    return (
      <main className="px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Essay not found</h1>
        <Link to="/journal" className="mt-4 inline-block text-sm underline">
          The Journal
        </Link>
      </main>
    );
  }
  const more = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
        {ARTICLE_CATEGORY[a.category]} · {a.date} · {a.readMin} min
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{a.title}</h1>
      <p className="mt-4 text-lg text-ink-soft">{a.dek}</p>
      <img src={a.image} alt="" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover" />
      <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink-soft">
        {a.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-2xl">Continue</h2>
        <ul className="mt-4 space-y-3">
          {more.map((m) => (
            <li key={m.slug}>
              <Link to="/journal/$slug" params={{ slug: m.slug }} className="font-display text-xl">
                {m.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
