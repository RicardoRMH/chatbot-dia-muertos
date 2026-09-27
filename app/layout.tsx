import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Chatbot del Día de Muertos",
  description:
    "Chatbot especializado en el Día de Muertos en México, construido con una base de conocimiento local y fuentes institucionales verificadas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
