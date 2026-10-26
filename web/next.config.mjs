import path from 'path';
import { fileURLToPath } from 'url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is an independent project inside a workspace folder; pin the
  // Turbopack workspace root so a stale lockfile in a parent directory
  // doesn't break module resolution of the @/* alias.
  turbopack: {
    root: projectDir,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
