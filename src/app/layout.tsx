import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";
import { Inter } from "next/font/google";
import { MockWorkerProvider } from "@/providers/mock-worker-provider";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Minhas dívidas | Ofertas Express",
  description: "Escolha uma oferta e conclua seu acordo com segurança.",
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <QueryProvider>
          <MockWorkerProvider>{children}</MockWorkerProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
