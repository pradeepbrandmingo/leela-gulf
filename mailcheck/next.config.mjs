/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The verification engine opens raw TCP sockets (net.Socket) to talk SMTP.
  // That is NOT possible on the Edge runtime, so every route that touches
  // lib/email/smtp-verifier.ts explicitly sets `export const runtime = "nodejs"`.
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

export default nextConfig;
