import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import VHSetter from "./VHSetter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "khlasify",
  description: "Content Preview Widget",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        <VHSetter />
        {children}
        <Toaster
          position="top-center"
          richColors // 🔥 Tambahkan ini agar warna success (hijau) & error (merah) otomatis aktif
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              background: "#ffffff", // Putih bersih menyatu dengan tema web
              color: "#1e293b", // Warna teks abu-abu gelap (slate-800)
              border: "1px solid #e2e8f0", // Border abu-abu sangat tipis
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)", // Bayangan (shadow) lembut
            },
          }}
        />
      </body>
    </html>
  );
}
