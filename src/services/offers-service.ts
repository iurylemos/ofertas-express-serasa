import type { Offer, PaymentCondition } from "@/interfaces/offer";
import { requestData } from "@/services/api-client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError("Invalid text in offers response.");
  }
  return value;
}

function nonNegativeInteger(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new TypeError("Invalid amount in offers response.");
  }
  return value;
}

function parsePaymentCondition(value: unknown): PaymentCondition {
  if (!isRecord(value)) throw new TypeError("Invalid payment condition.");
  const label = requiredText(value.label);

  if (value.kind === "single") return { kind: "single", label };

  if (value.kind === "installments") {
    if (
      typeof value.installmentCount !== "number" ||
      !Number.isInteger(value.installmentCount) ||
      value.installmentCount < 1
    ) {
      throw new TypeError("Invalid installment count.");
    }

    const condition: PaymentCondition = {
      kind: "installments",
      label,
      installmentCount: value.installmentCount,
      installmentAmountMinor: nonNegativeInteger(value.installmentAmountMinor),
    };
    if (value.downPaymentMinor !== undefined) {
      condition.downPaymentMinor = nonNegativeInteger(value.downPaymentMinor);
    }
    return condition;
  }

  throw new TypeError("Unknown payment condition.");
}

function parseOffer(value: unknown): Offer {
  if (!isRecord(value)) throw new TypeError("Invalid offer.");

  const offer: Offer = {
    id: requiredText(value.id),
    creditorName: requiredText(value.creditorName),
    description: requiredText(value.description),
    negotiatedAmountMinor: nonNegativeInteger(value.negotiatedAmountMinor),
    currency: requiredText(value.currency),
    paymentCondition: parsePaymentCondition(value.paymentCondition),
  };

  if (!/^[A-Z]{3}$/.test(offer.currency)) throw new TypeError("Invalid offer currency.");
  if (value.originalAmountMinor !== undefined) {
    offer.originalAmountMinor = nonNegativeInteger(value.originalAmountMinor);
  }
  if (value.discountPercent !== undefined) {
    if (
      typeof value.discountPercent !== "number" ||
      !Number.isFinite(value.discountPercent) ||
      value.discountPercent < 0 ||
      value.discountPercent > 100
    ) {
      throw new TypeError("Invalid discount percentage.");
    }
    offer.discountPercent = value.discountPercent;
  }
  if (value.relationshipSince !== undefined) {
    offer.relationshipSince = requiredText(value.relationshipSince);
  }
  if (value.badge !== undefined) offer.badge = requiredText(value.badge);

  return offer;
}

function parseOffers(value: unknown): Offer[] {
  if (!Array.isArray(value)) throw new TypeError("Invalid offers list.");
  const result = value.map(parseOffer);
  const ids = new Set(result.map((offer) => offer.id));
  if (ids.size !== result.length) throw new TypeError("Offers must have unique IDs.");
  return result;
}

export function getOffers(): Promise<Offer[]> {
  return requestData("/offers", parseOffers);
}
