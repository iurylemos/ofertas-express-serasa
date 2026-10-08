import type { Offer } from "@/interfaces/offer";
import type { PaymentMethod } from "@/interfaces/payment-method";

interface ReviewSummaryProps {
  offer: Offer;
  method: PaymentMethod;
  acceptedTerms: boolean;
  onAcceptTerms: (accepted: boolean) => void;
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(amountMinor / 100);
}

export function ReviewSummary({
  offer,
  method,
  acceptedTerms,
  onAcceptTerms,
}: ReviewSummaryProps) {
  const discountAmount = offer.originalAmountMinor === undefined
    ? undefined
    : offer.originalAmountMinor - offer.negotiatedAmountMinor;

  return (
    <div className="review-details">
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
        {discountAmount !== undefined && offer.discountPercent !== undefined && (
          <div className="review-row">
            <span>Desconto</span>
            <strong className="review-row__discount">
              - {formatMoney(discountAmount, offer.currency)} ({offer.discountPercent}%)
            </strong>
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

      <section className="terms-card" aria-labelledby="terms-title">
        <h2 id="terms-title">Termos do acordo</h2>
        <ul>
          <li>O desconto vale apenas com o pagamento até o vencimento.</li>
          <li>Sem pagamento, o acordo é cancelado e a dívida volta ao valor original.</li>
          <li>Após a compensação, o credor tem até 5 dias úteis para retirar a negativação.</li>
        </ul>
        <details className="terms-card__details">
          <summary>Ler termos completos</summary>
          <p>
            Ao confirmar, você concorda com o valor, a condição de pagamento e as regras
            descritas neste acordo. A baixa da dívida ocorre após a confirmação do pagamento.
          </p>
        </details>
        <label className="terms-card__accept">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => onAcceptTerms(event.target.checked)}
          />
          <span>Li e aceito os termos do acordo</span>
        </label>
      </section>
    </div>
  );
}
