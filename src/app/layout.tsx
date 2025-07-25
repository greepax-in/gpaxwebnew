'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@mui/material";
import MobileMenu from "@/components/Common/MobileMenu";
import Footer from "@/components/Common/Footer/page"; // ✅ Import Footer

const AppBar = dynamic(() => import('@/components/AppBar/DeskMenu'), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDesktop = useMediaQuery('(min-width:600px)');

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2e7d32" />
        <link rel="icon" href="/images/greenpax-logo.svg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {isDesktop && <AppBar />}
        {children}
        <Footer />       {/* ✅ Always show footer */}
        <MobileMenu />
      </body>
    </html>
  );
}
