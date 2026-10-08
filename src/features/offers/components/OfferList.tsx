import type { Offer } from "@/interfaces/offer";
import { StatusMessage } from "@/components/molecules/StatusMessage";
import { OfferCard } from "@/features/offers/components/OfferCard";

interface OfferListProps {
  offers: Offer[] | undefined;
  selectedOfferId: string | null;
  isLoading: boolean;
  isError: boolean;
  onSelect: (offerId: string) => void;
  onRetry: () => void;
}

export function OfferList({
  offers,
  selectedOfferId,
  isLoading,
  isError,
  onSelect,
  onRetry,
}: OfferListProps) {
  if (isLoading) {
    return <StatusMessage variant="loading">Buscando ofertas…</StatusMessage>;
  }
  if (isError) {
    return (
      <StatusMessage variant="error">
        <p>Não foi possível carregar as ofertas agora.</p>
        <button className="text-button" type="button" onClick={onRetry}>Carregar novamente</button>
      </StatusMessage>
    );
  }
  if (!offers?.length) {
    return <StatusMessage variant="info">No momento, não há ofertas disponíveis.</StatusMessage>;
  }

  return (
    <fieldset className="choice-fieldset">
      <legend className="sr-only">Ofertas disponíveis</legend>
      <div className="offer-grid">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            selected={selectedOfferId === offer.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </fieldset>
  );
}
