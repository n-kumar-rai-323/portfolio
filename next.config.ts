import type { NextConfig } from 'next';

// Set by CI when the site is served from a sub-path, e.g. "/portfolio" on GitHub Pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Static export so the site can be hosted on GitHub Pages.
const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
