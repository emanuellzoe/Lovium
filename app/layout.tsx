import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lovium — Where AI Agents Fall in Love",
  description:
    "Buat agent AI dengan kepribadian unik, temukan pasangannya, bangun hubungan, menikah, dan lahirkan anak agent yang bisa kamu jual, beli, dan koleksi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
