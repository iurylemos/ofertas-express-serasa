# Quickstart: Offers Checkout Flow

This guide defines how to validate the feature after the application bootstrap and
implementation are complete. The current repository is a starter manifest with no app
dependencies or working development/test scripts yet; the commands below become runnable as
the implementation configures them.

## Prerequisites

- Node.js version supported by the selected Next.js release.
- npm.
- Repository checkout containing the feature implementation.

## Install and Start Development

```bash
npm install
npm run dev
```

Expected result: the development application opens and MSW supplies the offers, payment
methods, and checkout responses. The initial view shows available offers; no real backend,
account, or authentication service is required.

## Validate the Primary Flow

1. Open the application at a mobile, tablet, or desktop viewport.
2. Confirm that multiple offers and their distinguishing values are displayed.
3. Select one offer; confirm it is visibly selected and payment methods become available.
4. Select one payment method and continue to review.
5. Confirm that the review shows the selected offer and method.
6. Confirm checkout and verify a pending state followed by a successful completion state.

Expected result: the customer cannot advance without required selections, and the final
result reflects a single confirmed checkout.

## Validate Checkout Failure and Retry

```bash
npm test
```

Expected behavioral test:

1. Select an offer and payment method, then reach review.
2. Configure the MSW checkout handler to return HTTP 500.
3. Confirm checkout.
4. Verify an accessible, non-technical error message, no application crash, preserved
   selections, and an available retry.
5. Verify a second submission is blocked while the first request is still pending.

Restore the success handler for the successful checkout test. Tests must use MSW and
Testing Library and must not contact a real external service.

## Required Test Scenarios

- Offer list display and selection state.
- Payment-method selection and review summary.
- Checkout HTTP 500 handling, selection preservation, and retry.
- Loading and duplicate-submission prevention.
- Keyboard selection, accessible names, and visible focus for primary controls.

## Type and Build Validation

The implementation should configure the following scripts as part of project bootstrap:

```bash
npm run typecheck
npm run build
```

Expected result: strict TypeScript passes without explicit or implicit `any`, and the
production build completes. Test and build commands must be documented in the repository
README.

## Responsive and Visual Validation

Compare the first two steps with `assets/01-mobile.png`, `assets/01-desktop.png`,
`assets/02-mobile.png`, and `assets/02-desktop.png`. Compare Step 3 with
`assets/03-mobile.png`; `assets/03-desktop.png` is referenced by the supplied plan but is not
present, so validate its desktop layout using the available desktop references until that
asset is supplied.

At mobile, tablet, and desktop widths, verify:

- no horizontal overflow or overlapping content;
- readable offer and payment details;
- comfortable, operable controls;
- keyboard access, visible focus, and accessible loading/error status;
- usable content at 200% text enlargement.

The unreferenced `assets/04-mobile.png` is not assigned to an additional checkout step by this
feature plan.
