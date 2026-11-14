/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
  },
  async redirects() {
    return [
      {
        source: '/lab',
        destination: '/#learning-radar',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
