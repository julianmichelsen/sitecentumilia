/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Since we are exporting or dealing with local markdown images often
  },
};

export default nextConfig;
