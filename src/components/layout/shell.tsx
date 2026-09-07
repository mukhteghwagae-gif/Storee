import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Home,
  Menu,
  ScanLine,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  X,
  MessageCircle,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/catalog";
import { formatPkr } from "@/lib/format";
import { matchesQuery, expandQuery } from "@/lib/search";
import { searchHaystack } from "@/lib/catalog";
import { cartCount, cartSubtotal, freeShippingGap, hydrateLines, useSitara } from "@/lib/store";
import { getGoldRate, saveCartSnapshot, listMyWishlist, saveWishlist } from "@/lib/server/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Concierge } from "@/components/concierge";
import { PromoLayer } from "@/components/promo";
import { useStorefront } from "@/components/storefront";
import { NewsletterForm } from "@/components/newsletter-form";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/bridal", label: "Bridal" },
  { to: "/gifts", label: "Gifts" },
  { to: "/journal", label: "Journal" },
  { to: "/craft", label: "Craft" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideChrome = pathname.startsWith("/login");

  return (
    <div className="min-h-dvh bg-ivory text-ink">
      {!hideChrome && <GoldTicker />}
      {!hideChrome && <Header />}
      <div className={cn(!hideChrome && "pb-20 md:pb-0")}>{children}</div>
      {!hideChrome && <Footer />}
      {!hideChrome && <MobileNav />}
      {!hideChrome && <WhatsAppFab />}
      {!hideChrome && <Concierge />}
      {!hideChrome && <PromoLayer />}
      <CartSync />
      <WishSync />
    </div>
  );
}

function CartSync() {
  const cart = useSitara((s) => s.cart);
  const { user } = useCurrentUserState();
  useEffect(() => {
    if (!user) return;
    const t = window.setTimeout(() => {
      void saveCartSnapshot({ data: { payload: JSON.stringify(cart) } }).catch(() => {});
    }, 900);
    return () => window.clearTimeout(t);
  }, [cart, user]);
  return null;
}

function WishSync() {
  const wishlist = useSitara((s) => s.wishlist);
  const { user } = useCurrentUserState();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      setReady(false);
      return;
    }
    let cancelled = false;
    listMyWishlist()
      .then((rows) => {
        if (cancelled) return;
        const server = rows.map((r) => r.product_id);
        const local = useSitara.getState().wishlist;
        const merged = Array.from(new Set([...local, ...server]));
        useSitara.setState({ wishlist: merged });
        setReady(true);
      })
      .catch(() => setReady(true));
    return () => {
      cancelled = true;
    };
  }, [user]);
  useEffect(() => {
    if (!user || !ready) return;
    const t = window.setTimeout(() => {
      void saveWishlist({ data: { slugs: wishlist } }).catch(() => {});
    }, 900);
    return () => window.clearTimeout(t);
  }, [wishlist, user, ready]);
  return null;
}

function GoldTicker() {
  const [rate, setRate] = useState({ pkr: 352000, karat22: 322667, source: "stored" });
  useEffect(() => {
    getGoldRate()
      .then((r) => setRate(r))
      .catch(() => {});
  }, []);
  const items = [
    `24k gold · ${formatPkr(rate.pkr)} / tola`,
    `22k gold · ${formatPkr(rate.karat22)} / tola`,
    "Hallmarked · Lahore atelier",
    "Complimentary shipping over Rs 5,000",
    "Cash on delivery across Pakistan",
    "Atelier board · not a live exchange feed",
  ];
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-border bg-emerald text-[11px] uppercase tracking-[0.18em] text-ivory">
      <div className="flex w-max animate-[sitara-ticker_32s_linear_infinite] py-2">
        {loop.map((t, i) => (
          <span key={i} className="px-6 whitespace-nowrap">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const cart = useSitara((s) => s.cart);
  const count = cartCount(cart);
  const { user, isPending } = useCurrentUserState();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-[4.5rem]">
        <button
          type="button"
          className="grid size-11 place-items-center md:hidden"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5" />
        </button>
        <Link to="/" className="flex flex-col items-center leading-none">
          <span className="font-display text-[1.65rem] tracking-[0.22em] text-ink md:text-3xl">
            {STORE_NAME}
          </span>
          <span className="hidden text-[9px] tracking-[0.38em] text-stone uppercase md:block">
            Fine Jewellery · Lahore
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-[12px] tracking-[0.16em] uppercase md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-ink-soft hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="grid size-11 place-items-center"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-5" />
          </button>
          <div className="hidden md:block">
            {isPending ? (
              <div className="size-8 animate-pulse rounded-full bg-ivory-deep" />
            ) : user ? (
              <UserButton />
            ) : (
              <Link to="/login" className="grid size-11 place-items-center" aria-label="Sign in">
                <User className="size-5" />
              </Link>
            )}
          </div>
          <button
            type="button"
            aria-label="Bag"
            className="relative grid size-11 place-items-center"
            onClick={() => setBagOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-emerald text-[9px] text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      {bagOpen && <BagDrawer onClose={() => setBagOpen(false)} />}
    </header>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const { products } = useStorefront();
  const results = useMemo(() => {
    if (!q.trim()) return products.slice(0, 6);
    return products.filter((p) => matchesQuery(searchHaystack(p), q)).slice(0, 8);
  }, [q, products]);
  const synonyms = q ? expandQuery(q).slice(0, 6) : [];

  return (
    <div className="fixed inset-0 z-50 bg-ink/40" onClick={onClose}>
      <div
        className="mx-auto mt-0 max-w-2xl rounded-b-2xl bg-ivory p-4 shadow-sitara md:mt-16 md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Search className="size-4 text-stone" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gold ring, ear tops, kangan…"
            className="h-11 flex-1 bg-transparent text-base outline-none placeholder:text-stone"
          />
          <button type="button" className="grid size-10 place-items-center" onClick={onClose}>
            <X className="size-4" />
          </button>
        </div>
        {synonyms.length > 0 && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-stone">
            Also matching {synonyms.join(" · ")}
          </p>
        )}
        <ul className="mt-3 divide-y divide-border">
          {results.map((p) => (
            <li key={p.slug}>
              <Link
                to="/shop/$slug"
                params={{ slug: p.slug }}
                onClick={onClose}
                className="flex items-center gap-3 py-3"
              >
                <img src={p.images[0]} alt="" className="size-14 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg">{p.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-stone">
                    {p.karat ?? p.metal} · {p.category}
                  </p>
                </div>
                <span className="text-sm tabular-nums">{formatPkr(p.price)}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && (
            <li className="py-8 text-center text-sm text-stone">No pieces match that search.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/40 md:hidden" onClick={onClose}>
      <div className="h-full w-[82%] max-w-sm bg-ivory p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl tracking-[0.18em]">SITARA</span>
          <button type="button" className="grid size-11 place-items-center" onClick={onClose}>
            <X />
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-4 font-display text-2xl">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={onClose}>
              {n.label}
            </Link>
          ))}
          <Link to="/account" onClick={onClose}>
            Account
          </Link>
          <Link to="/wishlist" onClick={onClose}>
            Wishlist
          </Link>
          <Link to="/try-on" onClick={onClose}>
            Try on
          </Link>
          <Link to="/stack" onClick={onClose}>
            Stack
          </Link>
          <Link to="/size-guide" onClick={onClose}>
            Size guide
          </Link>
          <Link to="/contact" onClick={onClose}>
            Contact
          </Link>
          <Link to="/atelier" onClick={onClose} className="text-stone">
            Atelier
          </Link>
        </nav>
      </div>
    </div>
  );
}

function BagDrawer({ onClose }: { onClose: () => void }) {
  const cart = useSitara((s) => s.cart);
  const setQty = useSitara((s) => s.setQty);
  const remove = useSitara((s) => s.remove);
  const { settings, productBySlug } = useStorefront();
  const lines = hydrateLines(cart, productBySlug);
  const sub = cartSubtotal(cart, productBySlug);
  const gap = freeShippingGap(sub, settings.free_shipping_over);
  const progress = Math.min(100, (sub / settings.free_shipping_over) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-ink/40" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-sitara"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-2xl">Your bag</h2>
          <button type="button" className="grid size-11 place-items-center" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="border-b border-border px-5 py-3">
          <div className="h-1 overflow-hidden rounded-full bg-ivory-deep">
            <div className="h-full bg-emerald transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-stone">
            {gap === 0
              ? "Complimentary shipping unlocked."
              : `Add ${formatPkr(gap)} more for complimentary shipping.`}
          </p>
        </div>
        <ul className="flex-1 overflow-auto px-5 py-4">
          {lines.length === 0 && (
            <li className="py-16 text-center text-sm text-stone">Your bag is empty. The atelier is not.</li>
          )}
          {lines.map(({ product, line }) => (
            <li key={`${product.slug}-${line.size ?? ""}`} className="mb-4 flex gap-3">
              <img src={product.images[0]} alt="" className="size-20 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight">{product.name}</p>
                {line.size && <p className="text-xs text-stone">Size {line.size}</p>}
                <p className="text-sm tabular-nums">{formatPkr(product.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button type="button" onClick={() => setQty(product.slug, line.size, line.qty - 1)}>
                    −
                  </button>
                  <span className="tabular-nums text-sm">{line.qty}</span>
                  <button type="button" onClick={() => setQty(product.slug, line.size, line.qty + 1)}>
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-auto text-xs uppercase tracking-[0.14em] text-stone"
                    onClick={() => remove(product.slug, line.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-border p-5">
          <div className="mb-3 flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPkr(sub)}</span>
          </div>
          <Button className="w-full" asChild>
            <Link to="/checkout" onClick={onClose}>
              Checkout
            </Link>
          </Button>
          <Button variant="ghost" className="mt-1 w-full" asChild>
            <Link to="/cart" onClick={onClose}>
              Review bag
            </Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-ivory-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-3xl tracking-[0.18em]">SITARA</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            A Lahore house of 22k gold, kundan, and the quiet pieces you actually live in.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">House</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/craft">Our Craft</Link>
            </li>
            <li>
              <Link to="/journal">The Journal</Link>
            </li>
            <li>
              <Link to="/lookbook">Lookbook</Link>
            </li>
            <li>
              <Link to="/size-guide">Size guide</Link>
            </li>
            <li>
              <Link to="/care">Jewellery care</Link>
            </li>
            <li>
              <Link to="/returns">Returns</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Atelier</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <Link to="/track">Track order</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/atelier">Private office</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">The list</p>
          <p className="mt-3 text-sm text-ink-soft">First look at bridal edits. A code, occasionally.</p>
          <div className="mt-3">
            <NewsletterForm compact />
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-[11px] uppercase tracking-[0.16em] text-stone">
        Sitara Atelier · Hallmarked gold · GST invoice on request · Pakistan
      </div>
    </footer>
  );
}

function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useSitara((s) => cartCount(s.cart));
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Sparkles },
    { to: "/try-on", label: "Try on", icon: ScanLine },
    { to: "/journal", label: "Journal", icon: BookOpen },
    { to: "/cart", label: "Bag", icon: ShoppingBag },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] uppercase tracking-[0.12em]",
                  active ? "text-emerald" : "text-stone",
                )}
              >
                <Icon className="size-5" />
                {it.label}
                {it.to === "/cart" && count > 0 && (
                  <span className="absolute right-[22%] top-1 grid size-4 place-items-center rounded-full bg-emerald text-[9px] text-ivory">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function WhatsAppFab() {
  const { settings } = useStorefront();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hide = pathname.startsWith("/shop/") && pathname !== "/shop" && pathname !== "/shop/";
  if (hide) return null;
  const n = settings.whatsapp_number || WHATSAPP_NUMBER;
  return (
    <a
      href={`https://wa.me/${n}?text=${encodeURIComponent("Salaam Sitara — I have a question about a piece.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp the atelier"
      className="fixed bottom-20 right-4 z-30 grid size-14 place-items-center rounded-full bg-emerald text-ivory shadow-sitara md:bottom-6"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}

export function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-8 w-8 animate-pulse rounded-full bg-ivory-deep" />;
  return user ? (
    <UserButton />
  ) : (
    <Link to="/login" className="text-sm">
      Sign in
    </Link>
  );
}

export { SignedIn, SignedOut };
