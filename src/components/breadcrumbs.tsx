import { Link } from "@tanstack/react-router";

export function Breadcrumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.18em] text-stone">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2">
            <span aria-hidden="true">·</span>
            {it.to ? (
              <Link to={it.to as "/"}>{it.label}</Link>
            ) : (
              <span className="text-ink">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
