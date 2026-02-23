import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peja Admin",
  description: "Admin and manifest backend for Zambia Past Papers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased`}>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#0f766e",
              colorText: "#1a1f24",
              colorBackground: "#ffffff",
              borderRadius: "0.9rem",
              fontFamily: "var(--font-dm-sans), sans-serif",
            },
            elements: {
              card: "shadow-none border border-[#d8e0e8]",
              footerActionLink: "text-[#0f766e] hover:text-[#0c514b]",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
