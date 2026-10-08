import type { PaymentMethod } from "@/interfaces/payment-method";
import { requestData } from "@/services/api-client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError("Invalid text in payment methods response.");
  }
  return value;
}

function parsePaymentMethod(value: unknown): PaymentMethod {
  if (!isRecord(value)) throw new TypeError("Invalid payment method.");

  const method: PaymentMethod = {
    id: requiredText(value.id),
    name: requiredText(value.name),
    description: requiredText(value.description),
  };
  if (value.badge !== undefined) method.badge = requiredText(value.badge);
  if (value.details !== undefined) {
    if (!Array.isArray(value.details)) throw new TypeError("Invalid payment details.");
    method.details = value.details.map(requiredText);
  }
  return method;
}

function parsePaymentMethods(value: unknown): PaymentMethod[] {
  if (!Array.isArray(value)) throw new TypeError("Invalid payment methods list.");
  const result = value.map(parsePaymentMethod);
  const ids = new Set(result.map((method) => method.id));
  if (ids.size !== result.length) throw new TypeError("Payment methods must have unique IDs.");
  return result;
}

export function getPaymentMethods(offerId: string): Promise<PaymentMethod[]> {
  const query = new URLSearchParams({ offerId });
  return requestData(`/payment-methods?${query.toString()}`, parsePaymentMethods);
}
