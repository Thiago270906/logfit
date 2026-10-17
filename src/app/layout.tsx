import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estação do Corpo - Academia",
  description: "Sistema de gestão da Estação do Corpo Academia",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
