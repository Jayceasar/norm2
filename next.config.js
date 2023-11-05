/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: [{ loader: `@svgr/webpack`, options: { icon: true } }],
  //   });

  //   return config;
  // },
};

module.exports = nextConfig;
