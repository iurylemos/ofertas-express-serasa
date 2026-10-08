interface CheckoutButtonProps {
  disabled: boolean;
  pending: boolean;
  onConfirm: () => void;
}

export function CheckoutButton({ disabled, pending, onConfirm }: CheckoutButtonProps) {
  return (
    <>
      <button
        className="button button--primary"
        type="button"
        onClick={onConfirm}
        disabled={disabled || pending}
      >
        {pending ? "Processando…" : "Confirmar acordo"}
      </button>
      {pending && (
        <span className="sr-only" role="status" aria-live="polite">
          Processando seu acordo.
        </span>
      )}
    </>
  );
}
