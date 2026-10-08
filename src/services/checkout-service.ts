import type { CheckoutRequest, CheckoutResult } from "@/interfaces/checkout";
import { ApiError, CheckoutError } from "@/interfaces/api-error";
import { requestData } from "@/services/api-client";

function parseCheckoutResult(value: unknown): CheckoutResult {
  if (
    typeof value !== "object" ||
    value === null ||
    !("checkoutId" in value) ||
    typeof value.checkoutId !== "string" ||
    value.checkoutId.trim().length === 0 ||
    !("status" in value) ||
    value.status !== "succeeded"
  ) {
    throw new TypeError("Invalid checkout result.");
  }

  return { checkoutId: value.checkoutId, status: "succeeded" };
}

export function submitCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  if (!request.offerId.trim() || !request.paymentMethodId.trim()) {
    throw new TypeError("Checkout requires an offer and a payment method.");
  }

  return requestData("/checkout", parseCheckoutResult, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      offerId: request.offerId,
      paymentMethodId: request.paymentMethodId,
    }),
  }).catch((error: unknown) => {
    if (error instanceof ApiError) throw new CheckoutError(error.status);
    throw error;
  });
}
