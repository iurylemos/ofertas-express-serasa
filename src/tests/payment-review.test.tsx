import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CheckoutFlow } from "@/features/checkout/components/CheckoutFlow";
import { renderWithProviders } from "@/tests/test-utils";

async function selectOfferAndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("radio", { name: /Banco Horizonte/ }));
  await user.click(screen.getByRole("button", {
    name: "Continuar para pagamento com Banco Horizonte",
  }));
}

describe("payment selection and review", () => {
  it("requires a method and displays the selected offer and method in review", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutFlow />);
    await selectOfferAndContinue(user);

    expect(await screen.findByRole("radio", { name: /Pix/ })).toBeInTheDocument();
    const reviewButton = screen.getByRole("button", { name: /Ir para revisão/ });
    expect(reviewButton).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: /Pix/ }));
    expect(reviewButton).toBeEnabled();
    await user.click(reviewButton);

    expect(screen.getByRole("heading", { name: "Revise seu acordo" })).toBeInTheDocument();
    expect(screen.getByText("Banco Horizonte")).toBeInTheDocument();
    expect(screen.getByText("Pix", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Termos do acordo" })).toBeInTheDocument();
    const confirmButton = screen.getByRole("button", { name: /Confirmar acordo/ });
    expect(confirmButton).toBeDisabled();
    await user.click(screen.getByRole("checkbox", { name: "Li e aceito os termos do acordo" }));
    expect(confirmButton).toBeEnabled();
  });

  it("clears a method that is unavailable after changing the offer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutFlow />);
    await selectOfferAndContinue(user);
    await user.click(await screen.findByRole("radio", { name: /Pix/ }));
    await user.click(screen.getByRole("button", { name: "Trocar oferta" }));
    await user.click(await screen.findByRole("radio", { name: /Conecta Telecom/ }));
    await user.click(screen.getByRole("button", {
      name: "Continuar para pagamento com Conecta Telecom",
    }));

    const boleto = await screen.findByRole("radio", { name: /Boleto/ });
    expect(boleto).not.toBeChecked();
    expect(screen.queryByRole("radio", { name: /Pix/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ir para revisão/ })).toBeDisabled();
  });
});
