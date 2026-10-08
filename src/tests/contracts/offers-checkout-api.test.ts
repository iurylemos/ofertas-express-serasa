import { describe, expect, it } from "vitest";
import { CheckoutError } from "@/interfaces/api-error";
import { checkoutFailureHandler } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { getOffers } from "@/services/offers-service";
import { getPaymentMethods } from "@/services/payment-service";
import { submitCheckout } from "@/services/checkout-service";

describe("offers and checkout API contract", () => {
  it("loads distinguishable offers", async () => {
    const data = await getOffers();

    expect(data.map((offer) => offer.id)).toEqual([
      "bank-horizonte",
      "conecta-telecom",
      "loja-vitrine",
    ]);
    expect(data[0].currency).toBe("BRL");
  });

  it("loads only the methods available for the requested offer", async () => {
    const data = await getPaymentMethods("conecta-telecom");

    expect(data.map((method) => method.id)).toEqual(["boleto"]);
  });

  it("submits the selected offer and method and receives a success result", async () => {
    await expect(
      submitCheckout({ offerId: "bank-horizonte", paymentMethodId: "pix" }),
    ).resolves.toEqual({ checkoutId: "checkout-123", status: "succeeded" });
  });

  it("normalizes checkout HTTP 500 without exposing the server error body", async () => {
    server.use(checkoutFailureHandler);

    const error = await submitCheckout({
      offerId: "bank-horizonte",
      paymentMethodId: "pix",
    }).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(CheckoutError);
    if (!(error instanceof CheckoutError)) throw error;
    expect(error.status).toBe(500);
    expect(error.message).toBe("Não foi possível concluir a solicitação.");
    expect(error.message).not.toContain("CHECKOUT_UNAVAILABLE");
  });
});
