"use client";
import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { SessionProvider } from "@/utils/providers/sessionProvider";
import { Toaster } from "react-hot-toast";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

const metadata: Metadata = {
  title: "emoHub",
  description: "EmoHub - Your Emotional Hub for Emotional Wellness",
  keywords: "emotional support, wellness, community, self-care",
};



import { Josefin_Sans, Jost } from 'next/font/google'
import { I18nProvider } from "@/components/i18Provider";

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-josefin-sans',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-jost',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
    })
  })
  return (
    <html lang="en" suppressHydrationWarning className={`${josefinSans.variable} ${jost.variable}`}>
      <body>
        <SessionProvider>
          <ReactQueryProvider>
            <Toaster />
            <I18nProvider>
              {children}
            </I18nProvider>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}