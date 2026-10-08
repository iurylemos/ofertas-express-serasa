import type { ChangeEvent } from "react";
import type { Offer } from "@/interfaces/offer";

interface OfferCardProps {
  offer: Offer;
  selected: boolean;
  onSelect: (offerId: string) => void;
}

function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(amountMinor / 100);
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("pt-BR"))
    .join("");
}

export function OfferCard({ offer, selected, onSelect }: OfferCardProps) {
  const handleChange = (_event: ChangeEvent<HTMLInputElement>) => onSelect(offer.id);

  return (
    <label className={`offer-card${selected ? " offer-card--selected" : ""}`}>
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
        {offer.badge && <span className="offer-card__badge">{offer.badge}</span>}
        <span className="offer-card__identity">
          <span className="creditor-mark" aria-hidden="true">{initials(offer.creditorName)}</span>
          <span className="offer-card__creditor">
            <strong>{offer.creditorName}</strong>
            <span>{offer.description}{offer.relationshipSince ? ` · desde ${offer.relationshipSince}` : ""}</span>
          </span>
        </span>
        {offer.originalAmountMinor !== undefined && (
          <span className="offer-card__original">
            De <s>{formatMoney(offer.originalAmountMinor, offer.currency)}</s>
          </span>
        )}
        <span className="offer-card__price-row">
          <strong className="offer-card__price">Por {formatMoney(offer.negotiatedAmountMinor, offer.currency)}</strong>
          {offer.discountPercent !== undefined && (
            <span className="discount-pill">{offer.discountPercent}% de desconto</span>
          )}
        </span>
        <span className="offer-card__condition">
          <span className="calendar-mark" aria-hidden="true">▦</span>
          {offer.paymentCondition.label}
        </span>
      </span>
    </label>
  );
}
