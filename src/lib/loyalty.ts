export const SIGNUP_COINS = 100;
export const REVIEW_COINS = 25;
export const REFERRAL_CREDIT_PKR = 500;
export const COIN_TO_PKR = 1;
export const PKR_PER_COIN_EARNED = 100;

export function coinsForPurchase(pkr: number): number {
  return Math.floor(Math.max(0, pkr) / PKR_PER_COIN_EARNED);
}

export function redeemValue(coins: number, capPkr: number): { coinsUsed: number; pkr: number } {
  const maxCoins = Math.min(Math.max(0, coins), Math.max(0, capPkr));
  return { coinsUsed: maxCoins, pkr: maxCoins * COIN_TO_PKR };
}

export function makeReferralCode(seed: string): string {
  const clean = seed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const tail = Math.abs(hash).toString(36).toUpperCase().slice(0, 4);
  return `SITARA-${clean || "GUEST"}${tail}`;
}
