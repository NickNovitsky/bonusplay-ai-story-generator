import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit", "@resvg/resvg-js"],
  //reactStrictMode: false // Prevents "useEffect" to run twice, in particular
};

export default nextConfig;
