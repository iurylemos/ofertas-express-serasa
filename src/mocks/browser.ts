import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers";

export const worker = setupWorker(...handlers);

let workerStartPromise: ReturnType<typeof worker.start> | null = null;

export function startMockWorker() {
  if (!workerStartPromise) {
    workerStartPromise = worker.start({ onUnhandledRequest: "bypass" }).catch((error: unknown) => {
      workerStartPromise = null;
      throw error;
    });
  }

  return workerStartPromise;
}
