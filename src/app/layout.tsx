import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";   
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WalletReconnect from "@/components/WalletReconnect";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aeloria: Guardians of the Eternal Sigils",
  description: "A Web3 Text-Based Fantasy RPG on Ronin Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletReconnect />
        <div className="flex min-h-screen bg-black text-white">
          <Sidebar />
          <div className="flex flex-col flex-1 min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}