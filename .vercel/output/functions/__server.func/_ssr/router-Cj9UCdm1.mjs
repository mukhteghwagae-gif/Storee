import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, S as useRouter, _ as createRootRoute, b as Navigate, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { c as PRODUCT_BY_SLUG, d as authMiddleware, h as searchHaystack, l as STORE_NAME, n as COLLECTIONS, r as FREE_SHIPPING_OVER, s as PRODUCTS, t as CATEGORY_LABEL, u as WHATSAPP_NUMBER } from "./catalog-BkM9Pw9j.mjs";
import { a as joinList, r as createSsrRpc } from "./commerce-BpEajYIO.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut, t as authClient } from "./client-B40BzJxt.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { a as hasGateSessionMarker, n as auth } from "./server-BP8Sg7MF.mjs";
import { t as FALLBACK_SETTINGS } from "./types-hTcay00G.mjs";
import { _ as Menu, a as Sparkles, d as ScanLine, g as MessageCircle, h as MessageSquareText, l as Send, n as User, o as ShoppingBag, t as X, u as Search, w as BookOpen, y as House } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-DG6UNzh9.js
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/button-D8GeZoPT.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ivory", {
	variants: {
		variant: {
			primary: "bg-emerald text-ivory hover:bg-emerald-deep",
			gold: "bg-gold text-ink hover:bg-gold-deep hover:text-ivory",
			outline: "border border-ink/20 bg-transparent text-ink hover:border-ink/50 hover:bg-ivory-deep",
			ghost: "text-ink hover:bg-ivory-deep",
			ink: "bg-ink text-ivory hover:bg-ink-soft",
			link: "text-emerald underline-offset-4 hover:underline px-0 h-auto"
		},
		size: {
			sm: "h-9 px-3 text-xs rounded-md",
			md: "h-11 px-5 text-sm rounded-lg",
			lg: "h-12 px-6 text-sm rounded-lg",
			icon: "size-11 rounded-lg"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cj9UCdm1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-4 bg-ivory px-6 text-center text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.22em] text-stone",
				children: "Sitara"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "The tray slipped"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-ink-soft",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				className: "mt-2 text-sm uppercase tracking-[0.16em] underline",
				children: "Return to the house"
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var getStorefront = createServerFn({ method: "GET" }).handler(createSsrRpc("26949476df6d4084ed50a1335467c20a327b12704e74a296394dc03e66e6fe98"));
var getGoldRate = createServerFn({ method: "GET" }).handler(createSsrRpc("f7fe77b79a96c2c41b22ffd92164dc008d597413bf468962561e612594eaa9dd"));
var getOrCreateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("41ad742696eeedcc708771882429a25b52dd696f31111510fd06d66d2f00f309"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d4e0225a0b471b3c0eefda06f6f0fe8748fc43cdbd0ec8f87580631bfa1bfc0c"));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5ad950e41c542dee0a0328e59f13c7eda7ed5baa488c3cb0ed020198f268ef1b"));
var addReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6b704a62b6fce4d788fad4833b7815b4e409608caf6a470e8ae1618b1262c280"));
var toggleStockAlert = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e452d6973042f2a0288cb12e75867a0002c50a38f742a55c9a7f1b630b291b1c"));
var saveCartSnapshot = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("148cbc00a5255877d1917eb866d3e516e232c9dc6772d7322d05114b43aab399"));
var askConcierge = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4efdcbcea9c03324aebf44ae857b2c7ae8552cf67db005ecf1e050f44e8dbf45"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("97af7a6f7e753cdd3c9fca1a85e83dbf256c42ca89bdcc5adf61b049585cdc98"));
var listMyWishlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("558dc2c9cbd4d799561df08ddcc02f663e81f64d3106b36d8c0942ca246387cc"));
var saveWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fa96b75bc1ddee41e5998a50f5462d72c6f8de702304545cd7729108722736ff"));
var FALLBACK = {
	...FALLBACK_SETTINGS,
	free_shipping_over: FREE_SHIPPING_OVER,
	whatsapp_number: WHATSAPP_NUMBER
};
var StorefrontCtx = (0, import_react.createContext)({
	products: PRODUCTS,
	productBySlug: PRODUCT_BY_SLUG,
	stockById: {},
	settings: FALLBACK,
	reviews: [],
	refresh: () => {},
	ready: false
});
function StorefrontProvider({ children }) {
	const [stock, setStock] = (0, import_react.useState)([]);
	const [settings, setSettings] = (0, import_react.useState)(FALLBACK);
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [products, setProducts] = (0, import_react.useState)(PRODUCTS);
	const [ready, setReady] = (0, import_react.useState)(false);
	const refresh = () => {
		getStorefront().then((d) => {
			setStock(d.stock);
			setSettings(d.settings);
			setReviews(d.reviews);
			if (d.products?.length) setProducts(d.products);
			setReady(true);
		}).catch(() => {
			setStock(PRODUCTS.map((p) => ({
				id: p.slug,
				stock: p.defaultStock,
				sold_count: 0
			})));
			setReady(true);
		});
	};
	(0, import_react.useEffect)(() => {
		refresh();
	}, []);
	const stockById = (0, import_react.useMemo)(() => Object.fromEntries(stock.map((s) => [s.id, s])), [stock]);
	const productBySlug = (0, import_react.useMemo)(() => Object.fromEntries(products.map((p) => [p.slug, p])), [products]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorefrontCtx.Provider, {
		value: {
			products,
			productBySlug,
			stockById,
			settings,
			reviews,
			refresh,
			ready
		},
		children
	});
}
function useStorefront() {
	return (0, import_react.useContext)(StorefrontCtx);
}
function useStock(slug) {
	const { stockById, productBySlug } = useStorefront();
	return stockById[slug]?.stock ?? productBySlug[slug]?.defaultStock ?? 0;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
/** Pakistani / Indian grouping: 12,50,000 */
function formatPkr(amount) {
	const rounded = Math.round(amount);
	const sign = rounded < 0 ? "-" : "";
	const str = String(Math.abs(rounded));
	if (str.length <= 3) return `${sign}Rs ${str}`;
	const last3 = str.slice(-3);
	return `${sign}Rs ${str.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`;
}
var SYNONYMS = {
	earrings: [
		"earring",
		"ear tops",
		"tops",
		"jhumka",
		"jhumkas",
		"hoops",
		"studs",
		"drops",
		"bali"
	],
	necklace: [
		"necklaces",
		"chain",
		"chains",
		"locket",
		"lockets",
		"choker",
		"haar",
		"set"
	],
	ring: [
		"rings",
		"challa",
		"anguthi"
	],
	bangle: [
		"bangles",
		"kangan",
		"kangans",
		"kara",
		"bracelet",
		"cuffs"
	],
	bracelet: [
		"bracelets",
		"kada",
		"cuffs"
	],
	anklet: [
		"anklets",
		"payal",
		"payals",
		"paazeb"
	],
	tikka: [
		"tika",
		"maang",
		"matha patti",
		"headpiece"
	],
	bridal: [
		"bride",
		"trousseau",
		"shaadi",
		"wedding",
		"barat",
		"walima",
		"set"
	],
	gold: [
		"22k",
		"18k",
		"sona",
		"zar"
	],
	silver: ["chandi", "oxidized"],
	emerald: ["zamrud", "green"],
	pearl: ["moti", "pearls"]
};
function expandQuery(raw) {
	const q = raw.trim().toLowerCase();
	if (!q) return [];
	const tokens = q.split(/\s+/).filter(Boolean);
	const extra = [];
	for (const [canonical, alts] of Object.entries(SYNONYMS)) if (tokens.includes(canonical) || alts.some((a) => q.includes(a))) extra.push(canonical, ...alts);
	return Array.from(/* @__PURE__ */ new Set([...tokens, ...extra]));
}
function matchesQuery(haystack, query) {
	const terms = expandQuery(query);
	if (terms.length === 0) return true;
	const h = haystack.toLowerCase();
	const original = query.trim().toLowerCase();
	if (h.includes(original)) return true;
	return terms.some((t) => t.length > 1 && h.includes(t));
}
var useSitara = create()(persist((set, get) => ({
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
		if (i >= 0) cart[i] = {
			...cart[i],
			qty: cart[i].qty + qty
		};
		else cart.push({
			slug,
			qty,
			size
		});
		set({ cart });
	},
	setQty: (slug, size, qty) => {
		if (qty <= 0) {
			set({ cart: get().cart.filter((l) => !(l.slug === slug && (l.size ?? "") === (size ?? ""))) });
			return;
		}
		set({ cart: get().cart.map((l) => l.slug === slug && (l.size ?? "") === (size ?? "") ? {
			...l,
			qty
		} : l) });
	},
	remove: (slug, size) => set({ cart: get().cart.filter((l) => !(l.slug === slug && (l.size ?? "") === (size ?? ""))) }),
	clearCart: () => set({
		cart: [],
		redeemCoins: 0,
		giftWrap: false,
		giftMessage: ""
	}),
	toggleWish: (slug) => {
		const w = get().wishlist;
		set({ wishlist: w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug] });
	},
	view: (slug) => {
		set({ recentlyViewed: [slug, ...get().recentlyViewed.filter((s) => s !== slug)].slice(0, 8) });
	},
	setReferralInput: (referralInput) => set({ referralInput }),
	setRedeemCoins: (redeemCoins) => set({ redeemCoins }),
	setCouponCode: (couponCode) => set({ couponCode }),
	setGiftWrap: (giftWrap) => set({ giftWrap }),
	setGiftMessage: (giftMessage) => set({ giftMessage })
}), { name: "sitara-store" }));
function hydrateLines(cart, catalog = PRODUCT_BY_SLUG) {
	return cart.map((line) => {
		const product = catalog[line.slug] ?? PRODUCT_BY_SLUG[line.slug];
		return product ? {
			product,
			line
		} : null;
	}).filter((x) => Boolean(x));
}
function cartSubtotal(cart, catalog = PRODUCT_BY_SLUG) {
	return hydrateLines(cart, catalog).reduce((s, { product, line }) => s + product.price * line.qty, 0);
}
function cartCount(cart) {
	return cart.reduce((s, l) => s + l.qty, 0);
}
function freeShippingGap(subtotal, threshold = FREE_SHIPPING_OVER) {
	return Math.max(0, threshold - subtotal);
}
function Concierge() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const hide = pathname.startsWith("/checkout") || pathname.startsWith("/atelier") || pathname.startsWith("/shop/") && pathname !== "/shop" && pathname !== "/shop/";
	const [open, setOpen] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msgs, setMsgs] = (0, import_react.useState)([{
		role: "assistant",
		content: "I am the Sitara concierge. Ask me if a piece is anti-tarnish, 22k, or in stock."
	}]);
	async function send() {
		const text = input.trim();
		if (!text || busy) return;
		setInput("");
		const next = [...msgs, {
			role: "user",
			content: text
		}];
		setMsgs(next);
		setBusy(true);
		const res = await askConcierge({ data: {
			message: text,
			history: next.filter((m) => m.role !== "assistant" || next.indexOf(m) > 0).slice(-6)
		} }).catch(() => ({
			ok: false,
			error: "Unavailable"
		}));
		setBusy(false);
		setMsgs([...next, {
			role: "assistant",
			content: res.ok ? res.text : res.error ?? "WhatsApp us — the desk will answer."
		}]);
	}
	if (hide) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Concierge",
		onClick: () => setOpen(true),
		className: "fixed bottom-20 left-4 z-30 grid size-12 place-items-center rounded-full border border-border bg-ivory text-ink shadow-sitara md:bottom-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareText, { className: "size-5" })
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-24 left-4 z-40 flex h-[28rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-border bg-ivory shadow-sitara md:bottom-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Concierge"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-[0.16em] text-stone",
					children: "Trained on the catalog"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-10 place-items-center",
					onClick: () => setOpen(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-auto p-4 text-sm",
				children: [msgs.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: m.role === "user" ? "ml-8 rounded-xl bg-emerald px-3 py-2 text-ivory" : "mr-6 rounded-xl bg-ivory-deep px-3 py-2 text-ink",
					children: m.content
				}, i)), busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-stone",
					children: "Looking through the trays…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2 border-t border-border p-3",
				onSubmit: (e) => {
					e.preventDefault();
					send();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Is this anti-tarnish?",
					className: "h-11 flex-1 rounded-lg border border-border bg-card px-3 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					disabled: busy,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
				})]
			})
		]
	})] });
}
function PromoLayer() {
	const setCouponCode = useSitara((s) => s.setCouponCode);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [claimed, setClaimed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (localStorage.getItem("sitara-welcome")) return;
		const t = window.setTimeout(() => setOpen(true), 18e3);
		return () => window.clearTimeout(t);
	}, []);
	function close() {
		setOpen(false);
		localStorage.setItem("sitara-welcome", "1");
	}
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-sm rounded-2xl bg-ivory p-6 shadow-sitara",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute right-2 top-2 grid size-11 place-items-center",
					onClick: close,
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "The list"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl",
					children: "A quiet courtesy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink-soft",
					children: "STARLIGHT10 — ten percent, applied at checkout if the desk still honours it. No mail leaves until a provider is connected."
				}),
				claimed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-emerald",
					children: "You are on the list. The code is saved for checkout."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-col gap-2",
					onSubmit: async (e) => {
						e.preventDefault();
						if (!email.includes("@")) return;
						await joinList({ data: { email } }).catch(() => {});
						setCouponCode("STARLIGHT10");
						setClaimed(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "Email",
						className: "h-11 rounded-lg border border-border bg-card px-3 text-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Join the list"
					})]
				})
			]
		})
	});
}
function NewsletterForm({ compact }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await joinList({ data: { email } });
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not join");
		} finally {
			setBusy(false);
		}
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-emerald",
		children: "You are on the list. No welcome email is sent until the desk is connected."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				required: true,
				type: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: "Email",
				className: "h-11 flex-1 rounded-lg border border-border bg-ivory px-3 text-sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "md",
				disabled: busy,
				children: busy ? "Joining…" : "Join"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "w-full text-sm text-destructive",
				children: error
			})
		]
	});
}
var NAV = [
	{
		to: "/shop",
		label: "Shop"
	},
	{
		to: "/bridal",
		label: "Bridal"
	},
	{
		to: "/gifts",
		label: "Gifts"
	},
	{
		to: "/journal",
		label: "Journal"
	},
	{
		to: "/craft",
		label: "Craft"
	}
];
function Shell({ children }) {
	const hideChrome = useRouterState({ select: (s) => s.location.pathname }).startsWith("/login");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-ivory text-ink",
		children: [
			!hideChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldTicker, {}),
			!hideChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn(!hideChrome && "pb-20 md:pb-0"),
				children
			}),
			!hideChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			!hideChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNav, {}),
			!hideChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppFab, {}),
			!hideChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Concierge, {}),
			!hideChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromoLayer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartSync, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishSync, {})
		]
	});
}
function CartSync() {
	const cart = useSitara((s) => s.cart);
	const { user } = useCurrentUserState();
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const t = window.setTimeout(() => {
			saveCartSnapshot({ data: { payload: JSON.stringify(cart) } }).catch(() => {});
		}, 900);
		return () => window.clearTimeout(t);
	}, [cart, user]);
	return null;
}
function WishSync() {
	const wishlist = useSitara((s) => s.wishlist);
	const { user } = useCurrentUserState();
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setReady(false);
			return;
		}
		let cancelled = false;
		listMyWishlist().then((rows) => {
			if (cancelled) return;
			const server = rows.map((r) => r.product_id);
			const local = useSitara.getState().wishlist;
			const merged = Array.from(/* @__PURE__ */ new Set([...local, ...server]));
			useSitara.setState({ wishlist: merged });
			setReady(true);
		}).catch(() => setReady(true));
		return () => {
			cancelled = true;
		};
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (!user || !ready) return;
		const t = window.setTimeout(() => {
			saveWishlist({ data: { slugs: wishlist } }).catch(() => {});
		}, 900);
		return () => window.clearTimeout(t);
	}, [
		wishlist,
		user,
		ready
	]);
	return null;
}
function GoldTicker() {
	const [rate, setRate] = (0, import_react.useState)({
		pkr: 352e3,
		karat22: 322667,
		source: "stored"
	});
	(0, import_react.useEffect)(() => {
		getGoldRate().then((r) => setRate(r)).catch(() => {});
	}, []);
	const items = [
		`24k gold · ${formatPkr(rate.pkr)} / tola`,
		`22k gold · ${formatPkr(rate.karat22)} / tola`,
		"Hallmarked · Lahore atelier",
		"Complimentary shipping over Rs 5,000",
		"Cash on delivery across Pakistan",
		"Atelier board · not a live exchange feed"
	];
	const loop = [...items, ...items];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative overflow-hidden border-b border-border bg-emerald text-[11px] uppercase tracking-[0.18em] text-ivory",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex w-max animate-[sitara-ticker_32s_linear_infinite] py-2",
			children: loop.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-6 whitespace-nowrap",
				children: t
			}, i))
		})
	});
}
function Header() {
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [bagOpen, setBagOpen] = (0, import_react.useState)(false);
	const count = cartCount(useSitara((s) => s.cart));
	const { user, isPending } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border/80 bg-ivory/90 backdrop-blur-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-[4.5rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center md:hidden",
						"aria-label": "Menu",
						onClick: () => setMenuOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex flex-col items-center leading-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-[1.65rem] tracking-[0.22em] text-ink md:text-3xl",
							children: STORE_NAME
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-[9px] tracking-[0.38em] text-stone uppercase md:block",
							children: "Fine Jewellery · Lahore"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-7 text-[12px] tracking-[0.16em] uppercase md:flex",
						children: NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: n.to,
							className: "text-ink-soft hover:text-ink",
							children: n.label
						}, n.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Search",
								className: "grid size-11 place-items-center",
								onClick: () => setSearchOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden md:block",
								children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-pulse rounded-full bg-ivory-deep" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "grid size-11 place-items-center",
									"aria-label": "Sign in",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-label": "Bag",
								className: "relative grid size-11 place-items-center",
								onClick: () => setBagOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-emerald text-[9px] text-ivory",
									children: count
								})]
							})
						]
					})
				]
			}),
			searchOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchOverlay, { onClose: () => setSearchOpen(false) }),
			menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileMenu, { onClose: () => setMenuOpen(false) }),
			bagOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BagDrawer, { onClose: () => setBagOpen(false) })
		]
	});
}
function SearchOverlay({ onClose }) {
	const [q, setQ] = (0, import_react.useState)("");
	const { products } = useStorefront();
	const results = (0, import_react.useMemo)(() => {
		if (!q.trim()) return products.slice(0, 6);
		return products.filter((p) => matchesQuery(searchHaystack(p), q)).slice(0, 8);
	}, [q, products]);
	const synonyms = q ? expandQuery(q).slice(0, 6) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-ink/40",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-0 max-w-2xl rounded-b-2xl bg-ivory p-4 shadow-sitara md:mt-16 md:rounded-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border pb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-stone" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search gold ring, ear tops, kangan…",
							className: "h-11 flex-1 bg-transparent text-base outline-none placeholder:text-stone"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-10 place-items-center",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})
					]
				}),
				synonyms.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[11px] uppercase tracking-[0.16em] text-stone",
					children: ["Also matching ", synonyms.join(" · ")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 divide-y divide-border",
					children: [results.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop/$slug",
						params: { slug: p.slug },
						onClick: onClose,
						className: "flex items-center gap-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.images[0],
								alt: "",
								className: "size-14 rounded-md object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display text-lg",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs uppercase tracking-[0.14em] text-stone",
									children: [
										p.karat ?? p.metal,
										" · ",
										p.category
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm tabular-nums",
								children: formatPkr(p.price)
							})
						]
					}) }, p.slug)), results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-8 text-center text-sm text-stone",
						children: "No pieces match that search."
					})]
				})
			]
		})
	});
}
function MobileMenu({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-ink/40 md:hidden",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "h-full w-[82%] max-w-sm bg-ivory p-6",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl tracking-[0.18em]",
					children: "SITARA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-8 flex flex-col gap-4 font-display text-2xl",
				children: [
					NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						onClick: onClose,
						children: n.label
					}, n.to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						onClick: onClose,
						children: "Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wishlist",
						onClick: onClose,
						children: "Wishlist"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/try-on",
						onClick: onClose,
						children: "Try on"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stack",
						onClick: onClose,
						children: "Stack"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/size-guide",
						onClick: onClose,
						children: "Size guide"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						onClick: onClose,
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/atelier",
						onClick: onClose,
						className: "text-stone",
						children: "Atelier"
					})
				]
			})]
		})
	});
}
function BagDrawer({ onClose }) {
	const cart = useSitara((s) => s.cart);
	const setQty = useSitara((s) => s.setQty);
	const remove = useSitara((s) => s.remove);
	const { settings, productBySlug } = useStorefront();
	const lines = hydrateLines(cart, productBySlug);
	const sub = cartSubtotal(cart, productBySlug);
	const gap = freeShippingGap(sub, settings.free_shipping_over);
	const progress = Math.min(100, sub / settings.free_shipping_over * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-ink/40",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-sitara",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Your bag"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 overflow-hidden rounded-full bg-ivory-deep",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-emerald transition-[width] duration-300",
							style: { width: `${progress}%` }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-stone",
						children: gap === 0 ? "Complimentary shipping unlocked." : `Add ${formatPkr(gap)} more for complimentary shipping.`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex-1 overflow-auto px-5 py-4",
					children: [lines.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-16 text-center text-sm text-stone",
						children: "Your bag is empty. The atelier is not."
					}), lines.map(({ product, line }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "mb-4 flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.images[0],
							alt: "",
							className: "size-20 rounded-md object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg leading-tight",
									children: product.name
								}),
								line.size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-stone",
									children: ["Size ", line.size]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm tabular-nums",
									children: formatPkr(product.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setQty(product.slug, line.size, line.qty - 1),
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums text-sm",
											children: line.qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setQty(product.slug, line.size, line.qty + 1),
											children: "+"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "ml-auto text-xs uppercase tracking-[0.14em] text-stone",
											onClick: () => remove(product.slug, line.size),
											children: "Remove"
										})
									]
								})
							]
						})]
					}, `${product.slug}-${line.size ?? ""}`))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatPkr(sub)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/checkout",
								onClick: onClose,
								children: "Checkout"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "mt-1 w-full",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/cart",
								onClick: onClose,
								children: "Review bag"
							})
						})
					]
				})
			]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-ivory-deep",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl tracking-[0.18em]",
					children: "SITARA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xs text-sm leading-relaxed text-ink-soft",
					children: "A Lahore house of 22k gold, kundan, and the quiet pieces you actually live in."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "House"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/craft",
							children: "Our Craft"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/journal",
							children: "The Journal"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/lookbook",
							children: "Lookbook"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/size-guide",
							children: "Size guide"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/care",
							children: "Jewellery care"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/returns",
							children: "Returns"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Atelier"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							children: "Account"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/track",
							children: "Track order"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							children: "Contact"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/atelier",
							children: "Private office"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							children: "Privacy"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `https://wa.me/${WHATSAPP_NUMBER}`,
							target: "_blank",
							rel: "noreferrer",
							children: "WhatsApp"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.2em] text-stone",
						children: "The list"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-ink-soft",
						children: "First look at bridal edits. A code, occasionally."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, { compact: true })
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border px-4 py-4 text-center text-[11px] uppercase tracking-[0.16em] text-stone",
			children: "Sitara Atelier · Hallmarked gold · GST invoice on request · Pakistan"
		})]
	});
}
function MobileNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const count = useSitara((s) => cartCount(s.cart));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-5",
			children: [
				{
					to: "/",
					label: "Home",
					icon: House
				},
				{
					to: "/shop",
					label: "Shop",
					icon: Sparkles
				},
				{
					to: "/try-on",
					label: "Try on",
					icon: ScanLine
				},
				{
					to: "/journal",
					label: "Journal",
					icon: BookOpen
				},
				{
					to: "/cart",
					label: "Bag",
					icon: ShoppingBag
				}
			].map((it) => {
				const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
				const Icon = it.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: it.to,
					className: cn("relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] uppercase tracking-[0.12em]", active ? "text-emerald" : "text-stone"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }),
						it.label,
						it.to === "/cart" && count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-[22%] top-1 grid size-4 place-items-center rounded-full bg-emerald text-[9px] text-ivory",
							children: count
						})
					]
				}) }, it.to);
			})
		})
	});
}
function WhatsAppFab() {
	const { settings } = useStorefront();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname.startsWith("/shop/") && pathname !== "/shop" && pathname !== "/shop/") return null;
	const n = settings.whatsapp_number || "923001112223";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: `https://wa.me/${n}?text=${encodeURIComponent("Salaam Sitara — I have a question about a piece.")}`,
		target: "_blank",
		rel: "noreferrer",
		"aria-label": "WhatsApp the atelier",
		className: "fixed bottom-20 right-4 z-30 grid size-14 place-items-center rounded-full bg-emerald text-ivory shadow-sitara md:bottom-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-6" })
	});
}
var styles_default = "/assets/styles-BOKx6jih.css";
var APP_NAME = "Sitara — Fine Jewellery";
var Route$34 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Sitara is a Lahore house of hallmarked 22k gold, kundan, and the quiet pieces Pakistani women actually live in. Cash on delivery. Complimentary shipping over Rs 5,000."
			},
			{
				name: "theme-color",
				content: "#1B4332"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Noto+Naskh+Arabic:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorefrontProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$32 = () => import("./routes-CgbBakqj.mjs");
var Route$33 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$32, "component"),
	head: () => ({ meta: [{ title: "Sitara — Fine Jewellery, Lahore" }, {
		name: "description",
		content: "Sitara is a Lahore house of hallmarked 22k gold, kundan, and the quiet pieces Pakistani women actually live in. Cash on delivery. Complimentary shipping over Rs 5,000."
	}] })
});
var $$splitComponentImporter$31 = () => import("./account-BCMP25Qm.mjs");
var Route$32 = createFileRoute("/account")({
	component: lazyRouteComponent($$splitComponentImporter$31, "component"),
	head: () => ({ meta: [{ title: "Account — Sitara" }] })
});
var $$splitComponentImporter$30 = () => import("./arrivals-CM9K70Ov.mjs");
var Route$31 = createFileRoute("/arrivals")({
	component: lazyRouteComponent($$splitComponentImporter$30, "component"),
	head: () => ({ meta: [{ title: "New arrivals — Sitara" }] })
});
var $$splitComponentImporter$29 = () => import("./atelier-CBqkRgJG.mjs");
var Route$30 = createFileRoute("/atelier")({
	component: lazyRouteComponent($$splitComponentImporter$29, "component"),
	head: () => ({ meta: [{ title: "Atelier — Sitara" }] })
});
var $$splitComponentImporter$28 = () => import("./bestsellers-C4LFS_7A.mjs");
var Route$29 = createFileRoute("/bestsellers")({
	component: lazyRouteComponent($$splitComponentImporter$28, "component"),
	head: () => ({ meta: [{ title: "Best sellers — Sitara" }] })
});
var $$splitComponentImporter$27 = () => import("./bridal-CEeoEPQN.mjs");
var Route$28 = createFileRoute("/bridal")({
	component: lazyRouteComponent($$splitComponentImporter$27, "component"),
	head: () => ({ meta: [{ title: "Bridal — Sitara" }] })
});
var $$splitComponentImporter$26 = () => import("./care-BRlWROmX.mjs");
var Route$27 = createFileRoute("/care")({
	component: lazyRouteComponent($$splitComponentImporter$26, "component"),
	head: () => ({ meta: [{ title: "Jewellery care — Sitara" }] })
});
var $$splitComponentImporter$25 = () => import("./cart-j_W17j8d.mjs");
var Route$26 = createFileRoute("/cart")({
	component: lazyRouteComponent($$splitComponentImporter$25, "component"),
	head: () => ({ meta: [{ title: "Bag — Sitara" }] })
});
var $$splitComponentImporter$24 = () => import("./checkout-WLllgV2z.mjs");
var Route$25 = createFileRoute("/checkout")({
	component: lazyRouteComponent($$splitComponentImporter$24, "component"),
	head: () => ({ meta: [{ title: "Checkout — Sitara" }] })
});
var $$splitComponentImporter$23 = () => import("./collections-CtALNpxH.mjs");
var Route$24 = createFileRoute("/collections")({
	component: lazyRouteComponent($$splitComponentImporter$23, "component"),
	head: () => ({ meta: [{ title: "Collections — Sitara" }] })
});
var $$splitComponentImporter$22 = () => import("./contact-KJAwAb14.mjs");
var Route$23 = createFileRoute("/contact")({
	component: lazyRouteComponent($$splitComponentImporter$22, "component"),
	head: () => ({ meta: [{ title: "Contact — Sitara" }] })
});
var $$splitComponentImporter$21 = () => import("./craft-BgUeMk4Y.mjs");
var Route$22 = createFileRoute("/craft")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./finder-BUW6xQyr.mjs");
var Route$21 = createFileRoute("/finder")({
	component: lazyRouteComponent($$splitComponentImporter$20, "component"),
	head: () => ({ meta: [{ title: "Gift Finder — Sitara" }] })
});
var $$splitComponentImporter$19 = () => import("./gifts-DKSC6H_B.mjs");
var Route$20 = createFileRoute("/gifts")({
	component: lazyRouteComponent($$splitComponentImporter$19, "component"),
	head: () => ({ meta: [{ title: "Gifts — Sitara" }] })
});
var $$splitComponentImporter$18 = () => import("./journal-Bxaa2Aso.mjs");
var Route$19 = createFileRoute("/journal")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./login-IAWQ9bHT.mjs");
var Route$18 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./lookbook-DN5Rytjp.mjs");
var Route$17 = createFileRoute("/lookbook")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./match-1271UD_W.mjs");
var Route$16 = createFileRoute("/match")({
	component: lazyRouteComponent($$splitComponentImporter$15, "component"),
	head: () => ({ meta: [{ title: "Outfit matcher — Sitara" }] })
});
var $$splitComponentImporter$14 = () => import("./privacy-CC3EWidE.mjs");
var Route$15 = createFileRoute("/privacy")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./quiz-D24MeaxN.mjs");
var Route$14 = createFileRoute("/quiz")({
	component: lazyRouteComponent($$splitComponentImporter$13, "component"),
	head: () => ({ meta: [{ title: "Style quiz — Sitara" }] })
});
var $$splitComponentImporter$12 = () => import("./returns-BvFhCt4Q.mjs");
var Route$13 = createFileRoute("/returns")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./shop-C1QSjShi.mjs");
var Route$12 = createFileRoute("/shop")({
	validateSearch: (s) => ({
		collection: typeof s.collection === "string" ? s.collection : void 0,
		metal: typeof s.metal === "string" ? s.metal : void 0,
		category: typeof s.category === "string" ? s.category : void 0,
		occasion: typeof s.occasion === "string" ? s.occasion : void 0,
		q: typeof s.q === "string" ? s.q : void 0,
		sort: typeof s.sort === "string" ? s.sort : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./size-guide-CUBCymKZ.mjs");
var Route$11 = createFileRoute("/size-guide")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./stack-B21uel52.mjs");
var Route$10 = createFileRoute("/stack")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./track-DUaeNRGM.mjs");
var Route$9 = createFileRoute("/track")({
	validateSearch: (s) => ({ id: typeof s.id === "string" ? s.id : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	head: () => ({ meta: [{ title: "Track an order — Sitara" }] })
});
var $$splitComponentImporter$7 = () => import("./try-on-AR4NnL2G.mjs");
var Route$8 = createFileRoute("/try-on")({
	validateSearch: (s) => ({ piece: typeof s.piece === "string" ? s.piece : void 0 }),
	head: () => ({ meta: [{ title: "Atelier Mirror — Sitara" }, {
		name: "description",
		content: "Sitara’s virtual try-on. Live landmark tracking places hallmarked gold on your ears, neck, and hands. Nothing is uploaded."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./wishlist-DtQw5otT.mjs");
var Route$7 = createFileRoute("/wishlist")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: "Wishlist — Sitara" }] })
});
var $$splitComponentImporter$5 = () => import("./category._slug-tWIwhNth.mjs");
var Route$6 = createFileRoute("/category/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: ({ params }) => ({ meta: [{ title: `${CATEGORY_LABEL[params.slug] ?? "Category"} — Sitara` }] })
});
var $$splitComponentImporter$4 = () => import("./collections._slug-CnhwcZuF.mjs");
var Route$5 = createFileRoute("/collections/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: ({ params }) => ({ meta: [{ title: `${COLLECTIONS.find((c) => c.slug === params.slug)?.name ?? "Collection"} — Sitara` }] })
});
var $$splitComponentImporter$3 = () => import("./journal.index-Cz9GjkVH.mjs");
var Route$4 = createFileRoute("/journal/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./journal._slug-BacacRke.mjs");
var Route$3 = createFileRoute("/journal/$slug")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./shop.index-C6RXZdYh.mjs");
var Route$2 = createFileRoute("/shop/")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Shop — Sitara" }] })
});
var $$splitComponentImporter = () => import("./shop._slug-C_FGIex4.mjs");
var Route$1 = createFileRoute("/shop/$slug")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: ({ params }) => {
		const p = PRODUCT_BY_SLUG[params.slug];
		return { meta: [{ title: `${p?.name ?? params.slug} — Sitara` }, {
			name: "description",
			content: p?.description.slice(0, 160) ?? "Sitara fine jewellery, Lahore."
		}] };
	}
});
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$33.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$34
});
var AccountRoute = Route$32.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$34
});
var ArrivalsRoute = Route$31.update({
	id: "/arrivals",
	path: "/arrivals",
	getParentRoute: () => Route$34
});
var AtelierRoute = Route$30.update({
	id: "/atelier",
	path: "/atelier",
	getParentRoute: () => Route$34
});
var BestsellersRoute = Route$29.update({
	id: "/bestsellers",
	path: "/bestsellers",
	getParentRoute: () => Route$34
});
var BridalRoute = Route$28.update({
	id: "/bridal",
	path: "/bridal",
	getParentRoute: () => Route$34
});
var CareRoute = Route$27.update({
	id: "/care",
	path: "/care",
	getParentRoute: () => Route$34
});
var CartRoute = Route$26.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$34
});
var CheckoutRoute = Route$25.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$34
});
var CollectionsRoute = Route$24.update({
	id: "/collections",
	path: "/collections",
	getParentRoute: () => Route$34
});
var ContactRoute = Route$23.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$34
});
var CraftRoute = Route$22.update({
	id: "/craft",
	path: "/craft",
	getParentRoute: () => Route$34
});
var FinderRoute = Route$21.update({
	id: "/finder",
	path: "/finder",
	getParentRoute: () => Route$34
});
var GiftsRoute = Route$20.update({
	id: "/gifts",
	path: "/gifts",
	getParentRoute: () => Route$34
});
var JournalRoute = Route$19.update({
	id: "/journal",
	path: "/journal",
	getParentRoute: () => Route$34
});
var LoginRoute = Route$18.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$34
});
var LookbookRoute = Route$17.update({
	id: "/lookbook",
	path: "/lookbook",
	getParentRoute: () => Route$34
});
var MatchRoute = Route$16.update({
	id: "/match",
	path: "/match",
	getParentRoute: () => Route$34
});
var PrivacyRoute = Route$15.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$34
});
var QuizRoute = Route$14.update({
	id: "/quiz",
	path: "/quiz",
	getParentRoute: () => Route$34
});
var ReturnsRoute = Route$13.update({
	id: "/returns",
	path: "/returns",
	getParentRoute: () => Route$34
});
var ShopRoute = Route$12.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$34
});
var SizeGuideRoute = Route$11.update({
	id: "/size-guide",
	path: "/size-guide",
	getParentRoute: () => Route$34
});
var StackRoute = Route$10.update({
	id: "/stack",
	path: "/stack",
	getParentRoute: () => Route$34
});
var TrackRoute = Route$9.update({
	id: "/track",
	path: "/track",
	getParentRoute: () => Route$34
});
var TryOnRoute = Route$8.update({
	id: "/try-on",
	path: "/try-on",
	getParentRoute: () => Route$34
});
var WishlistRoute = Route$7.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$34
});
var CategorySlugRoute = Route$6.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$34
});
var CollectionsSlugRoute = Route$5.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => CollectionsRoute
});
var JournalIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => JournalRoute
});
var JournalSlugRoute = Route$3.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => JournalRoute
});
var ShopIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => ShopRoute
});
var ShopSlugRoute = Route$1.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => ShopRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$34
});
var CollectionsRouteChildren = { CollectionsSlugRoute };
var CollectionsRouteWithChildren = CollectionsRoute._addFileChildren(CollectionsRouteChildren);
var JournalRouteChildren = {
	JournalSlugRoute,
	JournalIndexRoute
};
var JournalRouteWithChildren = JournalRoute._addFileChildren(JournalRouteChildren);
var ShopRouteChildren = {
	ShopSlugRoute,
	ShopIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AccountRoute,
	ArrivalsRoute,
	AtelierRoute,
	BestsellersRoute,
	BridalRoute,
	CareRoute,
	CartRoute,
	CheckoutRoute,
	CollectionsRoute: CollectionsRouteWithChildren,
	ContactRoute,
	CraftRoute,
	FinderRoute,
	GiftsRoute,
	JournalRoute: JournalRouteWithChildren,
	LoginRoute,
	LookbookRoute,
	MatchRoute,
	PrivacyRoute,
	QuizRoute,
	ReturnsRoute,
	ShopRoute: ShopRoute._addFileChildren(ShopRouteChildren),
	SizeGuideRoute,
	StackRoute,
	TrackRoute,
	TryOnRoute,
	WishlistRoute,
	CategorySlugRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$34._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Button as C, updateProfile as S, useStorefront as _, Route$6 as a, listMyOrders as b, NewsletterForm as c, hydrateLines as d, useSitara as f, useStock as g, RedirectToSignIn as h, Route$5 as i, cartSubtotal as l, formatPkr as m, Route$1 as n, Route$8 as o, matchesQuery as p, Route$3 as r, Route$9 as s, router_exports as t, freeShippingGap as u, addReview as v, useCurrentUserState as w, toggleStockAlert as x, getOrCreateProfile as y };
