import type { ChangeEvent } from "react";
import type { PaymentMethod } from "@/interfaces/payment-method";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: boolean;
  onSelect: (methodId: string) => void;
}

function methodIcon(methodId: string): string {
  if (methodId === "pix") return "✣";
  if (methodId === "boleto") return "▤";
  return "◈";
}

export function PaymentMethodCard({ method, selected, onSelect }: PaymentMethodCardProps) {
  const handleChange = (_event: ChangeEvent<HTMLInputElement>) => onSelect(method.id);

  return (
    <label className={`method-card${selected ? " method-card--selected" : ""}`}>
      <input
        className="choice-input"
        type="radio"
        name="payment-method"
        value={method.id}
        checked={selected}
        onChange={handleChange}
        aria-label={method.name}
      />
      <span className="method-card__icon" aria-hidden="true">{methodIcon(method.id)}</span>
      <span className="method-card__body">
        <span className="method-card__heading">
          <strong>{method.name}</strong>
          {method.badge && <span className="discount-pill">{method.badge}</span>}
        </span>
        <span className="method-card__description">{method.description}</span>
        {selected && method.details?.map((detail) => (
          <span className="method-card__detail" key={detail}>{detail}</span>
        ))}
      </span>
    </label>
  );
}
