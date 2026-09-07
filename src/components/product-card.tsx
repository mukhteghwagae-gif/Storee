import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ScanLine, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { tryOnZoneFor } from "@/lib/ar/intelligence";
import { formatPkr } from "@/lib/format";
import { useSitara } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useStock } from "./storefront";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [hover, setHover] = useState(false);
  const stock = useStock(product.slug);
  const wishlist = useSitara((s) => s.wishlist);
  const toggleWish = useSitara((s) => s.toggleWish);
  const addToCart = useSitara((s) => s.addToCart);
  const wished = wishlist.includes(product.slug);
  const img = hover && product.hoverImage ? product.hoverImage : product.images[0];
  const needsSize = product.sizeType === "ring" || product.sizeType === "bangle";

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to="/shop/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-ivory-deep">
          <img
            src={img}
            alt={product.name}
            width={600}
            height={800}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          {stock > 0 && stock <= 5 && (
            <span className="absolute left-3 top-3 rounded-md bg-ivory/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
              Only {stock} left
            </span>
          )}
          {stock <= 0 && (
            <span className="absolute inset-0 grid place-items-center bg-ink/35 text-xs uppercase tracking-[0.2em] text-ivory">
              Waitlist
            </span>
          )}
          {product.compareAt && (
            <span className="absolute right-3 top-3 rounded-md bg-emerald px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ivory">
              Courtesy
            </span>
          )}
          {tryOnZoneFor(product) && !product.compareAt && (
            <span className="absolute left-3 bottom-3 rounded-md bg-ivory/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink">
              <ScanLine className="mr-1 inline size-3" />
              Try on
            </span>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg leading-tight text-ink">{product.name}</h3>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-stone">
              {product.karat ?? product.metal} · {product.collection.replace(/-/g, " ")}
            </p>
          </div>
          <p className="shrink-0 text-sm tabular-nums text-ink">{formatPkr(product.price)}</p>
        </div>
        {product.compareAt && (
          <p className="text-xs text-stone line-through tabular-nums">{formatPkr(product.compareAt)}</p>
        )}
      </Link>
      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Save"}
          onClick={() => toggleWish(product.slug)}
          className={cn(
            "grid size-11 place-items-center rounded-full bg-ivory/90 text-ink shadow-sitara transition-transform duration-150",
            wished && "text-emerald",
          )}
        >
          <Heart className={cn("size-4", wished && "fill-current")} />
        </button>
      </div>
      {needsSize ? (
        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="absolute bottom-16 left-3 right-3 flex h-11 translate-y-3 items-center justify-center gap-2 rounded-lg bg-ink text-sm text-ivory opacity-0 pointer-events-none transition-[opacity,transform] duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-md:pointer-events-auto max-md:static max-md:mt-3 max-md:translate-y-0 max-md:opacity-100"
        >
          Choose size
        </Link>
      ) : (
        <button
          type="button"
          disabled={stock <= 0}
          onClick={() => addToCart(product.slug)}
          className="absolute bottom-16 left-3 right-3 flex h-11 translate-y-3 items-center justify-center gap-2 rounded-lg bg-ink text-sm text-ivory opacity-0 pointer-events-none transition-[opacity,transform] duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-md:pointer-events-auto max-md:static max-md:mt-3 max-md:translate-y-0 max-md:opacity-100"
        >
          <ShoppingBag className="size-4" />
          {stock <= 0 ? "Notify" : "Quick add"}
        </button>
      )}
    </article>
  );
}
