import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { useStorefront } from "@/components/storefront";

export const Route = createFileRoute("/arrivals")({
  component: Arrivals,
  head: () => ({ meta: [{ title: "New arrivals — Sitara" }] }),
});

function Arrivals() {
  const { products } = useStorefront();
  return (
    <CatalogPage
      kicker="Just in"
      title="New arrivals"
      dek="What left the bench this season."
      products={products.filter((p) => p.newest)}
      crumbs={[{ to: "/shop", label: "Shop" }, { label: "New arrivals" }]}
    />
  );
}
