# Research: Offers Checkout Flow

**Date**: 2026-10-07  
**Scope**: Resolve implementation choices for the stack required by the constitution and the
user-provided plan. No application source or dependencies exist yet.

## Decision 1: Keep the App Router shell server-rendered and isolate interactive checkout

**Decision**: Use Next.js App Router for the page shell and layout. Keep the interactive
checkout flow and React Query provider in a narrow client boundary. Fetch offers and payment
methods through React Query on the client for this flow; do not duplicate the same server data
in Server Components.

**Rationale**: The flow needs client-side selection, loading/error feedback, query caching, and a
checkout mutation. A client-owned query lifecycle makes one source of truth straightforward and
avoids server-rendered data becoming stale independently of the client query cache.

**Alternatives considered**:

- Fetch all data in Server Components: simpler for static/server-owned data, but does not
  provide the required client query lifecycle for this interactive flow.
- Server prefetch plus TanStack dehydration/hydration: valid if server prefetch becomes
  necessary, but adds coordination that is not needed for this mocked client flow.
- Share fetched query data between server and client without hydration ownership: rejected
  because client refetches would not update the server-rendered copy.

**References**:

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: Layout convention](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
- [TanStack Query: Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

## Decision 2: Use one stable browser Query Client and isolated clients in tests

**Decision**: Create the browser `QueryClient` within the client provider and keep it stable
for the application lifetime. Create a fresh client for each test and disable retries in tests
that verify query or mutation failures.

**Rationale**: Stable browser cache ownership avoids resetting server state during rerenders;
test isolation prevents cached data and automatic retries from leaking between cases.

**Alternatives considered**:

- A shared module-level Query Client for server and browser rendering: rejected because a
  server singleton could share cached data across requests.
- A new browser client on every provider render: rejected because it discards query cache.

**References**:

- [TanStack Query: Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)
- [TanStack Query: Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)

## Decision 3: Intercept requests with MSW at the network boundary

**Decision**: Define reusable handlers and fixtures. Use `setupWorker` in the browser during
mocked development and `setupServer` in Node tests. Wait for the browser worker to start before
issuing feature queries.

**Rationale**: Intercepting requests at the network boundary exercises the same service,
serialization, and error-handling path in development and tests without replacing `fetch` or
testing implementation internals.

**Alternatives considered**:

- Mock the service functions directly: rejected for checkout behavior tests because that
  bypasses request and response handling.
- Use only browser mocks: rejected because Node tests need their own MSW integration.
- Add a real backend: out of scope; the project requires mocked API behavior.

**References**:

- [MSW README](https://github.com/mswjs/msw#readme)
- [MSW: Browser integration](https://mswjs.io/docs/integrations/browser)
- [MSW: Node integration](https://mswjs.io/docs/integrations/node)

## Decision 4: Test user-visible behavior with Testing Library and Vitest

**Decision**: Use Vitest with jsdom, Testing Library, `user-event`, and accessible DOM queries.
Keep the tested interactive flow in client components; test loading, selection, review,
success, failure, and retry as a user would.

**Rationale**: The repository has no test runner. Vitest provides a focused test runner for the
required component behavior; `user-event` models user interaction, and MSW lets tests assert
the visible result of real request flows. This adds only the infrastructure needed to satisfy
the behavioral testing requirement.

**Alternatives considered**:

- Jest: also viable, but the project has no existing Jest setup to preserve.
- Directly invoke component handlers or inspect internal state: rejected because tests must
  focus on user-observable behavior.
- Test asynchronous Server Components with Vitest: not selected; current Next.js testing
  guidance notes that async Server Components are not supported by current unit-test setup.
  Keep the interactive behavior in client components and use browser-level checks if server
  component behavior later needs direct verification.

**References**:

- [Testing Library: Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Testing Library: user-event](https://testing-library.com/docs/user-event/intro/)
- [Next.js: Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
- [TanStack Query: Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)

## Decision 5: Pin compatible dependency versions during application bootstrap

**Decision**: Use the current stable release line of Next.js and compatible React, TypeScript,
TanStack Query, MSW, Vitest, and Testing Library packages when initializing the application.
Commit the resulting package lockfile. Match MSW handler APIs and test setup to the installed
MSW major version.

**Rationale**: The current repository has no dependency manifest entries or lockfile from
which exact versions can be preserved. Choosing compatible versions together avoids mixing
examples from different major releases.

**Alternatives considered**:

- Guess exact package versions in this design: rejected because there is no existing version
  baseline and the implementation/bootstrap step should resolve current compatibility.
- Add a dependency not required by the feature: rejected by the constitution's dependency
  policy.

**Version caveats**:

- The research source set identified current Next.js documentation as version 16.4.0; verify
  actual package requirements at bootstrap rather than assuming that version is installed.
- TanStack Query documents pending-query dehydration for streaming from v5.40.0; this plan
  does not depend on that behavior.
- Current MSW examples use `http`/`HttpResponse` and `msw/browser` / `msw/node`; match the
  installed major version.
- Current Testing Library `user-event` guidance is for v14 and uses `userEvent.setup()` per
  test.
