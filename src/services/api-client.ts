import { ApiError } from "@/interfaces/api-error";

type DataParser<T> = (value: unknown) => T;

function apiUrl(path: string): string {
  const baseUrl = typeof window === "undefined" ? "http://localhost:3000" : window.location.origin;
  return new URL(path, baseUrl).toString();
}

function readEnvelope<T>(payload: unknown, parseData: DataParser<T>): T {
  if (typeof payload !== "object" || payload === null || !("data" in payload)) {
    throw new TypeError("Invalid API response envelope.");
  }

  return parseData(payload.data);
}

export async function requestData<T>(
  path: string,
  parseData: DataParser<T>,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(apiUrl(path), init);
  if (!response.ok) {
    throw new ApiError(response.status);
  }

  const payload: unknown = await response.json();
  return readEnvelope(payload, parseData);
}
