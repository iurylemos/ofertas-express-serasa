import { StatusMessage } from "@/components/molecules/StatusMessage";

interface CheckoutFeedbackProps {
  pending: boolean;
  disabled?: boolean;
  onRetry: () => void;
}

export function CheckoutFeedback({ pending, disabled = false, onRetry }: CheckoutFeedbackProps) {
  return (
    <StatusMessage variant="error" className="checkout-feedback">
      <p>Não foi possível concluir seu acordo. Tente novamente.</p>
      <button
        className="button button--primary"
        type="button"
        onClick={onRetry}
        disabled={pending || disabled}
      >
        Tentar novamente
      </button>
    </StatusMessage>
  );
}
