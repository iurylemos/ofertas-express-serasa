# Implementation Plan: Offers Checkout Flow

**Branch**: `001-offers-checkout-flow` | **Date**: 2026-10-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification and user-provided "Plan — Offers Checkout Flow" attachment.

## Summary

Implement the three-stage offers and checkout experience in the feature specification:
select an offer, select an available payment method, and review and confirm checkout.
The plan follows the supplied Next.js App Router, React, strict TypeScript, TanStack Query,
MSW, and Testing Library stack. It also follows the supplied visual references where they map
to the flow, preserving the presented hierarchy and responsive structure rather than targeting
pixel-perfect reproduction.

The repository currently contains only a minimal `package.json` and design assets. It has no
application source, installed feature dependencies, lockfile, or functioning test command.
Implementation therefore begins by bootstrapping the application and its validation setup.
There is no real backend in scope: the service contracts in this plan are implemented by MSW
for development and tests.

## Technical Context

**Language/Version**: TypeScript in strict mode; exact compiler version is not yet pinned.

**Primary Dependencies**: Next.js App Router, React, TanStack React Query, and MSW.
Use Testing Library with `user-event` for user interactions and Vitest with jsdom as the test
runner. Keep versions compatible with the selected Next.js release and record them in the
package lockfile.

**Storage**: No database or persistent customer state. Offers, payment methods, and checkout
results are served by the mock API. Current selections are transient UI state.

**Testing**: Vitest, Testing Library, `user-event`, and MSW's Node integration for behavioral
tests. Use the browser MSW worker for mocked development requests.

**Target Platform**: Responsive web browsers on mobile, tablet, and desktop; keyboard and
assistive-technology use are in scope.

**Project Type**: Single Next.js web application. No authentication service, user accounts,
custom backend, or custom server.

**Performance Goals**: No numeric latency target was supplied. Keep the application usable
through query loading and failure states and prevent duplicate checkout submissions.

**Constraints**: Required selections gate progression; React Query owns server state; local
React state is limited to transient selections and step/UI state. Use MSW rather than a live
external API during development and tests. Do not add a global state library.

**Scale/Scope**: One customer persona, one checkout flow, three selection/review steps, and
success or failure outcomes. The offer and payment-method counts are determined by mock data.

**Repository Baseline**: `package.json` has no application dependencies, only a placeholder
`test` script, and declares CommonJS. No `src/`, `README`, package lockfile, or application
test suite exists yet. The implementation must replace the placeholder scripts, configure the
App Router and strict TypeScript, and document the added libraries.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitutional requirement | Plan decision | Gate |
|---|---|---|
| Next.js, React, strict TypeScript | Bootstrap a single App Router application and enable strict TypeScript. | PASS |
| TanStack React Query owns server state | Use queries for offers and payment methods and a mutation for checkout. | PASS |
| Clear service, domain, and UI boundaries | Keep request logic in services, checkout rules in feature logic, and rendering in components. | PASS |
| No direct API calls or complex rules in UI components | Components receive typed values and callbacks; services own HTTP requests. | PASS |
| MSW for development and testing | Reuse mock handlers in the browser and Node test environment. | PASS |
| Behavioral tests with Testing Library and MSW | Cover offer choice, payment and review, and checkout failure/retry. | PASS |
| Accessibility and responsive behavior | Include keyboard, accessible-name, status, contrast, zoom, viewport, and visual checks. | PASS |
| Avoid unjustified dependencies and global state | Vitest is selected as the missing test runner; no global state package is planned. | PASS |
| README and quality gates | Add setup/run/test guidance; verify build, strict typecheck, and targeted tests. | PASS |

No constitutional violations are planned. Vitest and jsdom are additional dependencies justified
by the required behavioral test suite; their role and commands must be documented in the README.
Atomic Design is an organizational aid only and must not create abstraction layers without
concrete reuse or responsibility benefits.

## Design Decisions

1. **One checkout route with a three-step flow.** Keep the page shell in the App Router and
   represent the active step and selected IDs as transient client state. Do not create separate
   routes unless implementation uncovers a concrete navigation requirement.
2. **Client-owned query lifecycle for this flow.** Use a narrow client provider for React Query
   and fetch offers, payment methods, and checkout through the typed service layer. Do not also
   render a second server-fetched copy of those values; this avoids divergent server/client
   sources of truth.
3. **Development and tests use the same API boundary.** Browser MSW handles development
   requests; the Node MSW server handles tests. The browser worker must be ready before checkout
   queries run.
4. **Payment methods are scoped to the selected offer.** Pass the offer ID when requesting
   methods. If the offer changes, clear the selected method if it is no longer available.
5. **Money uses integer minor units.** Mock amounts use integer centavos and an explicit BRL
   currency; presentation formats values for the customer.
6. **No backend or authentication is added.** The endpoint contracts document the mock
   boundary only; substituting a real payment service is outside this feature.
7. **Reference coverage is explicit.** The supplied plan names `01-mobile`, `01-desktop`,
   `02-mobile`, `02-desktop`, and `03-mobile`; those files exist. It also names
   `assets/03-desktop.png`, which is absent. Validate desktop Step 3 responsively using the
   available desktop references until the missing image is supplied. `assets/04-mobile.png`
   exists but is not mapped to a flow step in the supplied plan, so it is not assigned new
   behavior here.
8. **Terms acceptance is not a new checkout gate.** The Step 3 artwork depicts agreement
   terms and an acceptance checkbox, but the feature specification only requires review of
   the offer and payment method. Do not block checkout on terms acceptance unless that
   behavior is added to the specification; retain the overall review hierarchy as a visual
   guide.

## Project Structure

### Documentation (this feature)

```text
specs/001-offers-checkout-flow/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── offers-checkout-api.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── features/
│   ├── offers/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── payment/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── checkout/
│       ├── components/
│       ├── hooks/
│       └── types/
├── hooks/
├── interfaces/
├── services/
├── mocks/
│   ├── handlers.ts
│   ├── browser.ts
│   ├── server.ts
│   └── fixtures/
├── providers/
├── tests/
└── utils/
public/
└── mockServiceWorker.js
```

**Structure Decision**: Use one Next.js project with feature-local components, hooks, and
types, shared services and interfaces, and a small shared component hierarchy. Place the
React Query provider in a client boundary under the App Router layout. Keep domain-specific
behavior out of `app/` and visual components. Create Atomic Design folders only for components
whose role is clear; empty or speculative abstraction directories need not be added.

## Implementation Roadmap

The task identifiers below preserve the work breakdown in the user-provided plan. `/speckit-tasks`
can later expand them into dependency-ordered implementation tasks; this plan does not create
`tasks.md`.

### Foundation

- Bootstrap Next.js App Router, React, strict TypeScript, npm scripts, and test setup.
- Define the shared data contracts and service boundaries.
- Add MSW fixtures, browser and Node setup, and the React Query provider before connecting UI.

### Step 1 — Offer Selection

1. **T001 — Create the offers screen structure.** Match the mobile and desktop information
   hierarchy in the available Step 1 references.
2. **T002 — Create `OfferCard`.** Show enough offer details to distinguish choices.
3. **T003 — Create `OfferList`.** Render the offer collection and selection affordances.
4. **T004 — Integrate the offers query.** Load offers through the service and React Query.
5. **T005 — Implement offer selection.** Keep one selected offer and expose the selected state.
6. **T006 — Implement loading, empty, and error states.** Do not allow progress without offers.
7. **T007 — Validate Step 1 responsiveness.** Compare spacing, widths, hierarchy, positioning,
   mobile behavior, and desktop behavior with `01-mobile.png` and `01-desktop.png`.

### Step 2 — Payment Selection

8. **T008 — Create the payment screen structure.** Show available methods after an offer is
   selected.
9. **T009 — Create `PaymentMethodCard`.** Make available, selected, and applicable unavailable
   states distinguishable.
10. **T010 — Create `PaymentMethodList`.** Render the methods available for the current offer.
11. **T011 — Integrate the payment-method query.** Scope the request to the selected offer where
    availability depends on it.
12. **T012 — Implement payment selection.** Allow one selected method at a time.
13. **T013 — Gate navigation to review.** Keep the next action unavailable until required
    selections are complete.
14. **T014 — Validate Step 2 responsiveness.** Compare with `02-mobile.png` and
    `02-desktop.png`.

### Step 3 — Review and Checkout

15. **T015 — Create the review screen.** Show at least the selected offer and payment method.
16. **T016 — Create `ReviewSummary`.** Present the selected information consistently.
17. **T017 — Create `CheckoutButton`.** Represent enabled, disabled, loading, and failure/retry
    states accessibly.
18. **T018 — Implement the checkout mutation.** Submit the selected offer and payment method
    through the service.
19. **T019 — Implement checkout loading.** Announce progress and prevent duplicate submission.
20. **T020 — Implement server-error handling.** Simulate a 500 response, retain app usability,
    and show a user-friendly message.
21. **T021 — Preserve selections after error.** Retain the still-valid offer and method.
22. **T022 — Implement success state.** Present an unambiguous completion result.
23. **T023 — Validate Step 3 responsiveness.** Compare with `03-mobile.png`; use the available
    desktop references for layout validation because `03-desktop.png` is not present.

### Test, Accessibility, and Responsive Validation

24. **T024 — Test offer selection.** Verify offers render, one can be selected, and its state
    is visibly and accessibly identified.
25. **T025 — Test payment selection and review.** Verify methods render, a method can be
    selected, and review shows the correct choices.
26. **T026 — Test checkout failure and retry.** Use MSW to return a server error; verify safe
    messaging, preserved selections, and retry.
27. **T027 — Validate accessibility.** Check semantic controls, labels/names, keyboard
    operation, visible focus, selected-state semantics, accessible loading/error feedback, and
    WCAG AA contrast.
28. **T028 — Validate mobile behavior.** Check comfortable content, actionable controls, text
    wrapping, spacing, and no horizontal overflow at the supplied mobile widths.
29. **T029 — Validate desktop behavior.** Check proportional use of space, alignment, and
    readable content width against the available desktop references.

Finish by checking the full step sequence and failure states, running build/typecheck/tests,
and updating the README with prerequisites, setup, development, test commands, dependency
justifications, and material assumptions.

## Complexity Tracking

No constitutional violations or additional architectural layers are planned.

## Post-Design Constitution Check

| Design check | Result |
|---|---|
| App Router shell and React Query have a single owner for offer/payment server data. | PASS |
| Checkout selection remains transient UI state and does not duplicate server records. | PASS |
| Services, feature rules, and presentation remain separated. | PASS |
| MSW covers development and Node behavioral tests with success and failure handlers. | PASS |
| Testing Library verifies the three required customer scenarios. | PASS |
| Accessibility, responsive behavior, and WCAG AA remain explicit validation gates. | PASS |
| The only added test tooling is justified by missing project test infrastructure. | PASS |

The missing Step 3 desktop reference and the unreferenced `04-mobile.png` are documented
validation inputs, not architecture or constitutional violations. The agreement checkbox shown
in the reference is intentionally not treated as a required checkout condition because the
feature specification does not define that behavior.
