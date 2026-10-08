# Offers and Checkout API Contract

This is the mock-service boundary for the feature, not a contract with a production backend.
All requests are relative to the application origin. MSW implements the success and failure
responses used during development and tests. No authentication headers are required.

## `GET /offers`

Returns the available offers.

### Success: `200 OK`

```json
{
  "data": [
    {
      "id": "bank-horizonte",
      "creditorName": "Banco Horizonte",
      "description": "Cartão de crédito",
      "originalAmountMinor": 348090,
      "negotiatedAmountMinor": 68900,
      "currency": "BRL",
      "discountPercent": 80,
      "paymentCondition": {
        "kind": "single",
        "label": "À vista - pagamento único"
      },
      "relationshipSince": "mar/2023",
      "badge": "Melhor oferta"
    }
  ]
}
```

An empty `data` array is a valid empty state. It does not permit progression to payment
selection.

## `GET /payment-methods?offerId={offerId}`

Returns methods available for the selected offer. `offerId` is required in the feature mock
contract so that method availability can vary by offer.

### Success: `200 OK`

```json
{
  "data": [
    {
      "id": "pix",
      "name": "Pix",
      "description": "Pagamento na hora, sem sair de casa",
      "badge": "Mais rápido",
      "details": [
        "O pagamento é compensado em poucos minutos."
      ]
    },
    {
      "id": "boleto",
      "name": "Boleto",
      "description": "Pague no app do banco ou em lotéricas",
      "details": [
        "A compensação pode levar até 3 dias úteis."
      ]
    }
  ]
}
```

An empty `data` array is a valid empty state and prevents review. An unknown offer ID returns
`404 Not Found`; callers must show a controlled, user-friendly failure state.

## `POST /checkout`

Confirms one offer and payment method.

### Request

```json
{
  "offerId": "bank-horizonte",
  "paymentMethodId": "pix"
}
```

Both identifiers are required and must correspond to current available data.

### Success: `200 OK`

```json
{
  "data": {
    "checkoutId": "checkout-123",
    "status": "succeeded"
  }
}
```

### Simulated server failure: `500 Internal Server Error`

```json
{
  "error": {
    "code": "CHECKOUT_UNAVAILABLE"
  }
}
```

The UI must not display the raw error code or technical response. It shows a concise
customer-friendly failure message, retains valid selections, and enables a retry after the
pending request settles.

## Shared Response and Error Handling

- Successful list responses use `{ "data": [...] }`.
- Successful checkout uses `{ "data": { ... } }`.
- A service validates HTTP success before returning typed data.
- Services expose useful typed errors to feature logic; components render only safe,
  user-facing messages and never expose raw stack traces or response internals.
- While checkout is pending, the submit control and handler must prevent another submission.
- The development browser worker and Node test server reuse the same handler definitions and
  fixtures. Tests may override a handler for the HTTP 500 case.

## Mock Coverage

Handlers must include:

1. `GET /offers` success with multiple distinguishable offers.
2. `GET /offers` empty response and a request failure for state coverage.
3. `GET /payment-methods` success for the selected offer, plus empty and error variants.
4. `POST /checkout` success.
5. `POST /checkout` HTTP 500 failure.
