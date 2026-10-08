import type { Offer } from "@/interfaces/offer";

export const offers: Offer[] = [
  {
    id: "bank-horizonte",
    creditorName: "Banco Horizonte",
    description: "Cartão de crédito",
    originalAmountMinor: 348090,
    negotiatedAmountMinor: 68900,
    currency: "BRL",
    discountPercent: 80,
    paymentCondition: { kind: "single", label: "À vista · pagamento único" },
    relationshipSince: "mar/2023",
    badge: "Melhor oferta",
  },
  {
    id: "conecta-telecom",
    creditorName: "Conecta Telecom",
    description: "Conta de celular",
    originalAmountMinor: 41237,
    negotiatedAmountMinor: 9890,
    currency: "BRL",
    discountPercent: 76,
    paymentCondition: { kind: "single", label: "À vista · pagamento único" },
    relationshipSince: "ago/2024",
  },
  {
    id: "loja-vitrine",
    creditorName: "Loja Vitrine",
    description: "Crediário",
    originalAmountMinor: 125000,
    negotiatedAmountMinor: 45000,
    currency: "BRL",
    discountPercent: 64,
    paymentCondition: {
      kind: "installments",
      label: "Entrada de R$ 90,00 + 4x de R$ 90,00",
      downPaymentMinor: 9000,
      installmentCount: 4,
      installmentAmountMinor: 9000,
    },
    relationshipSince: "jan/2024",
  },
];

export const emptyOffers: Offer[] = [];
