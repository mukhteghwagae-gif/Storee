const SYNONYMS: Record<string, string[]> = {
  earrings: ["earring", "ear tops", "tops", "jhumka", "jhumkas", "hoops", "studs", "drops", "bali"],
  necklace: ["necklaces", "chain", "chains", "locket", "lockets", "choker", "haar", "set"],
  ring: ["rings", "challa", "anguthi"],
  bangle: ["bangles", "kangan", "kangans", "kara", "bracelet", "cuffs"],
  bracelet: ["bracelets", "kada", "cuffs"],
  anklet: ["anklets", "payal", "payals", "paazeb"],
  tikka: ["tika", "maang", "matha patti", "headpiece"],
  bridal: ["bride", "trousseau", "shaadi", "wedding", "barat", "walima", "set"],
  gold: ["22k", "18k", "sona", "zar"],
  silver: ["chandi", "oxidized"],
  emerald: ["zamrud", "green"],
  pearl: ["moti", "pearls"],
};

export function expandQuery(raw: string): string[] {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const extra: string[] = [];
  for (const [canonical, alts] of Object.entries(SYNONYMS)) {
    if (tokens.includes(canonical) || alts.some((a) => q.includes(a))) {
      extra.push(canonical, ...alts);
    }
  }
  return Array.from(new Set([...tokens, ...extra]));
}

export function matchesQuery(
  haystack: string,
  query: string,
): boolean {
  const terms = expandQuery(query);
  if (terms.length === 0) return true;
  const h = haystack.toLowerCase();
  const original = query.trim().toLowerCase();
  if (h.includes(original)) return true;
  return terms.some((t) => t.length > 1 && h.includes(t));
}
