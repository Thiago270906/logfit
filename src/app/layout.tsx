import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estação Acad",
  description: "Sistema de gestão da academia Estação Acad",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
