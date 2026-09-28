import type { NextConfig } from 'next';

// Static export so the site can be hosted on GitHub Pages (n-kumar-rai-323.github.io).
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
