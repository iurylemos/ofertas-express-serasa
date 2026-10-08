export interface SinglePaymentCondition {
  kind: "single";
  label: string;
  downPaymentMinor?: never;
  installmentCount?: never;
  installmentAmountMinor?: never;
}

export interface InstallmentPaymentCondition {
  kind: "installments";
  label: string;
  downPaymentMinor?: number;
  installmentCount: number;
  installmentAmountMinor: number;
}

export type PaymentCondition = SinglePaymentCondition | InstallmentPaymentCondition;

export interface Offer {
  id: string;
  creditorName: string;
  description: string;
  originalAmountMinor?: number;
  negotiatedAmountMinor: number;
  currency: string;
  discountPercent?: number;
  paymentCondition: PaymentCondition;
  relationshipSince?: string;
  badge?: string;
}
