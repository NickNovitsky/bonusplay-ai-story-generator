import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Box, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "./theme";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "BonusPlay",
  description: "Imagine your own book from just one idea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SiteHeader />
            <Box mb={10}>
                {children}
            </Box>
            <SiteFooter />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
