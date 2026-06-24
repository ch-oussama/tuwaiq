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
      className={`${tajawal.variable} antialiased`}
    >
      <body className="font-sans" style={{ background: '#D9CAB6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LenisProvider>
          <AuthProvider>
            <CustomCursor />
            <div 
              className="fixed inset-0 pointer-events-none z-0 opacity-[0.07]" 
              style={{ 
                backgroundImage: 'url(/image.png)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat'
              }} 
            />
            <AbstractScene />
            <Navbar />
            {/* Filmstrip camera scroll animation — fixed overlay */}
            <FilmstripCamera />
            <main className="flex-grow pt-20 relative z-10">
              {children}
            </main>
            <Footer />
            <GeminiWidget />
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
