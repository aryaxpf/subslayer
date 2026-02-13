import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Turbopack is enabled by default in Next.js 15+, and it doesn't like unexpected webpack configs.
    // Since we are using CDN for PDF worker, we might not need the canvas shim.
    // If needed, we can explore turbopack specific config or revert to webpack.
};

export default withPWA(nextConfig);
