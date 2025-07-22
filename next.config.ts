import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  //reactStrictMode: false // Prevents "useEffect" to run twice, in particular
};

export default nextConfig;
