import { useMutation } from "@tanstack/react-query";
import { submitCheckout } from "@/services/checkout-service";

export function useSubmitCheckout() {
  return useMutation({
    mutationFn: submitCheckout,
  });
}
