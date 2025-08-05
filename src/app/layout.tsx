import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Container, Link, Typography } from "@mui/material";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "BonusPlay",
  description: "Imagine your own book from just one idea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Container sx={{p: 6}}><Typography sx={{textAlign: "center"}}><Link href="/">BonusPlay</Link></Typography></Container>
        {children}
      </body>
    </html>
  );
}
