import type { Metadata } from "next";
import "./globals.css";

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.min.css';
import 'primeicons/primeicons.css';
import {ReactNode} from "react";

export const metadata: Metadata = {
  title: "Next Testes",
  description: "Área da diversão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
