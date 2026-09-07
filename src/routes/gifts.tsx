import { createFileRoute, Link } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { useStorefront } from "@/components/storefront";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/gifts")({
  component: Gifts,
  head: () => ({ meta: [{ title: "Gifts — Sitara" }] }),
});

function Gifts() {
  const { products } = useStorefront();
  const list = products.filter((p) => p.price <= 80000);
  return (
    <>
      <CatalogPage
        kicker="Gifts"
        title="A present that will be worn"
        dek="Under Rs 80,000, and the quiet pieces that survive a Tuesday. For a finder that asks four questions, open the Gift Finder."
        products={list}
        crumbs={[{ to: "/shop", label: "Shop" }, { label: "Gifts" }]}
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Button asChild>
          <Link to="/finder">Open the Gift Finder</Link>
        </Button>
      </div>
    </>
  );
}
