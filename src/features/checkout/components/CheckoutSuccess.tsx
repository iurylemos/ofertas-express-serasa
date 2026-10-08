import type { JSX } from "react";
import type { CheckoutResult } from "@/interfaces/checkout";

type CheckoutSuccessProps = {
  result: CheckoutResult;
};

export function CheckoutSuccess({
  result,
}: Readonly<CheckoutSuccessProps>): JSX.Element {
  return (
    <section className="success-panel" role="status" aria-live="polite">
      <span className="success-panel__mark" aria-hidden="true">
        ✓
      </span>
      <h1>Acordo concluído</h1>
      <p>Seu acordo foi confirmado. Guarde o número de referência:</p>
      <strong className="success-panel__reference">{result.checkoutId}</strong>
    </section>
  );
}
