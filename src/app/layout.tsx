import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Copa Enigma & Batata Doce – Campeonato Nacional Free Fire",
  description:
    "Inscreve a tua equipa no maior campeonato nacional de Free Fire de Moçambique! Copa Enigma & Batata Doce — Prémio de 5.000 MT, inscrição gratuita, 24 horas de competição.",
  keywords: [
    "Free Fire",
    "Copa Enigma",
    "Batata Doce",
    "Campeonato",
    "Moçambique",
    "Torneio",
    "Esports",
    "Gaming",
  ],
  openGraph: {
    title: "Copa Enigma & Batata Doce",
    description:
      "Campeonato Nacional de Free Fire – Moçambique. Prémio 5.000 MT. Inscrição Gratuita.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
