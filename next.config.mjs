/** @type {import('next').NextConfig} */

// GitHub Pages 项目页托管在 https://<user>.github.io/<repo>/ 下，
// 静态导出时必须带 basePath；用户页 <user>.github.io 本身不需要前缀。
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath = isGitHubPages && repoName && !repoName.endsWith(".github.io") ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // 仅在 GitHub Actions 构建时启用静态导出；本地 npm run dev / build 行为保持不变。
  ...(isGitHubPages && {
    output: "export",
    basePath,
    trailingSlash: true,
  }),
};

export default nextConfig;
