import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { theme } from "@entrenos/ui";
import "./globals.css";
export const metadata: Metadata = {
  title: "EntreNós · Administração",
  description: "Painel administrativo EntreNós",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  const tokens = Object.fromEntries(
    Object.entries(theme.colors).map(([key, value]) => [`--${key}`, value]),
  ) as CSSProperties;
  return (
    <html lang="pt-BR" style={tokens}>
      <body>{children}</body>
    </html>
  );
}
