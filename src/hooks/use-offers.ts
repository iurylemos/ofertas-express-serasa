import type { Offer } from "@/interfaces/offer";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getOffers } from "@/services/offers-service";

export const offersQueryKey = ["offers"] as const;

export function useOffers(): UseQueryResult<Offer[], Error> {
  return useQuery({
    queryKey: offersQueryKey,
    queryFn: getOffers,
  });
}
