"use client";

import { useEffect, useState, type JSX } from "react";
import { CheckoutButton } from "@/components/atoms/CheckoutButton";
import { CheckoutFeedback } from "@/components/molecules/CheckoutFeedback";
import { CheckoutSuccess } from "@/components/organisms/CheckoutSuccess";
import { ReviewSummary } from "@/components/organisms/ReviewSummary";
import { useCheckoutFlow } from "@/hooks/use-checkout-flow";
import { useSubmitCheckout } from "@/hooks/use-submit-checkout";
import { OfferList } from "@/components/organisms/OfferList";
import { PaymentMethodList } from "@/components/organisms/PaymentMethodList";
import { NumberUtil } from "@/utils/number.util";

const steps = [
  { id: "offers", label: "Ofertas" },
  { id: "payment", label: "Pagamento" },
  { id: "review", label: "Revisão" },
] as const;

export function CheckoutFlow(): JSX.Element {
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const flow = useCheckoutFlow();
  const checkout = useSubmitCheckout();
  const success = checkout.data;

  useEffect(() => {
    setAcceptedTerms(false);
  }, [flow.selectedOfferId, flow.selectedMethodId]);

  if (success) return <CheckoutSuccess result={success} />;

  const stepIndex = steps.findIndex((step) => step.id === flow.activeStep);

  const submitSelectedCheckout = (): void => {
    if (
      checkout.isPending ||
      !acceptedTerms ||
      !flow.selectedOfferId ||
      !flow.selectedMethodId
    )
      return;
    checkout.mutate({
      offerId: flow.selectedOfferId,
      paymentMethodId: flow.selectedMethodId,
    });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <a className="brand" href="/" aria-label="Minhas dívidas, início">
            Minhas dívidas
          </a>
          <div className="topbar__user">
            <span>Olá, Maria</span>
            <span className="brand-mark" aria-label="Maria Silva">
              MS
            </span>
          </div>
        </div>
      </header>
      <main className="checkout-main">
        <nav className="step-progress" aria-label="Etapas do acordo">
          {steps.map((step, index) => (
            <div
              className={`step-progress__step${index < stepIndex ? " step-progress__step--complete" : ""}${index === stepIndex ? " step-progress__step--active" : ""}`}
              key={step.id}
              aria-current={index === stepIndex ? "step" : undefined}
            >
              <span className="step-progress__line" aria-hidden="true" />
              <span className="step-progress__label">
                {index < stepIndex && <span aria-hidden="true">✓ </span>}
                {step.label}
              </span>
            </div>
          ))}
        </nav>

        {flow.activeStep === "offers" && (
          <section className="flow-section" aria-labelledby="offers-title">
            <div className="section-heading">
              <h1 id="offers-title">Escolha como quitar sua dívida</h1>
              <p>
                Compare os descontos e escolha a oferta que funciona para você.
              </p>
            </div>
            <OfferList
              offers={flow.offersQuery.data}
              selectedOfferId={flow.selectedOfferId}
              isLoading={flow.offersQuery.isPending}
              isError={flow.offersQuery.isError}
              onSelect={flow.selectOffer}
              onContinue={flow.continueToPayment}
              onRetry={() => void flow.offersQuery.refetch()}
            />
          </section>
        )}

        {flow.activeStep === "payment" && flow.selectedOffer && (
          <section className="flow-section" aria-labelledby="payment-title">
            <div className="section-heading">
              <h1 id="payment-title">Como você quer pagar?</h1>
              <p>Escolha uma forma de pagamento para o seu acordo.</p>
            </div>
            <div className="payment-layout">
              <aside
                className="selection-summary payment-layout__offer"
                aria-label="Oferta selecionada"
              >
                <div className="selection-summary__offer">
                  <span className="creditor-mark" aria-hidden="true">
                    {flow.selectedOffer.creditorName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{flow.selectedOffer.creditorName}</strong>
                    <span>{flow.selectedOffer.description}</span>
                    <span className="selection-summary__amount">
                      {NumberUtil.formatMoney(
                        flow.selectedOffer.negotiatedAmountMinor,
                        flow.selectedOffer.currency,
                      )}
                      {flow.selectedOffer.paymentCondition.kind === "single"
                        ? " à vista"
                        : ""}
                    </span>
                  </div>
                  {flow.selectedOffer.discountPercent !== undefined && (
                    <span className="discount-pill">
                      -{flow.selectedOffer.discountPercent}%
                    </span>
                  )}
                </div>
                {flow.selectedOffer.originalAmountMinor !== undefined && (
                  <s className="selection-summary__original">
                    {NumberUtil.formatMoney(
                      flow.selectedOffer.originalAmountMinor,
                      flow.selectedOffer.currency,
                    )}
                  </s>
                )}
                <button
                  className="text-button"
                  type="button"
                  onClick={() => flow.setActiveStep("offers")}
                >
                  Trocar oferta <span aria-hidden="true">›</span>
                </button>
              </aside>
              <div className="payment-methods payment-layout__methods">
                <PaymentMethodList
                  methods={flow.paymentMethodsQuery.data}
                  selectedMethodId={flow.selectedMethodId}
                  isLoading={flow.paymentMethodsQuery.isPending}
                  isError={flow.paymentMethodsQuery.isError}
                  onSelect={flow.selectMethod}
                  onRetry={() => void flow.paymentMethodsQuery.refetch()}
                />
              </div>
              <div className="payment-action-card payment-layout__actions">
                <div className="agreement-amount">
                  <span>Valor do acordo</span>
                  <strong>
                    {NumberUtil.formatMoney(
                      flow.selectedOffer.negotiatedAmountMinor,
                      flow.selectedOffer.currency,
                    )}
                  </strong>
                </div>
                <button
                  className="button button--primary"
                  type="button"
                  onClick={flow.continueToReview}
                  disabled={
                    !flow.paymentMethodsQuery.isSuccess || !flow.selectedMethod
                  }
                >
                  Ir para revisão <span aria-hidden="true">›</span>
                </button>
                <button
                  className="button button--quiet"
                  type="button"
                  onClick={() => flow.setActiveStep("offers")}
                >
                  Voltar
                </button>
              </div>
            </div>
          </section>
        )}

        {flow.activeStep === "review" &&
          flow.selectedOffer &&
          flow.selectedMethod && (
            <section
              className="flow-section review-section"
              aria-labelledby="review-title"
            >
              <div className="section-heading">
                <h1 id="review-title">Revise seu acordo</h1>
                <p>Confira os dados antes de confirmar.</p>
              </div>
              <div className="review-layout">
                <ReviewSummary
                  offer={flow.selectedOffer}
                  method={flow.selectedMethod}
                  acceptedTerms={acceptedTerms}
                  onAcceptTerms={setAcceptedTerms}
                />
                <div className="review-action-card">
                  <div className="agreement-amount">
                    <span>Valor do acordo</span>
                    <strong>
                      {NumberUtil.formatMoney(
                        flow.selectedOffer.negotiatedAmountMinor,
                        flow.selectedOffer.currency,
                      )}
                    </strong>
                  </div>
                  {checkout.isError ? (
                    <CheckoutFeedback
                      pending={checkout.isPending}
                      disabled={!acceptedTerms}
                      onRetry={submitSelectedCheckout}
                    />
                  ) : (
                    <CheckoutButton
                      pending={checkout.isPending}
                      disabled={
                        !acceptedTerms ||
                        !flow.selectedOfferId ||
                        !flow.selectedMethodId
                      }
                      onConfirm={submitSelectedCheckout}
                    />
                  )}
                  <button
                    className="button button--quiet"
                    type="button"
                    onClick={() => flow.setActiveStep("payment")}
                    disabled={checkout.isPending}
                  >
                    Voltar
                  </button>
                  <p className="review-action-card__note">
                    <span aria-hidden="true">ⓘ</span>
                    Após confirmar,{" "}
                    {flow.selectedMethod.id === "pix"
                      ? "geramos o QR Code e o código Pix copia e cola."
                      : "geramos o boleto para pagamento."}
                  </p>
                </div>
              </div>
            </section>
          )}
      </main>
    </div>
  );
}
