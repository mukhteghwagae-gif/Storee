import { WHATSAPP_NUMBER } from "@/lib/catalog";

export type StockRow = { id: string; stock: number; sold_count: number };
export type ReviewRow = {
  id: number;
  user_id: string;
  product_id: string;
  rating: number;
  title: string;
  body: string;
  photo_data_url: string | null;
  created_at: string;
  display_name?: string | null;
};
export type SettingsRow = {
  id: number;
  cod_enabled: boolean;
  free_shipping_over: number;
  gst_fashion_bps: number;
  whatsapp_number: string;
  gold_24k_tola_pkr: number;
  gold_updated_at: string;
  bank_name?: string | null;
  bank_iban?: string | null;
  bank_account_title?: string | null;
  raast_id?: string | null;
  jazzcash_merchant_id?: string | null;
  easypaisa_store_id?: string | null;
  card_public_key?: string | null;
  hero_kicker?: string | null;
  hero_title?: string | null;
  hero_dek?: string | null;
  gift_wrap_pkr?: number | null;
};
export type ProfileRow = {
  user_id: string;
  display_name: string | null;
  phone: string | null;
  address_line: string | null;
  city: string | null;
  coins: number;
  store_credit_pkr: number;
  referral_code: string;
  referred_by: string | null;
};
export type OrderRow = {
  id: string;
  user_id: string;
  status: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  city: string;
  address_line: string;
  phone: string;
  courier: string;
  notes: string | null;
  created_at: string;
  guest_name?: string | null;
  gift_wrap?: boolean;
  gift_message?: string | null;
  payment_status?: string;
  shipment_status?: string;
  tracking_token?: string | null;
  coupon_code?: string | null;
  return_reason?: string | null;
  coins_used?: number;
  store_credit_used?: number;
  restocked?: boolean;
};

export const FALLBACK_SETTINGS: SettingsRow = {
  id: 1,
  cod_enabled: true,
  free_shipping_over: 5000,
  gst_fashion_bps: 0,
  whatsapp_number: WHATSAPP_NUMBER,
  gold_24k_tola_pkr: 352000,
  gold_updated_at: new Date().toISOString(),
  bank_name: null,
  bank_iban: null,
  bank_account_title: null,
  raast_id: null,
  jazzcash_merchant_id: null,
  easypaisa_store_id: null,
  card_public_key: null,
  hero_kicker: null,
  hero_title: null,
  hero_dek: null,
  gift_wrap_pkr: 650,
};
