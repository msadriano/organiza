import AppClienteProviders from "./providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Organiza",
  description: "Gerenciador de lista de tarefas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="antialiased flex justify-center items-center min-h-screen">
        <AppClienteProviders>{children}</AppClienteProviders>
      </body>
    </html>
  );
}
