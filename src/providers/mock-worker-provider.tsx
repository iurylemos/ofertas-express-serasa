"use client";

import { type JSX, useEffect, useState, type ReactNode } from "react";

type WorkerState = "starting" | "ready" | "error";

type MockWorkerProviderProps = Readonly<{
  children: ReactNode;
}>;

export function MockWorkerProvider({
  children,
}: MockWorkerProviderProps): JSX.Element {
  const [state, setState] = useState<WorkerState>(
    process.env.NODE_ENV === "development" ? "starting" : "ready",
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let active = true;
    import("@/mocks/browser")
      .then(({ startMockWorker }) => startMockWorker())
      .then(() => {
        if (active) setState("ready");
      })
      .catch((error: unknown) => {
        console.error("Could not start the mock API worker.", error);
        if (active) setState("error");
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  if (state === "error") {
    return (
      <main className="worker-gate" role="alert">
        <p>Não foi possível iniciar o ambiente de ofertas.</p>
        <button
          className="button button--primary"
          onClick={() => setAttempt((value) => value + 1)}
        >
          Tentar novamente
        </button>
      </main>
    );
  }

  if (state !== "ready") {
    return (
      <main className="worker-gate" role="status" aria-live="polite">
        Carregando ofertas…
      </main>
    );
  }

  return <>{children}</>;
}
