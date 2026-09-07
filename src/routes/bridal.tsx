import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { useStorefront } from "@/components/storefront";

export const Route = createFileRoute("/bridal")({
  component: Bridal,
  head: () => ({ meta: [{ title: "Bridal — Sitara" }] }),
});

function Bridal() {
  const { products } = useStorefront();
  return (
    <CatalogPage
      kicker="Trousseau"
      title="Bridal Couture"
      dek="Closed chokers, a tikka, kangan. Pieces wrought for a lifetime, not a single stage."
      products={products.filter((p) => p.occasion.includes("bridal"))}
      crumbs={[{ to: "/shop", label: "Shop" }, { label: "Bridal" }]}
    />
  );
}
