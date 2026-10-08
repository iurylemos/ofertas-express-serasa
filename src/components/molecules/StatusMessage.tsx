import type { ReactNode } from "react";

interface StatusMessageProps {
  variant: "loading" | "error" | "info";
  children: ReactNode;
  className?: string;
}

export function StatusMessage({ variant, children, className }: StatusMessageProps) {
  const messageClass = [
    "state-message",
    variant === "error" ? "state-message--error" : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={messageClass}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      {children}
    </div>
  );
}
