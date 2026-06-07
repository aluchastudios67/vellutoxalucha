import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // ── Do NOT expose source code in production ──
    productionBrowserSourceMaps: false,

    // ── Remove the X-Powered-By: Next.js header ──
    poweredByHeader: false,

    // ── Fast builds (type-check with tsc separately) ──
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    // ── Image optimisation ──
    images: {
        remotePatterns: imageHosts,
        minimumCacheTTL: 3600,          // cache 1 hour (was 60s)
        qualities: [75, 85, 100],
        formats: ['image/webp', 'image/avif'],  // serve modern formats
    },

    // ── Compression ──
    compress: true,

    // ── Dev indicators off ──
    devIndicators: false,

    // ── Webpack: ignore paths in dev watch ──
    webpack(config, { dev }) {
        if (dev) {
            const ignoredPaths = (process.env.WATCH_IGNORED_PATHS || '')
                .split(',')
                .map((p) => p.trim())
                .filter(Boolean);
            config.watchOptions = {
                ignored: ignoredPaths.length
                    ? ignoredPaths.map((p) => `**/${p.replace(/^\/+|\/+$/g, '')}/**`)
                    : undefined,
            };
        }
        return config;
    },
};

export default nextConfig;
