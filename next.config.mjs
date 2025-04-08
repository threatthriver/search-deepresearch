/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        hostname: 's2.googleusercontent.com',
      },
      {
        hostname: 'i.ytimg.com',
      },
      {
        hostname: 'img.youtube.com',
      },
      {
        hostname: '*.googleusercontent.com',
      },
      {
        hostname: '*.ggpht.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  serverExternalPackages: ['pdf-parse'],
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable gzip compression
  compress: true,
  // Add trailing slash for better SEO
  trailingSlash: false,
  // Increase timeout for builds
  staticPageGenerationTimeout: 120,
  // Enable experimental features
  experimental: {
    // Enable optimizeCss for better CSS optimization
    optimizeCss: true,
  },
};

export default nextConfig;
