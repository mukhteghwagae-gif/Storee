import { h as trackEvent$1 } from "./commerce-BpEajYIO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-BrWCqjct.js
function trackEvent(name, payload) {
	const clean = {};
	if (payload) {
		for (const [k, v] of Object.entries(payload)) if (v !== void 0) clean[k] = v;
	}
	trackEvent$1({ data: {
		name: name.slice(0, 40),
		payload: JSON.stringify(clean).slice(0, 500)
	} }).catch(() => {});
}
//#endregion
export { trackEvent as t };
