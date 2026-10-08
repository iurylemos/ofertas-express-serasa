import { useQuery } from "@tanstack/react-query";
import { getPaymentMethods } from "@/services/payment-service";

export function paymentMethodsQueryKey(offerId: string | null) {
  return ["payment-methods", offerId] as const;
}

export function usePaymentMethods(offerId: string | null) {
  return useQuery({
    queryKey: paymentMethodsQueryKey(offerId),
    queryFn: () => {
      if (!offerId) throw new Error("Select an offer before loading payment methods.");
      return getPaymentMethods(offerId);
    },
    enabled: Boolean(offerId),
  });
}
