import { trackEvent as trackEventServer } from "@/lib/server/commerce";

export function trackEvent(name: string, payload?: Record<string, string | number | boolean | undefined>) {
  const clean: Record<string, string | number | boolean> = {};
  if (payload) {
    for (const [k, v] of Object.entries(payload)) {
      if (v !== undefined) clean[k] = v;
    }
  }
  void trackEventServer({ data: { name: name.slice(0, 40), payload: JSON.stringify(clean).slice(0, 500) } }).catch(
    () => {},
  );
}
