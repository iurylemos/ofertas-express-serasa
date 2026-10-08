import type { PaymentMethod } from "@/interfaces/payment-method";
import { StatusMessage } from "@/components/molecules/StatusMessage";
import { PaymentMethodCard } from "@/features/payment/components/PaymentMethodCard";

interface PaymentMethodListProps {
  methods: PaymentMethod[] | undefined;
  selectedMethodId: string | null;
  isLoading: boolean;
  isError: boolean;
  onSelect: (methodId: string) => void;
  onRetry: () => void;
}

export function PaymentMethodList({
  methods,
  selectedMethodId,
  isLoading,
  isError,
  onSelect,
  onRetry,
}: PaymentMethodListProps) {
  if (isLoading) {
    return <StatusMessage variant="loading">Buscando formas de pagamento…</StatusMessage>;
  }
  if (isError) {
    return (
      <StatusMessage variant="error">
        <p>Não foi possível carregar as formas de pagamento.</p>
        <button className="text-button" type="button" onClick={onRetry}>Tentar novamente</button>
      </StatusMessage>
    );
  }
  if (!methods?.length) {
    return <StatusMessage variant="info">Não há formas de pagamento para esta oferta.</StatusMessage>;
  }

  return (
    <fieldset className="method-list">
      <legend className="sr-only">Formas de pagamento disponíveis</legend>
      {methods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          method={method}
          selected={selectedMethodId === method.id}
          onSelect={onSelect}
        />
      ))}
    </fieldset>
  );
}
