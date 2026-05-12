/**
 * Stripe singleton + helpers.
 *
 * Buyers configure STRIPE_SECRET_KEY in .env. Plans link to Stripe price IDs
 * via Plan.stripePriceIdMonthly / Plan.stripePriceIdYearly (set during seed
 * or manually).
 */

import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

export const stripe = apiKey
  ? new Stripe(apiKey, { apiVersion: "2026-04-22.dahlia" })
  : null;

export function requireStripe(): Stripe {
  if (!stripe) throw new Error("STRIPE_SECRET_KEY is not configured");
  return stripe;
}

export function isStripeConfigured(): boolean {
  return stripe !== null;
}
