import type { Offer } from "@/interfaces/offer";
import type { PaymentMethod } from "@/interfaces/payment-method";

interface ReviewSummaryProps {
  offer: Offer;
  method: PaymentMethod;
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(amountMinor / 100);
}

export function ReviewSummary({ offer, method }: ReviewSummaryProps) {
  return (
    <section className="review-card" aria-labelledby="review-card-title">
      <h2 id="review-card-title">Resumo do acordo</h2>
      <div className="review-card__creditor">
        <span className="creditor-mark" aria-hidden="true">
          {offer.creditorName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
        </span>
        <div>
          <strong>{offer.creditorName}</strong>
          <p>{offer.description}{offer.relationshipSince ? ` · desde ${offer.relationshipSince}` : ""}</p>
        </div>
      </div>
      {offer.originalAmountMinor !== undefined && (
        <div className="review-row">
          <span>Valor original</span>
          <s>{formatMoney(offer.originalAmountMinor, offer.currency)}</s>
        </div>
      )}
      {offer.discountPercent !== undefined && (
        <div className="review-row">
          <span>Desconto</span>
          <strong className="review-row__discount">{offer.discountPercent}%</strong>
        </div>
      )}
      <div className="review-row">
        <span>Condição</span>
        <strong>{offer.paymentCondition.label}</strong>
      </div>
      <div className="review-row">
        <span>Forma de pagamento</span>
        <strong>{method.name}</strong>
      </div>
      <div className="review-row review-row--total">
        <span>Valor negociado</span>
        <strong>{formatMoney(offer.negotiatedAmountMinor, offer.currency)}</strong>
      </div>
    </section>
  );
}
