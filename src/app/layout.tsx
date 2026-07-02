import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeminiWidget from "@/components/GeminiWidget";
import BackgroundLayer from "@/components/BackgroundLayer";
import { LenisProvider } from "@/lib/ScrollContext";
import { AuthProvider } from "@/lib/AuthContext";
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
      <body className="font-sans min-h-screen flex flex-col transition-colors duration-500 bg-background text-foreground" suppressHydrationWarning>
          <LenisProvider>
            <BranchProvider>
              <BackgroundLayer />
              <LanguageProvider>
                <AuthProvider>
              <ClientAppWrapper>
              <Navbar />
              <main className="flex-grow pt-20 relative">
                {children}
              </main>
              <Footer />
              <GeminiWidget />
            </ClientAppWrapper>
                </AuthProvider>
              </LanguageProvider>
            </BranchProvider>
          </LenisProvider>
      </body>
    </html>
  );
}
