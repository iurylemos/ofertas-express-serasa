import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { emptyOffersHandler } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { CheckoutFlow } from "@/features/checkout/components/CheckoutFlow";
import { renderWithProviders } from "@/tests/test-utils";

describe("offer selection", () => {
  it("continues from the selected offer card", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutFlow />);

    const offer = await screen.findByRole("radio", { name: /Banco Horizonte/ });
    expect(screen.getAllByRole("radio")).toHaveLength(3);

    await user.click(offer);

    expect(offer).toBeChecked();
    await user.click(screen.getByRole("button", {
      name: "Continuar para pagamento com Banco Horizonte",
    }));
    expect(await screen.findByRole("heading", { name: "Como você quer pagar?" })).toBeInTheDocument();
    expect(screen.getByText("Ofertas").parentElement).toHaveClass("step-progress__step--complete");
  });

  it("explains when no offers are available and prevents progression", async () => {
    server.use(emptyOffersHandler);
    renderWithProviders(<CheckoutFlow />);

    expect(await screen.findByText("No momento, não há ofertas disponíveis.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Continuar para pagamento/ })).not.toBeInTheDocument();
  });
});
