import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/components/modal-provider";
import { ToastProvider } from "@/components/toaster-provider";
import CrispProvider from "@/components/crisp-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Genius AI",
    description: "Genius AI for your tasks"
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <CrispProvider />
                <body className={inter.className}>
                    <ToastProvider />
                    <ModalProvider />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
