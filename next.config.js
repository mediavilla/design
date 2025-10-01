/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',               // generate /out
  images: { unoptimized: true },  // required for static export
  // If you’ll serve at a custom root domain (recommended), no basePath is needed.
  // If you’re using a project URL (username.github.io/repo), set:
  // basePath: '/<repo-name>',
  // assetPrefix: '/<repo-name>/',
};
export default nextConfig;