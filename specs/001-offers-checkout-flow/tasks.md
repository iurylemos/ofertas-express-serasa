# Tasks: Offers Checkout Flow

**Input**: Design documents from `/specs/001-offers-checkout-flow/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and
`contracts/offers-checkout-api.md`

**Tests**: Behavioral and API contract test tasks are included because the project constitution
requires MSW and at least three Testing Library behavioral tests. Tests are listed before
story implementation tasks.

**Organization**: Tasks are grouped by user story. Mark a task complete only after implementing
and validating its deliverables.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches a separate file and has no incomplete-task
  dependency.
- **[Story]**: Maps a task to the corresponding user story in `spec.md`.
- Every task includes the target file path(s).

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the web application and the required development/test tooling.

- [X] T001 Initialize Next.js App Router, React, TypeScript, TanStack React Query, MSW, Vitest, jsdom, and Testing Library dependencies and npm scripts in `package.json` and generate `package-lock.json`.
- [X] T002 [P] Configure Next.js and strict TypeScript for the single web app in `next.config.ts` and `tsconfig.json` (including `"strict": true`).
- [X] T003 Create the App Router root layout and global stylesheet in `src/app/layout.tsx` and `src/app/globals.css`.
- [X] T004 [P] Configure Vitest and jsdom to load `src/tests/setup.ts` in `vitest.config.ts`.

**Checkpoint**: App and test tooling are configured; the existing placeholder `test` script
has been replaced.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Complete shared contracts, request handling, mocks, and providers before any
user-story work.

**CRITICAL**: User-story implementation depends on this phase.

- [X] T005 Define shared Offer, PaymentCondition, PaymentMethod, CheckoutRequest, CheckoutResult, and API error types in `src/interfaces/offer.ts`, `src/interfaces/payment-method.ts`, `src/interfaces/checkout.ts`, and `src/interfaces/api-error.ts`; preserve these model constraints: IDs are "unique, non-empty"; display names are "Non-empty"; amounts are "Non-negative"; `discountPercent` is "Between 0 and 100 inclusive when present"; and when `kind` is `"installments"`, `installmentCount` and `installmentAmountMinor` are required and the count is positive.
- [X] T006 [P] Implement the shared typed HTTP client and safe API error normalization in `src/services/api-client.ts`; reject non-success responses and do not expose raw response details to UI components.
- [X] T007 [P] Create representative offer fixtures with integer minor-unit amounts and explicit currency in `src/mocks/fixtures/offers.ts`, including multiple distinguishable offers and an empty-list fixture.
- [X] T008 [P] Create payment-method fixtures in `src/mocks/fixtures/payment-methods.ts`, including methods available for different offers and an empty-list fixture.
- [X] T009 Define reusable MSW handlers for `GET /offers`, `GET /payment-methods?offerId=...`, and `POST /checkout` in `src/mocks/handlers.ts`, covering list success/empty/error, checkout success, and checkout HTTP 500.
- [X] T010 [P] Configure browser request interception in `src/mocks/browser.ts` and generate the required worker at `public/mockServiceWorker.js` from the installed MSW version.
- [X] T011 [P] Configure Node MSW lifecycle and test cleanup in `src/mocks/server.ts` and `src/tests/setup.ts`, reusing the shared handlers from `src/mocks/handlers.ts`.
- [X] T012 [P] Create a stable browser QueryClient provider in `src/providers/query-provider.tsx`; do not share a server QueryClient singleton.
- [X] T013 Integrate the QueryClient provider and browser MSW startup gate in `src/providers/mock-worker-provider.tsx` and `src/app/layout.tsx`; ensure feature queries wait until the browser worker is ready in development.

**Checkpoint**: Shared data contracts, API client, mock success/failure paths, test harness, and
providers are ready. No real API or authentication is required.

---

## Phase 3: User Story 1 — Select an Offer and Complete Checkout (Priority: P1) MVP

**Goal**: Let a customer select one offer and payment method, review both, and complete a
successful checkout without account creation.

**Independent Test**: With MSW success responses, load multiple offers, select one, select an
available payment method, verify the review, confirm checkout, and observe a completion state.
Verify that missing required selections prevent progression.

### Tests for User Story 1

Write these tests first and verify they fail before implementing the story.

- [X] T014 [P] [US1] Add MSW contract tests for successful `GET /offers`, `GET /payment-methods?offerId=...`, and `POST /checkout` responses in `src/tests/contracts/offers-checkout-api.test.ts`.
- [X] T015 [P] [US1] Add a Testing Library behavior test for offer display, single selection, visible selected state, and empty offers in `src/tests/offers-selection.test.tsx`.
- [X] T016 [P] [US1] Add a Testing Library behavior test for payment-method selection, required-selection gating, invalidated-method clearing, and review contents in `src/tests/payment-review.test.tsx`.
- [X] T017 [P] [US1] Add a Testing Library behavior test for confirming a valid review, showing pending state, preventing a duplicate submission, and displaying checkout success in `src/tests/checkout-success.test.tsx`.

### Implementation for User Story 1

- [X] T018 [P] [US1] Implement the offer request service using the shared API client and typed response in `src/services/offers-service.ts` (depends on T005 and T006).
- [X] T019 [US1] Implement the offers React Query hook and stable query key in `src/features/offers/hooks/use-offers.ts` (depends on T018).
- [X] T020 [P] [US1] Create the typed, individually selectable offer presentation in `src/features/offers/components/OfferCard.tsx` (depends on T005).
- [X] T021 [US1] Create the offer collection and empty/loading/error rendering in `src/features/offers/components/OfferList.tsx` (depends on T019 and T020).
- [X] T022 [P] [US1] Implement the payment-method request service using the shared API client in `src/services/payment-service.ts`; pass the selected offer ID as specified by `contracts/offers-checkout-api.md` (depends on T005 and T006).
- [X] T023 [US1] Implement the payment-method React Query hook and offer-scoped query key in `src/features/payment/hooks/use-payment-methods.ts` (depends on T022).
- [X] T024 [P] [US1] Create the typed payment-method choice presentation in `src/features/payment/components/PaymentMethodCard.tsx` (depends on T005).
- [X] T025 [US1] Create the payment-method collection, including empty/loading/error states, in `src/features/payment/components/PaymentMethodList.tsx` (depends on T023 and T024).
- [X] T026 [US1] Implement transient selected IDs and guarded offer/payment/review step transitions in `src/features/checkout/hooks/use-checkout-flow.ts`; clear a payment method when it is unavailable for a changed offer (depends on T019 and T023).
- [X] T027 [P] [US1] Create a review summary that displays the selected offer and method from current query data in `src/features/checkout/components/ReviewSummary.tsx` (depends on T005).
- [X] T028 [US1] Implement the typed checkout request and success response handling in `src/services/checkout-service.ts` (depends on T005 and T006).
- [X] T029 [US1] Implement the checkout React Query mutation in `src/features/checkout/hooks/use-submit-checkout.ts`; submit only the required `offerId` and `paymentMethodId` (depends on T028).
- [X] T030 [P] [US1] Create the checkout action and success presentation in `src/features/checkout/components/CheckoutButton.tsx` and `src/features/checkout/components/CheckoutSuccess.tsx` (depends on T005).
- [X] T031 [US1] Compose offer, payment, review, and success states into the single checkout flow in `src/features/checkout/components/CheckoutFlow.tsx` and render it from `src/app/page.tsx` (depends on T019, T021, T023, T025–T030).
- [X] T032 [US1] Run the US1 behavioral and contract tests and correct failures in `src/tests/offers-selection.test.tsx`, `src/tests/payment-review.test.tsx`, `src/tests/checkout-success.test.tsx`, and `src/tests/contracts/offers-checkout-api.test.ts` using the scripts in `package.json`.

**Checkpoint**: US1 works independently through successful checkout and its tests pass.

---

## Phase 4: User Story 2 — Recover from a Checkout Failure (Priority: P2)

**Goal**: Communicate checkout failure safely, preserve valid selections, and allow a retry.

**Independent Test**: Starting from the working checkout review, return HTTP 500 from MSW;
verify the application remains usable, selected values remain visible, and the customer can
retry after the failed request settles.

### Tests for User Story 2

Write these tests first and verify they fail before implementing failure recovery.

- [X] T033 [P] [US2] Add a contract test for the checkout HTTP 500 response in `src/tests/contracts/offers-checkout-api.test.ts`.
- [X] T034 [P] [US2] Add a Testing Library and MSW behavior test for accessible failure feedback, retained offer/payment selections, retry, and duplicate-submit prevention in `src/tests/checkout-failure.test.tsx`.

### Implementation for User Story 2

- [X] T035 [P] [US2] Map checkout HTTP failures to a safe typed error without exposing server details in `src/services/checkout-service.ts` and `src/interfaces/api-error.ts`.
- [X] T036 [P] [US2] Create an accessible customer-facing checkout failure and retry message in `src/features/checkout/components/CheckoutFeedback.tsx`.
- [X] T037 [US2] Integrate failure feedback and retry with the checkout mutation while retaining valid selected IDs in `src/features/checkout/hooks/use-submit-checkout.ts` and `src/features/checkout/components/CheckoutFlow.tsx`; ensure a retry is enabled only after pending state ends (depends on T035 and T036).
- [X] T038 [US2] Run the HTTP 500/retry behavior and contract tests and correct failures in `src/tests/checkout-failure.test.tsx` and `src/tests/contracts/offers-checkout-api.test.ts` using the scripts in `package.json`.

**Checkpoint**: US1 still succeeds, and US2 handles recoverable server failures without losing
valid selections.

---

## Phase 5: User Story 3 — Use Checkout Across Devices and Input Methods (Priority: P3)

**Goal**: Make the complete flow understandable and operable by keyboard and assistive
technology on mobile, tablet, and desktop.

**Independent Test**: At mobile, tablet, and desktop widths, navigate the working flow by
keyboard, inspect accessible names and selected states, and verify loading/error feedback,
focus visibility, readable layout, and no horizontal overflow.

### Tests for User Story 3

Write these tests first and verify they fail before implementing accessibility changes.

- [X] T039 [P] [US3] Add keyboard-navigation and accessible-name/state behavior tests for offer/payment choices and status feedback in `src/tests/checkout-accessibility.test.tsx`.

### Implementation for User Story 3

- [X] T040 [US3] After T039 demonstrates the expected test failure, ensure offer and payment choices expose semantic interactive roles, accessible names, selected states, and keyboard operation in `src/features/offers/components/OfferCard.tsx` and `src/features/payment/components/PaymentMethodCard.tsx`.
- [X] T041 [P] [US3] Add reusable accessible loading/error status messaging and integrate it with offer, payment, and checkout states in `src/components/molecules/StatusMessage.tsx`, `src/features/offers/components/OfferList.tsx`, `src/features/payment/components/PaymentMethodList.tsx`, and `src/features/checkout/components/CheckoutFeedback.tsx`.
- [X] T042 [US3] Implement visible focus, WCAG AA contrast, text wrapping, mobile/tablet/desktop layout, and 200% text enlargement support in `src/app/globals.css`, `src/features/offers/components/OfferList.tsx`, `src/features/payment/components/PaymentMethodList.tsx`, and `src/features/checkout/components/CheckoutFlow.tsx`.
- [X] T043 [US3] Validate all steps at mobile, tablet, and desktop widths against `assets/01-mobile.png`, `assets/01-desktop.png`, `assets/02-mobile.png`, `assets/02-desktop.png`, and `assets/03-mobile.png`; correct responsive layout issues in `src/app/globals.css`.
- [X] T044 [US3] Run keyboard/accessibility behavior tests and correct failures in `src/tests/checkout-accessibility.test.tsx`, `src/tests/offers-selection.test.tsx`, and `src/tests/payment-review.test.tsx` using the scripts in `package.json`.

**Checkpoint**: The full flow is keyboard operable, its status is accessible, and the layouts
remain usable across the required viewport classes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation and verify the complete flow.

- [X] T045 Update project prerequisites, `npm install`, `npm run dev`, `npm test`, architecture, and added-dependency rationale in `README.md`.
- [X] T046 Run the end-to-end quickstart scenarios and verify test, strict typecheck, and production build scripts in `specs/001-offers-checkout-flow/quickstart.md` and `package.json`; resolve any failures before declaring completion.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: No dependencies; initialize the application and test tooling.
- **Phase 2 — Foundational**: Depends on setup and blocks all user stories.
- **Phase 3 — US1 (P1)**: Depends on the full foundation; delivers the primary checkout MVP.
- **Phase 4 — US2 (P2)**: Depends on US1's review and checkout path to add failure recovery.
- **Phase 5 — US3 (P3)**: Depends on the full flow (US1 and US2) to validate accessibility and
  responsive behavior across success and error states.
- **Phase 6 — Polish**: Depends on all three user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on another story; requires Phase 2.
- **US2 (P2)**: Extends the checkout path delivered by US1; depends on US1.
- **US3 (P3)**: Validates the complete success/failure journey; depends on US1 and US2.

### Within Each User Story

- Write story tests first and verify they fail before implementing that story.
- Keep services and query hooks ahead of the components that consume them.
- Integrate the flow after its query, selection, review, and checkout pieces exist.
- Complete each story checkpoint before starting the next dependent story.

### Parallel Opportunities

- After T001, T002 and T004 work in different files and can proceed independently.
- In Phase 2, T007 and T008 are separate fixture files; T010 and T011 are separate browser and
  Node MSW setups; T012 is a separate query-provider file.
- In US1, T014–T017 are separate test files/concerns and may be authored in parallel after the
  test harness exists. T018 and T020 are independent service/component files; T022 and T024 are
  independent service/component files.
- In US2, T033 and T034 are separate contract and behavior test concerns; T036 can be prepared
  independently of T035 before integration in T037.
- In US3, T040 follows T039's expected failure to preserve the test-first order; T040 and T041
  then touch separate component files and can proceed in parallel. CSS validation follows them.
- The three user stories are intentionally sequential because US2 needs US1's checkout flow and
  US3 validates both success and error paths.

## Parallel Example: User Story 1

After Phase 2 completes, these independent test tasks can be started together:

```text
T014 — API contract tests in src/tests/contracts/offers-checkout-api.test.ts
T015 — Offer selection behavior test in src/tests/offers-selection.test.tsx
T016 — Payment/review behavior test in src/tests/payment-review.test.tsx
T017 — Successful checkout behavior test in src/tests/checkout-success.test.tsx
```

After the shared types and API client are ready, separate offer and payment pieces can also be
split across contributors:

```text
T018 — Offer service in src/services/offers-service.ts
T020 — OfferCard in src/features/offers/components/OfferCard.tsx
T022 — Payment service in src/services/payment-service.ts
T024 — PaymentMethodCard in src/features/payment/components/PaymentMethodCard.tsx
```

## Parallel Example: User Story 2

After US1 is complete, author the HTTP contract and user-visible failure tests in parallel:

```text
T033 — Checkout HTTP 500 contract test in src/tests/contracts/offers-checkout-api.test.ts
T034 — Failure/retry behavior test in src/tests/checkout-failure.test.tsx
```

Once both tests fail as expected, `T035` (service error mapping) and `T036` (failure feedback
component) can proceed in parallel before their integration in `T037`.

## Parallel Example: User Story 3

First run `T039` and verify the accessibility behavior test fails. After that, the semantic
choice controls and shared status messaging use separate files and can proceed in parallel:

```text
T040 — Choice semantics in src/features/offers/components/OfferCard.tsx
       and src/features/payment/components/PaymentMethodCard.tsx
T041 — Status messaging in src/components/molecules/StatusMessage.tsx
       and the offer, payment, and checkout list components
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation; this blocks story work.
3. Complete Phase 3 (US1).
4. Stop and validate offer selection, payment selection, review, success, missing-selection
   gates, and the US1 test suite.
5. Deliver US2 and US3 in order after the MVP checkpoint.

### Incremental Delivery

1. Setup and foundation establish the runnable app, typed contracts, and mocks.
2. US1 delivers a complete successful checkout journey.
3. US2 adds controlled server failure and retry without regressing US1.
4. US3 completes accessibility and responsive validation across all implemented states.
5. Polish confirms README and quickstart instructions match the runnable project.

## Notes

- Task checkboxes are marked when their implementation and required validation are complete.
- `[P]` means separate files and no dependency on an incomplete task.
- Story labels map directly to the priorities and user journeys in `spec.md`.
- The Step 3 desktop design reference is missing; use the limitation recorded in `plan.md`.
