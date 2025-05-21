/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment configurations - will be used differently on Vercel vs Railway
  serverRuntimeConfig: {
    // Only accessible on the server
    port: process.env.PORT || 5000,
  },
  
  publicRuntimeConfig: {
    // Available on client and server
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },

  // Replit-specific configuration for development
  // Ensure the port binding works correctly in the Replit environment
  experimental: {
    // Optimize for serverless deployments
    serverActions: true,
    // Special configuration for Replit development environment
    allowedDevOrigins: ['*.replit.dev', 'http://localhost:3000', '*.worf.replit.dev'],
  },
  
  // Optimize image handling
  images: {
    // Modern pattern configuration (deprecated 'domains' replaced)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Performance optimizations
  swcMinify: true,  // Uses SWC minifier instead of Terser for faster builds
  
  // Support for environment-specific headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
  
  // Adjusts for Railway vs Vercel deployment
  // In Railway, we need this to properly handle API routes
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
      // Fallback for client-side routing
      {
        source: "/:path*",
        destination: "/:path*",
      },
    ];
  },
  
  // Output directory optimization
  distDir: process.env.NODE_ENV === 'production' ? '.next' : '.dev-next',
  
  // Improve Webpack performance
  webpack: (config, { dev, isServer }) => {
    // Optimization only needed in production
    if (!dev) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }
    
    return config;
  },
  
  // Optimize for output
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

module.exports = nextConfig;
