import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Produce a minimal, self-contained output for faster cold starts
    // Fail fast in production; allow flexibility in dev/CI if desired
    // Next.js 16: 'eslint' in next.config is no longer supported; manage ESLint via .eslintrc and CLI
    // Continue to ignore TypeScript build errors in non-prod to ease local dev/CI
    // Provide an explicit (empty) Turbopack config to avoid conflicts with custom webpack config
    turbopack: {},
    reactCompiler: true,
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    // Reduce client bundle size and improve runtime perf
    // Prefer modern optimizations
    // Next.js 16: use SWC-based modularizeImports for reliable per-module transforms
    modularizeImports: {
        lodash: {
            transform: 'lodash/{{member}}',
            preventFullImport: true,
        },
        // Note: lucide-react, react-icons, and Radix UI packages are generally ESM-friendly.
        // We rely on their tree-shaking and direct subpath imports in code.
    },
    // experimental: {
    //     turbopackFileSystemCacheForDev: true,
    // },
    compiler: {
        // Trim console.* in production bundles but keep error/warn
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    },
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV !== 'production',
    },

    // Help Next.js tree-shake and dedupe by transpiling local packages if needed
    transpilePackages: ['lemmy-js-client'],

    images: {
        // Using Next/Image without on-the-fly optimization to keep server lean
        // Flip to `false` if you want Next's built-in Image Optimization.
        unoptimized: true,
    },

    // Smaller bundles and faster builds in production
    productionBrowserSourceMaps: false,

    // Security + cache headers
    // Ensure WebAssembly works reliably in all environments (avoid fetch failures)
    webpack: (config: any) => {
        // Enable modern WebAssembly support in Webpack
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            topLevelAwait: true,
            layers: true,
        };

        // Some environments block or mis-serve .wasm via fetch(). To make the app resilient,
        // emit WASM as a real file so libraries that do `fetch(url)` can load it
        const rules = (config.module?.rules ?? []) as any[];
        const hasWasmRule = rules.some((r: any) => String(r.test) === String(/\.wasm$/));
        if (!hasWasmRule) {
            (config.module ??= { rules: [] as any[] }).rules!.push({
                test: /\.wasm$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/wasm/[name]-[hash][ext]',
                },
            });
        }

        return config;
    },

    async redirects() {

        // Adjust the path list below to match the sections you want to protect
        return [
            {
                source: '/dashboard/:path*',
                destination: '/login',
                permanent: false,
                missing: [
                    {type: 'cookie', key: 'jwt'},
                    {type: 'cookie', key: 'access_token'},
                    {type: 'cookie', key: 'token'},
                    {type: 'header', key: 'authorization'},
                ],
            },
            {
                source: '/account/:path*',
                destination: '/login',
                permanent: false,
                missing: [
                    {type: 'cookie', key: 'jwt'},
                    {type: 'header', key: 'authorization'},
                ],
            },
            {
                source: '/settings/:path*',
                destination: '/login',
                permanent: false,
                missing: [
                    {type: 'cookie', key: 'jwt'},
                    {type: 'cookie', key: 'access_token'},
                    {type: 'cookie', key: 'token'},
                    {type: 'header', key: 'authorization'},
                ],
            },
        ];
    },

    // Long-term caching for static assets and wasm files
    async headers() {
        return [
            {
                source: '/_next/static/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/static/wasm/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                    { key: 'Content-Type', value: 'application/wasm' },
                ],
            },
        ];
    },
    // Rewrites to backend/CDN (replace env as needed)
    async rewrites() {
        const apiBase = process.env.API_INTERNAL_URL ?? 'https://api-staging.108jobs.com';
        return {
            // Ensure filesystem route `/api/session` wins before any proxying
            beforeFiles: [
                { source: '/session', destination: '/api/session' },
                { source: '/:lang(th|en|vi)/session', destination: '/api/session' },
                { source: '/api/session', destination: '/api/session' },
            ],
            // Proxy other API routes and static uploads
            afterFiles: [
                { source: '/api/:path*', destination: `${apiBase}/:path*` },
                { source: '/uploads/:path*', destination: 'https://cdn.108jobs.com/uploads/:path*' },
            ],
            fallback: [],
        };
    },

};

export default nextConfig;