import type { ChangeEvent, JSX } from "react";
import type { PaymentMethod } from "@/interfaces/payment-method";
import { IconUtil } from "@/utils/icon.util";

type PaymentMethodCardProps = {
  method: PaymentMethod;
  selected: boolean;
  onSelect: (methodId: string) => void;
};

export function PaymentMethodCard({
  method,
  selected,
  onSelect,
}: Readonly<PaymentMethodCardProps>): JSX.Element {
  const handleChange = (_event: ChangeEvent<HTMLInputElement>) =>
    onSelect(method.id);

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
      <span className="method-card__icon" aria-hidden="true">
        {IconUtil.methodIcon(method.id)}
      </span>
      <span className="method-card__body">
        <span className="method-card__heading">
          <strong>{method.name}</strong>
          {method.badge && (
            <span className="discount-pill">{method.badge}</span>
          )}
        </span>
        <span className="method-card__description">{method.description}</span>
        {selected &&
          method.details?.map((detail) => (
            <span className="method-card__detail" key={detail}>
              {detail}
            </span>
          ))}
      </span>
    </label>
  );
}
