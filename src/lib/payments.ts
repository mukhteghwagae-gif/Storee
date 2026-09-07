/**
 * Pakistani payment desk. Methods that need merchant credentials stay
 * unavailable until the atelier fills them in. Nothing here marks an
 * order as paid — that is a staff action or cash collected on delivery.
 */

export type PaymentMethod = "cod" | "jazzcash" | "easypaisa" | "bank" | "card";

export type PaymentOption = {
  id: PaymentMethod;
  label: string;
  available: boolean;
  configured: boolean;
  hint: string;
};

export type PaymentSettings = {
  cod_enabled: boolean;
  bank_iban?: string | null;
  bank_name?: string | null;
  bank_account_title?: string | null;
  raast_id?: string | null;
  jazzcash_merchant_id?: string | null;
  easypaisa_store_id?: string | null;
  card_public_key?: string | null;
};

function filled(v: string | null | undefined): boolean {
  return Boolean(v && v.trim().length >= 4);
}

export function paymentOptions(s: PaymentSettings): PaymentOption[] {
  const bankOn = filled(s.bank_iban);
  const jazz = filled(s.jazzcash_merchant_id);
  const easy = filled(s.easypaisa_store_id);
  const card = filled(s.card_public_key);
  return [
    {
      id: "cod",
      label: "Cash on delivery",
      available: s.cod_enabled,
      configured: true,
      hint: s.cod_enabled
        ? "Pay the courier in cash. Inspect the box before you hand over notes."
        : "Cash on delivery is paused today.",
    },
    {
      id: "bank",
      label: "Bank transfer / Raast",
      available: bankOn,
      configured: bankOn,
      hint: bankOn
        ? `Transfer to ${s.bank_account_title ?? "Sitara"} · ${s.bank_name ?? "bank"} and send the receipt on WhatsApp.`
        : "The atelier has not published an IBAN yet.",
    },
    {
      id: "jazzcash",
      label: "JazzCash",
      available: jazz,
      configured: jazz,
      hint: jazz
        ? "You will receive merchant instructions after placing. The order stays unpaid until the desk confirms."
        : "JazzCash is not connected. Ask the atelier to add a merchant id.",
    },
    {
      id: "easypaisa",
      label: "Easypaisa",
      available: easy,
      configured: easy,
      hint: easy
        ? "You will receive store instructions after placing. The order stays unpaid until the desk confirms."
        : "Easypaisa is not connected.",
    },
    {
      id: "card",
      label: "Card",
      available: card,
      configured: card,
      hint: card
        ? "Card checkout is prepared. The order stays unpaid until the processor confirms."
        : "Card payments are not connected.",
    },
  ];
}

export function assertPayable(method: PaymentMethod, s: PaymentSettings): void {
  const opt = paymentOptions(s).find((p) => p.id === method);
  if (!opt) throw new Error("Unknown payment method.");
  if (!opt.available) throw new Error(opt.hint);
}
