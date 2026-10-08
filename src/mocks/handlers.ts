import { http, HttpResponse } from "msw";
import { offers, emptyOffers } from "@/mocks/fixtures/offers";
import { emptyPaymentMethods, paymentMethodsByOffer } from "@/mocks/fixtures/payment-methods";

const route = {
  offers: /\/offers$/,
  paymentMethods: /\/payment-methods$/,
  checkout: /\/checkout$/,
};

export const offersHandler = http.get(route.offers, () => HttpResponse.json({ data: offers }));
export const emptyOffersHandler = http.get(route.offers, () =>
  HttpResponse.json({ data: emptyOffers }),
);
export const offersErrorHandler = http.get(route.offers, () =>
  HttpResponse.json({ error: { code: "OFFERS_UNAVAILABLE" } }, { status: 500 }),
);

export const paymentMethodsHandler = http.get(route.paymentMethods, ({ request }) => {
  const offerId = new URL(request.url).searchParams.get("offerId");
  if (!offerId || !(offerId in paymentMethodsByOffer)) {
    return HttpResponse.json({ error: { code: "OFFER_NOT_FOUND" } }, { status: 404 });
  }

  return HttpResponse.json({ data: paymentMethodsByOffer[offerId] });
});
export const emptyPaymentMethodsHandler = http.get(route.paymentMethods, () =>
  HttpResponse.json({ data: emptyPaymentMethods }),
);
export const paymentMethodsErrorHandler = http.get(route.paymentMethods, () =>
  HttpResponse.json({ error: { code: "PAYMENT_METHODS_UNAVAILABLE" } }, { status: 500 }),
);

export const checkoutHandler = http.post(route.checkout, async ({ request }) => {
  const body: unknown = await request.json();
  if (
    typeof body !== "object" ||
    body === null ||
    !("offerId" in body) ||
    typeof body.offerId !== "string" ||
    !("paymentMethodId" in body) ||
    typeof body.paymentMethodId !== "string"
  ) {
    return HttpResponse.json({ error: { code: "INVALID_CHECKOUT" } }, { status: 400 });
  }

  const checkoutRequest = { offerId: body.offerId, paymentMethodId: body.paymentMethodId };
  const availableMethods = paymentMethodsByOffer[checkoutRequest.offerId];
  if (!availableMethods?.some((method) => method.id === checkoutRequest.paymentMethodId)) {
    return HttpResponse.json({ error: { code: "INVALID_SELECTION" } }, { status: 400 });
  }

  return HttpResponse.json({
    data: { checkoutId: "checkout-123", status: "succeeded" },
  });
});
export const checkoutFailureHandler = http.post(route.checkout, () =>
  HttpResponse.json({ error: { code: "CHECKOUT_UNAVAILABLE" } }, { status: 500 }),
);

export const handlers = [offersHandler, paymentMethodsHandler, checkoutHandler];
