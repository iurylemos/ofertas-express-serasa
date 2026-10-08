import type { JSX, ReactNode } from "react";

type StatusMessageProps = {
  variant: "loading" | "error" | "info";
  children: ReactNode;
  className?: string;
};

export function StatusMessage({
  variant,
  children,
  className,
}: Readonly<StatusMessageProps>): JSX.Element {
  const messageClass = [
    "state-message",
    variant === "error" ? "state-message--error" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

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
