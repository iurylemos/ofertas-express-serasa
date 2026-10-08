import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MockWorkerProvider } from "@/providers/mock-worker-provider";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minhas dívidas | Ofertas Express",
  description: "Escolha uma oferta e conclua seu acordo com segurança.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <MockWorkerProvider>{children}</MockWorkerProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
