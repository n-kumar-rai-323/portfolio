import type { NextConfig } from 'next';

// Static export: the Docker image serves the files in /out with Nginx.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
