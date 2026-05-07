/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i1.sndcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'sndcdn.com',
      }
    ],
  },
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
