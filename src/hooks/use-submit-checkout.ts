import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { submitCheckout } from "@/services/checkout-service";
import { CheckoutRequest, CheckoutResult } from "@/interfaces/checkout";

type SubmitCheckoutMutationResult = UseMutationResult<
  CheckoutResult,
  Error,
  CheckoutRequest,
  unknown
>;

export function useSubmitCheckout(): Readonly<SubmitCheckoutMutationResult> {
  return useMutation({
    mutationFn: submitCheckout,
  });
}
