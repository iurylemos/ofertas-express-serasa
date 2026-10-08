import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPaymentMethods } from "@/services/payment-service";
import type { PaymentMethod } from "@/interfaces/payment-method";

export function paymentMethodsQueryKey(
  offerId: string | null,
): readonly ["payment-methods", string | null] {
  return ["payment-methods", offerId] as const;
}

export function usePaymentMethods(
  offerId: string | null,
): UseQueryResult<PaymentMethod[], Error> {
  return useQuery({
    queryKey: paymentMethodsQueryKey(offerId),
    queryFn: () => {
      if (!offerId) {
        throw new Error("Select an offer before loading payment methods.");
      }

      return getPaymentMethods(offerId);
    },
    enabled: Boolean(offerId),
  });
}
