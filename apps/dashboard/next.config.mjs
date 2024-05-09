/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@seventy-seven/ui'],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/inbox',
  //       destination: '/inbox/all',
  //       permanent: false,
  //     },
  //   ]
  // },
}

export default config
