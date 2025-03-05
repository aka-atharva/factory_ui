/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Disable the default basePath since we're serving from the root
  basePath: "",
  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,
}

module.exports = nextConfig

