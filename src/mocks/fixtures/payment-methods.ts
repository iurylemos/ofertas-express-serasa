import type { PaymentMethod } from "@/interfaces/payment-method";

export const paymentMethodsByOffer: Record<string, PaymentMethod[]> = {
  "bank-horizonte": [
    {
      id: "pix",
      name: "Pix",
      description: "Pagamento na hora, sem sair de casa",
      badge: "Mais rápido",
      details: ["O pagamento é compensado em poucos minutos."],
    },
    {
      id: "boleto",
      name: "Boleto",
      description: "Pague no app do banco ou em lotéricas",
      details: ["A compensação pode levar até 3 dias úteis."],
    },
  ],
  "conecta-telecom": [
    {
      id: "boleto",
      name: "Boleto",
      description: "Pague no app do banco ou em lotéricas",
      details: ["A compensação pode levar até 3 dias úteis."],
    },
  ],
  "loja-vitrine": [
    {
      id: "pix",
      name: "Pix",
      description: "Pagamento na hora, sem sair de casa",
      badge: "Mais rápido",
      details: ["O pagamento é compensado em poucos minutos."],
    },
  ],
};

export const emptyPaymentMethods: PaymentMethod[] = [];
