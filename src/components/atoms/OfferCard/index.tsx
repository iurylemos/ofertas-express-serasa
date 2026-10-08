import type { ChangeEvent, JSX } from "react";
import type { Offer } from "@/interfaces/offer";
import { StringUtil } from "@/utils/string.util";
import { NumberUtil } from "@/utils/number.util";

type OfferCardProps = {
  offer: Offer;
  selected: boolean;
  onSelect: (offerId: string) => void;
  onContinue: (offerId: string) => void;
};

export function OfferCard({
  offer,
  selected,
  onSelect,
  onContinue,
}: Readonly<OfferCardProps>): JSX.Element {
  const handleChange = (_event: ChangeEvent<HTMLInputElement>): void => {
    onSelect(offer.id);
  };

  return (
    <article className={`offer-card${selected ? " offer-card--selected" : ""}`}>
      <label className="offer-card__selection">
        <input
          className="choice-input"
          type="radio"
          name="offer"
          value={offer.id}
          checked={selected}
          onChange={handleChange}
          aria-label={`${offer.creditorName}, ${offer.description}`}
        />
        <span className="offer-card__content">
          {offer.badge && (
            <span className="offer-card__badge">{offer.badge}</span>
          )}
          <span className="offer-card__identity">
            <span className="creditor-mark" aria-hidden="true">
              {StringUtil.initials(offer.creditorName)}
            </span>
            <span className="offer-card__creditor">
              <strong>{offer.creditorName}</strong>
              <span>
                {offer.description}
                {offer.relationshipSince
                  ? ` · desde ${offer.relationshipSince}`
                  : ""}
              </span>
            </span>
          </span>
          {offer.originalAmountMinor !== undefined && (
            <span className="offer-card__original">
              De{" "}
              <s>
                {NumberUtil.formatMoney(
                  offer.originalAmountMinor,
                  offer.currency,
                )}
              </s>
            </span>
          )}
          <span className="offer-card__price-row">
            <strong className="offer-card__price">
              Por{" "}
              {NumberUtil.formatMoney(
                offer.negotiatedAmountMinor,
                offer.currency,
              )}
            </strong>
            {offer.discountPercent !== undefined && (
              <span className="discount-pill">
                {offer.discountPercent}% de desconto
              </span>
            )}
          </span>
          <span className="offer-card__condition">
            <span className="calendar-mark" aria-hidden="true">
              ▦
            </span>
            {offer.paymentCondition.label}
          </span>
        </span>
      </label>
      <button
        className="button button--primary offer-card__continue"
        type="button"
        onClick={() => onContinue(offer.id)}
        aria-label={`Continuar para pagamento com ${offer.creditorName}`}
      >
        Continuar <span aria-hidden="true">›</span>
      </button>
    </article>
  );
}
