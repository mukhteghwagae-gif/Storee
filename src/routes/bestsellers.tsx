import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { useStorefront } from "@/components/storefront";

export const Route = createFileRoute("/bestsellers")({
  component: Bestsellers,
  head: () => ({ meta: [{ title: "Best sellers — Sitara" }] }),
});

function Bestsellers() {
  const { products } = useStorefront();
  return (
    <CatalogPage
      kicker="The tray"
      title="Best sellers"
      dek="Pieces the house stands behind — not a fabricated sales rank."
      products={products.filter((p) => p.bestSeller)}
      crumbs={[{ to: "/shop", label: "Shop" }, { label: "Best sellers" }]}
    />
  );
}
