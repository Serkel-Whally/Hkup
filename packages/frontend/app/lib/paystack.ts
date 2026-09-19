import { createHmac, timingSafeEqual } from "node:crypto";

export const PAYSTACK_BASE_URL = "https://api.paystack.co";
export const EXPECTED_CURRENCY = "GHS";

export function getPaystackSecret() {
  return process.env.PAYSTACK_SECRET_KEY?.trim();
}

export function getPaystackPublicKey() {
  return process.env.PAYSTACK_PUBLIC_KEY?.trim();
}

export function getPaystackWebhookSecret() {
  return process.env.PAYSTACK_WEBHOOK_SECRET?.trim();
}

export function normalizePaystackAmount(amount: number | string) {
  const parsed = typeof amount === "string" ? Number.parseFloat(amount) : Number(amount);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.round(parsed * 100);
}

export function verifyPaystackSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;

  const expected = createHmac("sha512", secret).update(rawBody, "utf8").digest("hex");
  const provided = signature.trim();

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(provided, "hex"));
}
