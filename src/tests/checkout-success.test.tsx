import { delay, http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { CheckoutFlow } from "@/components/templates/CheckoutFlow";
import { renderWithProviders } from "@/tests/test-utils";

describe("checkout success", () => {
  it("announces pending state, prevents a duplicate, and displays completion", async () => {
    server.use(
      http.post(/\/checkout$/, async () => {
        await delay(120);
        return HttpResponse.json({
          data: { checkoutId: "checkout-test-42", status: "succeeded" },
        });
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<CheckoutFlow />);
    await user.click(await screen.findByRole("radio", { name: /Banco Horizonte/ }));
    await user.click(screen.getByRole("button", {
      name: "Continuar para pagamento com Banco Horizonte",
    }));
    await user.click(await screen.findByRole("radio", { name: /Pix/ }));
    await user.click(screen.getByRole("button", { name: /Ir para revisão/ }));

    const confirm = screen.getByRole("button", { name: /Confirmar acordo/ });
    expect(confirm).toBeDisabled();
    await user.click(screen.getByRole("checkbox", { name: "Li e aceito os termos do acordo" }));
    await user.click(confirm);

    expect(screen.getByRole("status")).toHaveTextContent(/processando/i);
    expect(confirm).toBeDisabled();
    expect(await screen.findByRole("heading", { name: /Acordo concluído/ })).toBeInTheDocument();
    expect(screen.getByText("checkout-test-42")).toBeInTheDocument();
  });
});
