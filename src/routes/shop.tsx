import { createFileRoute, Outlet } from "@tanstack/react-router";

export type ShopSearch = {
  collection?: string;
  metal?: string;
  category?: string;
  occasion?: string;
  q?: string;
  sort?: string;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    collection: typeof s.collection === "string" ? s.collection : undefined,
    metal: typeof s.metal === "string" ? s.metal : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    occasion: typeof s.occasion === "string" ? s.occasion : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
  }),
  component: () => <Outlet />,
});
