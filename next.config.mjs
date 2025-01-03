/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['api.slingacademy.com'], },
  eslint: {
      ignoreDuringBuilds: false,
    },
};

export default nextConfig;
