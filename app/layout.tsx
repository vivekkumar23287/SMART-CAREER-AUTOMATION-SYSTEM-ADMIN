import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMART CAREER AUTOMATION SYSTEM | ADMIN",
  description: "Premium Admin Dashboard for Smart Career Automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.png" />
      </head>
      <body className={`${inter.className} bg-[#0F0F0F] text-white min-h-screen overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
