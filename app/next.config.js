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
  logging: {
    fetches: {
      fullUrl: true,
    },
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