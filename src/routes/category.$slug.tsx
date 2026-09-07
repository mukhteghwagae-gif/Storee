import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORY_LABEL, type Category } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog-page";
import { useStorefront } from "@/components/storefront";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [{ title: `${CATEGORY_LABEL[params.slug as Category] ?? "Category"} — Sitara` }],
  }),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const label = CATEGORY_LABEL[slug as Category];
  const { products } = useStorefront();
  if (!label) {
    return (
      <main className="px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Unknown category</h1>
        <Button className="mt-6" asChild>
          <Link to="/shop">Shop</Link>
        </Button>
      </main>
    );
  }
  return (
    <CatalogPage
      kicker="Category"
      title={label}
      dek={`Every ${label.toLowerCase()} currently on the tray.`}
      products={products.filter((p) => p.category === slug)}
      crumbs={[{ to: "/shop", label: "Shop" }, { label }]}
    />
  );
}
