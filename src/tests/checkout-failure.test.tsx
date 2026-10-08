import { delay, http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { CheckoutFlow } from "@/components/templates/CheckoutFlow";
import { renderWithProviders } from "@/tests/test-utils";

describe("checkout failure recovery", () => {
  it("keeps selections, prevents duplicate requests, and retries after HTTP 500", async () => {
    let attempts = 0;
    server.use(
      http.post(/\/checkout$/, async () => {
        attempts += 1;
        await delay(120);
        if (attempts === 1) {
          return HttpResponse.json(
            { error: { code: "CHECKOUT_UNAVAILABLE" } },
            { status: 500 },
          );
        }
        return HttpResponse.json({
          data: { checkoutId: "checkout-retry-7", status: "succeeded" },
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
    await user.click(screen.getByRole("checkbox", { name: "Li e aceito os termos do acordo" }));
    await user.click(confirm);
    expect(confirm).toBeDisabled();
    await user.click(confirm);
    expect(attempts).toBe(1);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível concluir seu acordo. Tente novamente.",
    );
    expect(screen.getByText("Banco Horizonte")).toBeInTheDocument();
    expect(screen.getByText("Pix", { selector: "strong" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByRole("heading", { name: "Acordo concluído" })).toBeInTheDocument();
    expect(screen.getByText("checkout-retry-7")).toBeInTheDocument();
    expect(attempts).toBe(2);
  });
});
