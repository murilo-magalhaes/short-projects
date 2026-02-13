'use client'

import type {Metadata} from "next";

import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.min.css';
import 'primeicons/primeicons.css';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "./globals.css";
import {ReactNode} from "react";
import {redirect} from "next/navigation";

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
        <header className={'p-2 w-full'}>
            <i className={'pi pi-home cursor-pointer'} style={{fontSize: '2rem'}} onClick={() => redirect('/')}></i>
        </header>
        <div className={'flex h-full'}>
            {children}
        </div>
        </body>
        </html>
    );
}
