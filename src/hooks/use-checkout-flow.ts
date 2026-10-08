"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useOffers } from "@/hooks/use-offers";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { Offer } from "@/interfaces/offer";
import { UseQueryResult } from "@tanstack/react-query";
import { PaymentMethod } from "@/interfaces/payment-method";

export type CheckoutStep = "offers" | "payment" | "review";

type CheckoutFlowData = {
  activeStep: CheckoutStep;
  setActiveStep: Dispatch<SetStateAction<CheckoutStep>>;
  offersQuery: UseQueryResult<Offer[], Error>;
  paymentMethodsQuery: UseQueryResult<PaymentMethod[], Error>;
  selectedOfferId: string | null;
  selectedMethodId: string | null;
  selectedOffer: Offer | undefined;
  selectedMethod: PaymentMethod | undefined;
  selectOffer: Dispatch<SetStateAction<string | null>>;
  selectMethod: Dispatch<SetStateAction<string | null>>;
  continueToPayment: (offerId?: string | null) => void;
  continueToReview: () => void;
};

export function useCheckoutFlow(): Readonly<CheckoutFlowData> {
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
  }, [
    paymentMethodsQuery.data,
    paymentMethodsQuery.isSuccess,
    selectedMethodId,
  ]);

  const selectedOffer = offersQuery.data?.find(
    (offer) => offer.id === selectedOfferId,
  );
  const selectedMethod = paymentMethodsQuery.data?.find(
    (method) => method.id === selectedMethodId,
  );

  const continueToPayment = (offerId = selectedOfferId): void => {
    const offer = offersQuery.data?.find((item) => item.id === offerId);
    if (offersQuery.isSuccess && offer) {
      setSelectedOfferId(offer.id);
      setActiveStep("payment");
    }
  };

  const continueToReview = (): void => {
    if (paymentMethodsQuery.isSuccess && selectedOffer && selectedMethod) {
      setActiveStep("review");
    }
  };

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
