import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Career Automation | Admin Dashboard",
  description: "Premium Admin Dashboard for Smart Career Automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0F0F0F] text-white min-h-screen overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
