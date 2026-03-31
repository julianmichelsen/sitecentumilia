import type { Metadata } from "next";
// Substituindo New Order por Syne e Aktiv Grotesk por Inter
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "Centumilia | Agência de Marketing por Performance",
  description: "A Centumilia transforma marketing em um sistema de aquisição, posicionamento e crescimento para empresas que não querem mais depender do improviso.",
  keywords: ["marketing digital", "performance", "growth marketing", "b2b", "leads"],
  openGraph: {
    title: "Centumilia | Marketing com Método",
    description: "Crescimento com direção. Pare de depender do improviso na sua empresa.",
    type: "website",
    locale: "pt_BR",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${syne.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col selection:bg-brand-neon selection:text-brand-dark">
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
