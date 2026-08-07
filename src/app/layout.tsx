import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundLayer from "@/components/BackgroundLayer";
import { LenisProvider } from "@/lib/ScrollContext";
import { AuthProvider } from "@/lib/AuthContext";
import { BranchProvider } from "@/lib/BranchContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import ClientAppWrapper from "@/components/ClientAppWrapper";
import "./globals.css";

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
      className="font-tajawal antialiased dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
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
            </ClientAppWrapper>
                </AuthProvider>
              </LanguageProvider>
            </BranchProvider>
          </LenisProvider>
      </body>
    </html>
  );
}
