"use client";

import { CheckoutButton } from "@/features/checkout/components/CheckoutButton";
import { CheckoutFeedback } from "@/features/checkout/components/CheckoutFeedback";
import { CheckoutSuccess } from "@/features/checkout/components/CheckoutSuccess";
import { ReviewSummary } from "@/features/checkout/components/ReviewSummary";
import { useCheckoutFlow } from "@/features/checkout/hooks/use-checkout-flow";
import { useSubmitCheckout } from "@/features/checkout/hooks/use-submit-checkout";
import { OfferList } from "@/features/offers/components/OfferList";
import { PaymentMethodList } from "@/features/payment/components/PaymentMethodList";

const steps = [
  { id: "offers", label: "Ofertas" },
  { id: "payment", label: "Pagamento" },
  { id: "review", label: "Revisão" },
] as const;

export function CheckoutFlow() {
  const flow = useCheckoutFlow();
  const checkout = useSubmitCheckout();
  const success = checkout.data;

  if (success) return <CheckoutSuccess result={success} />;

  const stepIndex = steps.findIndex((step) => step.id === flow.activeStep);
  const submitSelectedCheckout = () => {
    if (checkout.isPending || !flow.selectedOfferId || !flow.selectedMethodId) return;
    checkout.mutate({
      offerId: flow.selectedOfferId,
      paymentMethodId: flow.selectedMethodId,
    });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Minhas dívidas, início">Minhas dívidas</a>
        <span className="brand-mark" aria-hidden="true">OE</span>
      </header>
      <main className="checkout-main">
        <nav className="step-progress" aria-label="Etapas do acordo">
          {steps.map((step, index) => (
            <div
              className={`step-progress__step${index <= stepIndex ? " step-progress__step--active" : ""}`}
              key={step.id}
              aria-current={index === stepIndex ? "step" : undefined}
            >
              <span className="step-progress__line" aria-hidden="true" />
              <span>{step.label}</span>
            </div>
          ))}
        </nav>

        {flow.activeStep === "offers" && (
          <section className="flow-section" aria-labelledby="offers-title">
            <div className="section-heading">
              <h1 id="offers-title">Escolha como quitar sua dívida</h1>
              <p>Compare os descontos e escolha a oferta que funciona para você.</p>
            </div>
            <OfferList
              offers={flow.offersQuery.data}
              selectedOfferId={flow.selectedOfferId}
              isLoading={flow.offersQuery.isPending}
              isError={flow.offersQuery.isError}
              onSelect={flow.selectOffer}
              onRetry={() => void flow.offersQuery.refetch()}
            />
            <div className="flow-actions flow-actions--end">
              <button
                className="button button--primary"
                type="button"
                onClick={flow.continueToPayment}
                disabled={!flow.offersQuery.isSuccess || !flow.selectedOffer}
              >
                Continuar para pagamento
              </button>
            </div>
          </section>
        )}

        {flow.activeStep === "payment" && flow.selectedOffer && (
          <section className="flow-section" aria-labelledby="payment-title">
            <div className="section-heading">
              <h1 id="payment-title">Como você quer pagar?</h1>
              <p>Escolha uma forma de pagamento para o seu acordo.</p>
            </div>
            <div className="payment-layout">
              <div>
                <PaymentMethodList
                  methods={flow.paymentMethodsQuery.data}
                  selectedMethodId={flow.selectedMethodId}
                  isLoading={flow.paymentMethodsQuery.isPending}
                  isError={flow.paymentMethodsQuery.isError}
                  onSelect={flow.selectMethod}
                  onRetry={() => void flow.paymentMethodsQuery.refetch()}
                />
              </div>
              <aside className="selection-summary" aria-label="Oferta selecionada">
                <div className="selection-summary__offer">
                  <span className="creditor-mark" aria-hidden="true">
                    {flow.selectedOffer.creditorName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
                  </span>
                  <div>
                    <strong>{flow.selectedOffer.creditorName}</strong>
                    <span>{flow.selectedOffer.description}</span>
                  </div>
                </div>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => flow.setActiveStep("offers")}
                >
                  Trocar oferta
                </button>
              </aside>
            </div>
            <div className="flow-actions">
              <button className="button button--quiet" type="button" onClick={() => flow.setActiveStep("offers")}>
                Voltar
              </button>
              <button
                className="button button--primary"
                type="button"
                onClick={flow.continueToReview}
                disabled={!flow.paymentMethodsQuery.isSuccess || !flow.selectedMethod}
              >
                Ir para revisão
              </button>
            </div>
          </section>
        )}

        {flow.activeStep === "review" && flow.selectedOffer && flow.selectedMethod && (
          <section className="flow-section review-section" aria-labelledby="review-title">
            <div className="section-heading">
              <h1 id="review-title">Revise seu acordo</h1>
              <p>Confira os dados antes de confirmar.</p>
            </div>
            <ReviewSummary offer={flow.selectedOffer} method={flow.selectedMethod} />
            <div className="flow-actions">
              <button
                className="button button--quiet"
                type="button"
                onClick={() => flow.setActiveStep("payment")}
                disabled={checkout.isPending}
              >
                Voltar
              </button>
              {checkout.isError ? (
                <CheckoutFeedback pending={checkout.isPending} onRetry={submitSelectedCheckout} />
              ) : (
                <CheckoutButton
                  pending={checkout.isPending}
                  disabled={!flow.selectedOfferId || !flow.selectedMethodId}
                  onConfirm={submitSelectedCheckout}
                />
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
