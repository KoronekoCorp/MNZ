/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack, buildId, isServer }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId)
      })
    );
    return config
  },
  async headers() {
    return [
      // {
      //   source: "/chap/:path(\\d+)",
      //   headers: [
      //     { key: "Vercel-CDN-Cache-Control", value: "max-age=86400, stale-while-revalidate=3600" },
      //     { key: "CDN-Cache-Control", value: "max-age=600, must-revalidate" }
      //   ]
      // },
      // {
      //   source: "/shchap/:path(\\d+)",
      //   missing: [
      //     {
      //       type: "query",
      //       key: "tsukkomis"
      //     }
      //   ],
      //   headers: [
      //     { key: "Vercel-CDN-Cache-Control", value: "max-age=604800, stale-while-revalidate=3600" },
      //     { key: "CDN-Cache-Control", value: "max-age=600, must-revalidate" }
      //   ]
      // },
      // {
      //   source: "/shchap/:path(\\d+)",
      //   has: [
      //     {
      //       type: "query",
      //       key: "tsukkomis"
      //     }
      //   ],
      //   headers: [
      //     { key: "Vercel-CDN-Cache-Control", value: "max-age=86400, stale-while-revalidate=3600" },
      //     { key: "CDN-Cache-Control", value: "max-age=600, must-revalidate" }
      //   ]
      // },
      // {
      //   source: "/book/:path*",
      //   headers: [
      //     { key: "Vercel-CDN-Cache-Control", value: "max-age=7200, stale-while-revalidate=3600" },
      //     { key: "CDN-Cache-Control", value: "max-age=600, must-revalidate" }
      //   ]
      // },
      // {
      //   source: "/userchap/:path(\\d+)",
      //   headers: [
      //     { key: "Vercel-CDN-Cache-Control", value: "max-age=7200, stale-while-revalidate=3600" },
      //     { key: "CDN-Cache-Control", value: "max-age=600, must-revalidate" }
      //   ]
      // },
      // {
      //   source: "/tag/:path*",
      //   headers: [
      //     { key: "Vercel-CDN-Cache-Control", value: "max-age=7200, stale-while-revalidate=3600" },
      //     { key: "CDN-Cache-Control", value: "max-age=600, must-revalidate" }
      //   ]
      // },
      // {
      //   source: "/search/:path*",
      //   headers: [
      //     { key: "Vercel-CDN-Cache-Control", value: "max-age=7200, stale-while-revalidate=3600" },
      //     { key: "CDN-Cache-Control", value: "max-age=600, must-revalidate" }
      //   ]
      // },
      // {
      //   source: "/booklists/:path*",
      //   headers: [
      //     { key: "Vercel-CDN-Cache-Control", value: "max-age=7200, stale-while-revalidate=3600" },
      //     { key: "CDN-Cache-Control", value: "max-age=600, must-revalidate" }
      //   ]
      // },
      {
        source: "/:path(|assets/images/logo.png|history|bookmark|bbs.php|settings|login|account|rank)",
        headers: [
          { key: "Vercel-CDN-Cache-Control", value: "max-age=2592000" },
          { key: "CDN-Cache-Control", value: "max-age=3600, must-revalidate" },
          { key: "Cache-Control", value: "max-age=3600, must-revalidate" }
        ]
      },
      {
        source: "/:path(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "nofollow" }
        ]
      }
    ]
  }
}

module.exports = nextConfig


// Injected content via Sentry wizard below

// const { withSentryConfig } = require("@sentry/nextjs");

// module.exports = withSentryConfig(
//   module.exports,
//   {
//     // For all available options, see:
//     // https://github.com/getsentry/sentry-webpack-plugin#options

//     // Suppresses source map uploading logs during build
//     silent: true,
//     org: process.env.SENTRY_ORG,
//     project: "nextjs",
//   },
//   {
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,

//     // Transpiles SDK to be compatible with IE11 (increases bundle size)
//     transpileClientSDK: true,

//     // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
//     tunnelRoute: "/monitoring",

//     // Hides source maps from generated client bundles
//     hideSourceMaps: true,

//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,
//   }
// );
