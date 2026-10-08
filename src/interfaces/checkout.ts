export interface CheckoutRequest {
  offerId: string;
  paymentMethodId: string;
}

export interface CheckoutResult {
  checkoutId: string;
  status: "succeeded";
}
