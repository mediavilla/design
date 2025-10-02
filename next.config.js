/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repo = '' // leave '' for custom domain; set to '/your-repo' if publishing under username.github.io/your-repo

module.exports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,               // helps with static hosting
  basePath: repo,                    // '' for custom domain, '/repo' for project pages
  assetPrefix: repo || undefined,    // match basePath
}