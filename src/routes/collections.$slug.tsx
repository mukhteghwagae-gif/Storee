import { createFileRoute, Link } from "@tanstack/react-router";
import { COLLECTIONS } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog-page";
import { useStorefront } from "@/components/storefront";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/collections/$slug")({
  component: Collection,
  head: ({ params }) => ({
    meta: [{ title: `${COLLECTIONS.find((c) => c.slug === params.slug)?.name ?? "Collection"} — Sitara` }],
  }),
});

function Collection() {
  const { slug } = Route.useParams();
  const col = COLLECTIONS.find((c) => c.slug === slug);
  const { products } = useStorefront();
  if (!col) {
    return (
      <main className="px-4 py-24 text-center">
        <h1 className="font-display text-4xl">That room is closed</h1>
        <Button className="mt-6" asChild>
          <Link to="/collections">Collections</Link>
        </Button>
      </main>
    );
  }
  return (
    <CatalogPage
      kicker="Collection"
      title={col.name}
      dek={col.blurb}
      products={products.filter((p) => p.collection === col.slug)}
      crumbs={[{ to: "/collections", label: "Collections" }, { label: col.name }]}
    />
  );
}
