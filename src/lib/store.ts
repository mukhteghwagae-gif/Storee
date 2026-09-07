import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCT_BY_SLUG, FREE_SHIPPING_OVER, type Product } from "./catalog";

export type CartLine = {
  slug: string;
  qty: number;
  size?: string;
};

type SitaraState = {
  cart: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  referralInput: string;
  redeemCoins: number;
  couponCode: string;
  giftWrap: boolean;
  giftMessage: string;
  addToCart: (slug: string, qty?: number, size?: string) => void;
  setQty: (slug: string, size: string | undefined, qty: number) => void;
  remove: (slug: string, size?: string) => void;
  clearCart: () => void;
  toggleWish: (slug: string) => void;
  view: (slug: string) => void;
  setReferralInput: (code: string) => void;
  setRedeemCoins: (n: number) => void;
  setCouponCode: (code: string) => void;
  setGiftWrap: (on: boolean) => void;
  setGiftMessage: (msg: string) => void;
};

function lineKey(l: CartLine) {
  return `${l.slug}::${l.size ?? ""}`;
}

export const useSitara = create<SitaraState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      referralInput: "",
      redeemCoins: 0,
      couponCode: "",
      giftWrap: false,
      giftMessage: "",
      addToCart: (slug, qty = 1, size) => {
        const cart = [...get().cart];
        const i = cart.findIndex((l) => l.slug === slug && (l.size ?? "") === (size ?? ""));
        if (i >= 0) cart[i] = { ...cart[i], qty: cart[i].qty + qty };
        else cart.push({ slug, qty, size });
        set({ cart });
      },
      setQty: (slug, size, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((l) => !(l.slug === slug && (l.size ?? "") === (size ?? ""))) });
          return;
        }
        set({
          cart: get().cart.map((l) =>
            l.slug === slug && (l.size ?? "") === (size ?? "") ? { ...l, qty } : l,
          ),
        });
      },
      remove: (slug, size) =>
        set({ cart: get().cart.filter((l) => !(l.slug === slug && (l.size ?? "") === (size ?? ""))) }),
      clearCart: () => set({ cart: [], redeemCoins: 0, giftWrap: false, giftMessage: "" }),
      toggleWish: (slug) => {
        const w = get().wishlist;
        set({ wishlist: w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug] });
      },
      view: (slug) => {
        const next = [slug, ...get().recentlyViewed.filter((s) => s !== slug)].slice(0, 8);
        set({ recentlyViewed: next });
      },
      setReferralInput: (referralInput) => set({ referralInput }),
      setRedeemCoins: (redeemCoins) => set({ redeemCoins }),
      setCouponCode: (couponCode) => set({ couponCode }),
      setGiftWrap: (giftWrap) => set({ giftWrap }),
      setGiftMessage: (giftMessage) => set({ giftMessage }),
    }),
    { name: "sitara-store" },
  ),
);

export function hydrateLines(
  cart: CartLine[],
  catalog: Record<string, Product> = PRODUCT_BY_SLUG,
): { product: Product; line: CartLine }[] {
  return cart
    .map((line) => {
      const product = catalog[line.slug] ?? PRODUCT_BY_SLUG[line.slug];
      return product ? { product, line } : null;
    })
    .filter((x): x is { product: Product; line: CartLine } => Boolean(x));
}

export function cartSubtotal(cart: CartLine[], catalog: Record<string, Product> = PRODUCT_BY_SLUG): number {
  return hydrateLines(cart, catalog).reduce((s, { product, line }) => s + product.price * line.qty, 0);
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((s, l) => s + l.qty, 0);
}

export function freeShippingGap(subtotal: number, threshold = FREE_SHIPPING_OVER): number {
  return Math.max(0, threshold - subtotal);
}

export { lineKey };
