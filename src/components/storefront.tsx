import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getStorefront, type ReviewRow, type SettingsRow, type StockRow } from "@/lib/server/store";
import { PRODUCTS, PRODUCT_BY_SLUG, FREE_SHIPPING_OVER, WHATSAPP_NUMBER, type Product } from "@/lib/catalog";
import { FALLBACK_SETTINGS } from "@/lib/server/types";

type Ctx = {
  products: Product[];
  productBySlug: Record<string, Product>;
  stockById: Record<string, StockRow>;
  settings: SettingsRow;
  reviews: ReviewRow[];
  refresh: () => void;
  ready: boolean;
};

const FALLBACK: SettingsRow = {
  ...FALLBACK_SETTINGS,
  free_shipping_over: FREE_SHIPPING_OVER,
  whatsapp_number: WHATSAPP_NUMBER,
};

const StorefrontCtx = createContext<Ctx>({
  products: PRODUCTS,
  productBySlug: PRODUCT_BY_SLUG,
  stockById: {},
  settings: FALLBACK,
  reviews: [],
  refresh: () => {},
  ready: false,
});

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [stock, setStock] = useState<StockRow[]>([]);
  const [settings, setSettings] = useState<SettingsRow>(FALLBACK);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [ready, setReady] = useState(false);

  const refresh = () => {
    getStorefront()
      .then((d) => {
        setStock(d.stock);
        setSettings(d.settings);
        setReviews(d.reviews);
        if (d.products?.length) setProducts(d.products);
        setReady(true);
      })
      .catch(() => {
        setStock(PRODUCTS.map((p) => ({ id: p.slug, stock: p.defaultStock, sold_count: 0 })));
        setReady(true);
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  const stockById = useMemo(() => Object.fromEntries(stock.map((s) => [s.id, s])), [stock]);
  const productBySlug = useMemo(
    () => Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>,
    [products],
  );

  return (
    <StorefrontCtx.Provider value={{ products, productBySlug, stockById, settings, reviews, refresh, ready }}>
      {children}
    </StorefrontCtx.Provider>
  );
}

export function useStorefront() {
  return useContext(StorefrontCtx);
}

export function useStock(slug: string): number {
  const { stockById, productBySlug } = useStorefront();
  return stockById[slug]?.stock ?? productBySlug[slug]?.defaultStock ?? 0;
}

export function useProduct(slug: string): Product | undefined {
  const { productBySlug } = useStorefront();
  return productBySlug[slug];
}
