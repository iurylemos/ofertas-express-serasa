# Data Model: Offers Checkout Flow

This model describes only the data needed by the offers, payment selection, review, and
checkout flow. It does not introduce customer accounts, authentication, a database, or a
payment-provider integration.

## Entities

### Offer

Represents one available purchase or debt-settlement option.

| Field | Type | Required | Validation / purpose |
|---|---|---:|---|
| `id` | string | Yes | Stable unique identifier; used for selection and checkout. |
| `creditorName` | string | Yes | Non-empty display name that helps distinguish the offer. |
| `description` | string | Yes | Non-empty description/category, such as the account or service type. |
| `originalAmountMinor` | integer | No | Non-negative original amount in the currency's minor unit. |
| `negotiatedAmountMinor` | integer | Yes | Non-negative amount shown as the current offer value. |
| `currency` | string | Yes | ISO currency code; fixtures use `BRL`, matching the supplied references. |
| `discountPercent` | number | No | Between 0 and 100 inclusive when present. |
| `paymentCondition` | PaymentCondition | Yes | Describes single or installment payment terms for display. |
| `relationshipSince` | string | No | Optional human-readable date or period supplied for display. |
| `badge` | string | No | Optional concise offer label, such as a highlighted offer. |

### PaymentCondition

Describes the payment terms offered by an `Offer`.

| Field | Type | Required | Validation / purpose |
|---|---|---:|---|
| `kind` | `"single"` or `"installments"` | Yes | Identifies the payment arrangement. |
| `label` | string | Yes | Human-readable summary, such as "À vista". |
| `downPaymentMinor` | integer | No | Non-negative initial payment for installment arrangements. |
| `installmentCount` | integer | No | Positive number of installments when applicable. |
| `installmentAmountMinor` | integer | No | Non-negative amount per installment when applicable. |

When `kind` is `installments`, `installmentCount` and `installmentAmountMinor` are required.
For `single`, installment-only fields are omitted. Amounts use integer minor units rather than
floating-point currency values.

### PaymentMethod

Represents one way to complete the checkout for the selected offer.

| Field | Type | Required | Validation / purpose |
|---|---|---:|---|
| `id` | string | Yes | Stable identifier, such as `pix` or `boleto`. |
| `name` | string | Yes | Non-empty accessible display name. |
| `description` | string | Yes | Non-empty concise explanation of the method. |
| `badge` | string | No | Optional label, such as "Mais rápido". |
| `details` | string array | No | Optional short explanatory details for the selected method. |

Availability is scoped by the payment-method query response for the selected offer. A method
not returned for that offer cannot be selected.

### CheckoutSelection

Transient selection used by the step flow and review.

| Field | Type | Required | Validation / purpose |
|---|---|---:|---|
| `offerId` | string or null | Initially no | Must identify an offer currently available. |
| `paymentMethodId` | string or null | Initially no | Must identify a method currently available for `offerId`. |
| `activeStep` | `"offers"`, `"payment"`, or `"review"` | Yes | Can advance only when that step's required selections are valid. |

The selected IDs are UI state; the offer and method records remain in the React Query cache.
They must not be duplicated as copied server data in global state.

### CheckoutRequest

Submitted only after the review is confirmed.

| Field | Type | Required | Validation / purpose |
|---|---|---:|---|
| `offerId` | string | Yes | Must reference the currently selected available offer. |
| `paymentMethodId` | string | Yes | Must reference a method available for that offer. |

No customer identity, credentials, payment details, or agreement-acceptance field is in scope
for this feature specification.

### CheckoutResult

Represents the outcome of a confirmed request.

| Field | Type | Required | Validation / purpose |
|---|---|---:|---|
| `checkoutId` | string | On success | Non-empty reference for the completion state. |
| `status` | `"succeeded"` | On success | Determines the successful result state. |

A failed request is represented as a controlled service/query error, not as a success-shaped
result. The user-facing error is generic and must not expose technical response details.

## Relationships

- An `Offer` can have zero or more available `PaymentMethod` records.
- A `CheckoutSelection` references at most one `Offer` and one of that offer's available
  `PaymentMethod` records.
- A `CheckoutRequest` is valid only when both references are present and valid.
- A successful `CheckoutResult` is produced by one confirmed valid request.

## Validation Rules

1. Offers and payment methods have unique, non-empty IDs within their respective responses.
2. Offers and payment methods have non-empty display names; an empty response is a valid
   empty state, not a valid checkout selection.
3. A payment method may be selected only after an offer has been selected and its methods have
   loaded successfully.
4. Changing the offer clears a payment selection if that method is not available for the new
   offer; the customer must select a valid method before review.
5. Review and checkout require both valid IDs.
6. A checkout mutation cannot be submitted again while a request is pending.
7. On recoverable failure, retain valid selection IDs; allow a retry.
8. If offers or methods fail to load, show an error state and do not advance using stale or
   missing selection data.
9. Store mock monetary values as integer minor units with an explicit currency code; format
   values for display without changing the underlying amount.

## State Transitions

```text
Offers: idle -> loading -> success | empty | error
Payment methods: idle -> loading -> success | empty | error
Selection: no offer -> offer selected -> method selected -> review
Offer change: offer selected -> refresh methods -> keep valid method or clear method
Checkout: ready -> pending -> succeeded
Checkout: ready -> pending -> error -> retry -> pending
```

Progression is guarded at every transition. Checkout success ends the current attempt; a
recoverable error preserves the still-valid selection.

## Explicitly Out of Scope

- Persistent customer, session, or transaction storage.
- Authentication, customer identity, real payment credentials, or payment-provider rules.
- A legal agreement or terms-acceptance gate. The Step 3 reference depicts one, but the
  feature specification does not require it; adding it requires a specification update.
