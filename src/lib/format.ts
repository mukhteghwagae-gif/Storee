/** Pakistani / Indian grouping: 12,50,000 */
export function formatPkr(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const n = Math.abs(rounded);
  const str = String(n);
  if (str.length <= 3) return `${sign}Rs ${str}`;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}Rs ${grouped},${last3}`;
}

export function formatPkrCompact(amount: number): string {
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(1).replace(/\.0$/, "")} lakh`;
  return formatPkr(amount);
}

export function parsePkr(input: string): number {
  const digits = input.replace(/[^\d.-]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}
