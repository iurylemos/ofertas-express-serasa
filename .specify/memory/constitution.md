<!--
Sync Impact Report
Version change: Unfilled template -> 1.0.0
Modified principles:
- Principle slot 1 -> I. Maintainable, Type-Safe Design
- Principle slot 2 -> II. Clear Separation of Responsibilities
- Principle slot 3 -> III. Predictable State and Checkout Flow
- Principle slot 4 -> IV. Behavioral Testing and Reliable Mocking
- Principle slot 5 -> V. Accessible, Responsive User Experience
Added sections: Technology and Architecture; Delivery and Quality Gates (template sections populated)
Removed sections: None
Follow-up TODO: Confirm the original ratification date.
-->
# Offers & Checkout Constitution

## Core Principles

### I. Maintainable, Type-Safe Design
The application MUST use strict TypeScript. Explicit `any` and implicit `any` MUST NOT be
introduced. API responses and component props MUST have explicit types; named interfaces or
types MUST define component contracts and shared contracts MUST have a single appropriate
definition. Functional components MUST be used. Each component MUST have one clear
responsibility, and business rules MUST live in hooks, services, utilities, or domain functions,
not in UI components. Prefer type-safe utilities and avoid unnecessary type assertions.
These rules make changes predictable and catch contract errors early.

### II. Clear Separation of Responsibilities
The application MUST preserve clear boundaries between API communication, server-state
queries and mutations, business rules, UI rendering, and user interaction. Services MUST own
API requests, response handling, and any translation into application contracts. Components
MUST render typed data and states and trigger interactions; they MUST NOT make direct API
calls or contain complex business rules. Components MUST NOT manipulate server-state caches
except through a dedicated abstraction. This separation keeps behavior testable and prevents
UI and transport details from becoming coupled.

### III. Predictable State and Checkout Flow
Next.js and React MUST provide the application framework. TanStack React Query MUST be the
source of truth for server state, including offers, payment methods, checkout mutations,
loading and error states, and cache management. Local React state MUST be limited to transient
UI state, such as selected offer or payment method and modal visibility; server state MUST NOT
be duplicated in local or global state. Global state libraries MUST NOT be added without a
demonstrated requirement that React and React Query cannot reasonably meet.

The flow MUST be offers, offer selection, payment-method selection, review, checkout, and a
success or error result. The user MUST NOT proceed without required selections. The UI MUST
make selections, remaining steps, action availability, loading, success, and failure clear.
API failures, including server errors such as HTTP 500, MUST produce a controlled state and a
user-friendly message without exposing technical details. Checkout MUST prevent duplicate
submissions while processing, allow retry when appropriate, and preserve selections when possible.

### IV. Behavioral Testing and Reliable Mocking
MSW MUST mock API behavior in development and tests. Handlers MUST cover successful offers
and payment-method requests, successful checkout, and failed checkout. Tests MUST NOT depend
on a real external API. The project MUST include at least three behavioral tests using
Testing Library and MSW, covering offer display and selection, payment selection and review,
and checkout failure handling. Tests MUST exercise user-visible behavior rather than
implementation details. These checks protect the critical flow and its failure states.

### V. Accessible, Responsive User Experience
Semantic HTML MUST be preferred. Interactive controls MUST have accessible names, forms MUST
have appropriate labels, informative images MUST have meaningful alternative text, and
keyboard operation and visible focus MUST be preserved. Loading and error feedback MUST be
accessible. Color contrast MUST meet WCAG AA, and important information MUST NOT be conveyed
by color alone.

The application MUST work on mobile, tablet, and desktop without horizontal overflow,
unusable controls, compressed content, or a broken checkout flow. Implementations SHOULD be
mobile-first where practical and use desktop space proportionally. Visual references MUST
guide hierarchy, information architecture, primary flow, and relative importance, not require
pixel-perfect reproduction. Clarity and usability take precedence over decorative complexity.

## Technology and Architecture

The required stack is Next.js, React, TypeScript, TanStack React Query, MSW, and Testing
Library. Additional dependencies MUST solve a concrete project requirement, and each added
library MUST be documented in the README. Before adding a dependency, developers MUST
consider native browser APIs, React, Next.js, and existing dependencies.

Project structure MUST make responsibilities understandable. A structure such as
`src/components/`, `src/features/` (offers, payment, and checkout), `src/hooks/`,
`src/services/`, `src/interfaces/` or `src/types/`, `src/mocks/`, `src/tests/`, and `src/utils/`
is recommended. The exact structure MAY differ when justified, but architectural boundaries
MUST remain clear.

## Delivery and Quality Gates

The README MUST concisely describe the project, prerequisites, installation, development and
test commands, architectural decisions, and material trade-offs or assumptions. It MUST
document commands equivalent to `npm install`, `npm run dev`, and `npm test`. The final
submission MUST provide the repository URL and instructions to install dependencies, run the
application, and run tests. Generated files, secrets, and environment-specific configuration
MUST NOT be committed unnecessarily.

A change is complete only when the application runs and users can retrieve and select offers
and payment methods, review their selections, submit checkout, and receive controlled success
or failure feedback. Loading states, retry behavior, and protection against duplicate
submissions MUST work. The interface MUST satisfy the accessibility and responsive
requirements in this constitution. MSW coverage, at least three passing behavioral tests,
strict TypeScript without `any`, and required README instructions MUST be verified.

## Governance

This constitution governs implementation and review decisions for Offers & Checkout.
Amendments MUST update this document and its version and last-amended date. A proposed
amendment MUST describe its motivation and impact; backward-incompatible principle removals
or redefinitions require a MAJOR version increment, new principles or materially expanded
requirements require a MINOR increment, and clarifications or non-semantic refinements require
a PATCH increment. Reviewers MUST check changes against applicable principles, required
quality gates, and documented dependency justifications. Exceptions MUST be explicit,
justified, and reviewed rather than silently weakening a requirement. The original ratification
date must be confirmed and recorded when known.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-10-07
