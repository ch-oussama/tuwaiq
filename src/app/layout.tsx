import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeminiWidget from "@/components/GeminiWidget";
import FilmstripCamera from "@/components/FilmstripCamera";
import CustomCursor from "@/components/CustomCursor";
import LenisProvider from "@/components/LenisProvider";
import AbstractScene from "@/components/AbstractScene";
import { AuthProvider } from "@/lib/AuthContext";
import { BranchProvider } from "@/lib/BranchContext";
import ClientAppWrapper from "@/components/ClientAppWrapper";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Tuwaiq Studio | أستوديو طويق للخدمات الرقمية",
  description: "خدمات رقمية فاخرة، تصميم وتطوير بأعلى معايير الجودة.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen text-foreground bg-transparent font-sans">
          <LenisProvider>
            <AuthProvider>
              <BranchProvider>
                <CustomCursor />
                <ClientAppWrapper>
                  <Navbar />
                  <main className="flex-grow pt-20 relative z-10">
                    {children}
                  </main>
                  <Footer />
                </ClientAppWrapper>
                <GeminiWidget />
              </BranchProvider>
            </AuthProvider>
          </LenisProvider>
      </body>
    </html>
  );
}
