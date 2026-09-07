export type CourierId = "leopard" | "tcs" | "call";

export const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Swabi",
  "Topi",
  "Mardan",
  "Abbottabad",
  "Quetta",
  "Hyderabad",
  "Sialkot",
  "Gujranwala",
  "Bahawalpur",
  "Sukkur",
  "Mingora",
  "Kohat",
  "Dera Ismail Khan",
  "Other",
] as const;

export type City = (typeof CITIES)[number];

const METRO = new Set(["Lahore", "Karachi", "Islamabad", "Rawalpindi"]);

export function estimateShipping(opts: {
  city: City;
  subtotal: number;
  freeOver: number;
  courier?: CourierId;
}): { pkr: number; days: string; courier: CourierId; label: string } {
  const courier = opts.courier ?? "leopard";
  if (opts.subtotal >= opts.freeOver) {
    return { pkr: 0, days: METRO.has(opts.city) ? "1–2" : "2–4", courier, label: "Complimentary" };
  }
  const base = METRO.has(opts.city) ? 250 : opts.city === "Other" ? 450 : 320;
  const bump = courier === "tcs" ? 40 : courier === "call" ? -20 : 0;
  const days = METRO.has(opts.city) ? "1–3" : "3–5";
  return { pkr: base + bump, days, courier, label: courierLabel(courier) };
}

export function courierLabel(id: CourierId): string {
  if (id === "tcs") return "TCS";
  if (id === "call") return "Call Courier";
  return "Leopard Courier";
}

export function freeShippingRemaining(subtotal: number, freeOver: number): number {
  return Math.max(0, freeOver - subtotal);
}

export function isCity(v: string): v is City {
  return (CITIES as readonly string[]).includes(v);
}
