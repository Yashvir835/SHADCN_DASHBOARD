/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'api.slingacademy.com', 
      'images.unsplash.com', 
      'assets.aceternity.com' // Added the required domain
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack(config, { isServer }) {
    // Adding support for .mp3 files
    config.module.rules.push({
      test: /\.mp3$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/audio/',
            outputPath: 'static/audio/',
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
