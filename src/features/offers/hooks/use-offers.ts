import { useQuery } from "@tanstack/react-query";
import { getOffers } from "@/services/offers-service";

export const offersQueryKey = ["offers"] as const;

export function useOffers() {
  return useQuery({
    queryKey: offersQueryKey,
    queryFn: getOffers,
  });
}
