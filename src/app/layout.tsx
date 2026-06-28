import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeminiWidget from "@/components/GeminiWidget";
import ScrollProgress from "@/components/ScrollProgress";

import { AuthProvider } from "@/lib/AuthContext";
import { LenisProvider } from "@/lib/ScrollContext";
import { BranchProvider } from "@/lib/BranchContext";
import { LanguageProvider } from "@/lib/LanguageContext";
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
    icon: [
      { url: "/logo design.webp", type: "image/webp" },
    ],
    apple: "/logo design.webp",
    shortcut: "/logo design.webp",
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
        <ScrollProgress />
        <LanguageProvider>
          <AuthProvider>
            <BranchProvider>
              <ClientAppWrapper>
                <LenisProvider>
                  <Navbar />
                  <main className="flex-grow pt-20 relative z-10">
                    {children}
                  </main>
                  <Footer />
                </LenisProvider>
              </ClientAppWrapper>
              <GeminiWidget />
            </BranchProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
