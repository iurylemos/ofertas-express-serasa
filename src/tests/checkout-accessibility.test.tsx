import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { offersErrorHandler } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { CheckoutFlow } from "@/features/checkout/components/CheckoutFlow";
import { renderWithProviders } from "@/tests/test-utils";

describe("checkout accessibility", () => {
  it("supports keyboard selection with named choices and exposes the active step", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutFlow />);

    const offer = await screen.findByRole("radio", { name: "Banco Horizonte, Cartão de crédito" });
    await user.tab();
    expect(screen.getByRole("link", { name: "Minhas dívidas, início" })).toHaveFocus();
    await user.tab();
    expect(offer).toHaveFocus();
    await user.keyboard(" ");
    expect(offer).toBeChecked();

    await user.tab();
    expect(screen.getByRole("button", { name: /Continuar para pagamento/ })).toHaveFocus();
    await user.keyboard("{Enter}");

    const pix = await screen.findByRole("radio", { name: "Pix" });
    await user.tab();
    await user.tab();
    expect(pix).toHaveFocus();
    await user.keyboard(" ");
    expect(pix).toBeChecked();
    expect(screen.getByRole("navigation", { name: "Etapas do acordo" }))
      .toHaveTextContent("Pagamento");
    expect(screen.getByText("Pagamento").parentElement).toHaveAttribute("aria-current", "step");
  });

  it("announces offer loading failures in an accessible alert", async () => {
    server.use(offersErrorHandler);
    renderWithProviders(<CheckoutFlow />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar as ofertas agora.",
    );
    expect(screen.getByRole("button", { name: /Continuar para pagamento/ })).toBeDisabled();
  });
});
