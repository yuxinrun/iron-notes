# iron-notes

IRON NOTES 铁与笔记 — 中文科学健身与增肌知识平台（Next.js App Router + TypeScript）。

## 本地开发

```bash
npm install
npm run dev
npm run build
npx tsc --noEmit
```

## GitHub Pages 自动部署

推送到 `main` 会触发 `.github/workflows/deploy.yml`：安装依赖 → 静态导出到 `out/` → 发布到 `gh-pages` 分支。静态导出由环境变量 `GITHUB_PAGES=true` 开启，项目页的 `basePath` 从 `GITHUB_REPOSITORY` 自动推导，本地开发不受影响。

首次启用需在仓库 **Settings → Pages → Build and deployment** 中把 Source 设为 `Deploy from a branch`，分支选 `gh-pages`、目录选 `/(root)`。站点地址为 `https://yuxinrun.github.io/iron-notes/`。

本地复现静态导出：

```powershell
$env:GITHUB_PAGES = "true"
$env:GITHUB_REPOSITORY = "yuxinrun/iron-notes"
npm run build
```

> 全站文章、图表与计划均为原创内容与示例数据；健康、补剂与训练安全相关页面均附边界说明。
