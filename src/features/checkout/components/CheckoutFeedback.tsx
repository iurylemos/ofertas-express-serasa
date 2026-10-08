import { StatusMessage } from "@/components/molecules/StatusMessage";

interface CheckoutFeedbackProps {
  pending: boolean;
  onRetry: () => void;
}

export function CheckoutFeedback({ pending, onRetry }: CheckoutFeedbackProps) {
  return (
    <StatusMessage variant="error" className="checkout-feedback">
      <p>Não foi possível concluir seu acordo. Tente novamente.</p>
      <button
        className="button button--primary"
        type="button"
        onClick={onRetry}
        disabled={pending}
      >
        Tentar novamente
      </button>
    </StatusMessage>
  );
}
