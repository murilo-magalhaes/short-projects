import type {Metadata} from "next";

import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.min.css';
import 'primeicons/primeicons.css';

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import "./globals.css";
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
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}
