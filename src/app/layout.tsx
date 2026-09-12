import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VELAIR — Above the Ordinary",
  description: "A private aviation concept exploring the quiet art of flight.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
