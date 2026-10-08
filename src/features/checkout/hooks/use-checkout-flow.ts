"use client";

import { useEffect, useState } from "react";
import { useOffers } from "@/features/offers/hooks/use-offers";
import { usePaymentMethods } from "@/features/payment/hooks/use-payment-methods";

export type CheckoutStep = "offers" | "payment" | "review";

export function useCheckoutFlow() {
  const [activeStep, setActiveStep] = useState<CheckoutStep>("offers");
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const offersQuery = useOffers();
  const paymentMethodsQuery = usePaymentMethods(selectedOfferId);

  useEffect(() => {
    if (
      offersQuery.isSuccess &&
      selectedOfferId &&
      !offersQuery.data.some((offer) => offer.id === selectedOfferId)
    ) {
      setSelectedOfferId(null);
      setSelectedMethodId(null);
      setActiveStep("offers");
    }
  }, [offersQuery.data, offersQuery.isSuccess, selectedOfferId]);

  useEffect(() => {
    if (
      paymentMethodsQuery.isSuccess &&
      selectedMethodId &&
      !paymentMethodsQuery.data.some((method) => method.id === selectedMethodId)
    ) {
      setSelectedMethodId(null);
    }
  }, [paymentMethodsQuery.data, paymentMethodsQuery.isSuccess, selectedMethodId]);

  const selectedOffer = offersQuery.data?.find((offer) => offer.id === selectedOfferId);
  const selectedMethod = paymentMethodsQuery.data?.find((method) => method.id === selectedMethodId);

  function continueToPayment(offerId = selectedOfferId) {
    const offer = offersQuery.data?.find((item) => item.id === offerId);
    if (offersQuery.isSuccess && offer) {
      setSelectedOfferId(offer.id);
      setActiveStep("payment");
    }
  }

  function continueToReview() {
    if (paymentMethodsQuery.isSuccess && selectedOffer && selectedMethod) {
      setActiveStep("review");
    }
  }

  return {
    activeStep,
    setActiveStep,
    offersQuery,
    paymentMethodsQuery,
    selectedOfferId,
    selectedMethodId,
    selectedOffer,
    selectedMethod,
    selectOffer: setSelectedOfferId,
    selectMethod: setSelectedMethodId,
    continueToPayment,
    continueToReview,
  };
}
