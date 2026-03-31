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
  metadataBase: new URL('https://sitecentumilia.vercel.app'),
  title: {
    default: "Centumilia | Marketing com Método",
    template: "%s | Centumilia"
  },
  description: "Transformamos marketing em um sistema previsível de aquisição, posicionamento e crescimento para empresas B2B e serviços.",
  keywords: ["marketing digital", "performance", "growth marketing", "b2b", "leads", "estratégia de vendas"],
  openGraph: {
    title: "Centumilia | Marketing com Método",
    description: "Crescimento com direção. Pare de depender do improviso na sua empresa.",
    url: "https://sitecentumilia.vercel.app",
    siteName: "Centumilia",
    images: [
      {
        url: "/og-image.png", // Imagem padrão de compartilhamento
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
