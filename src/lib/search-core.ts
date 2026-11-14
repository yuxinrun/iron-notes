/**
 * 纯搜索逻辑，不依赖文件系统或任何 Node 内置模块。
 * 客户端组件（顶部搜索框、搜索页）直接引用本模块，避免把
 * src/lib/content.ts 的 node:fs 依赖带进浏览器构建。
 */
export interface SearchDoc {
  type: "article" | "exercise" | "plan" | "book" | "site" | "tool";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}

const TYPE_LABEL: Record<SearchDoc["type"], string> = {
  article: "文章",
  exercise: "动作",
  plan: "训练计划",
  book: "书籍",
  site: "专业网站",
  tool: "工具 / 频道",
};

export function typeLabel(t: SearchDoc["type"]): string {
  return TYPE_LABEL[t];
}

export function searchDocs(docs: SearchDoc[], query: string, limit = 40): SearchDoc[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return docs
    .map((d) => {
      const hay = `${d.title} ${d.subtitle} ${d.keywords}`.toLowerCase();
      const score = terms.reduce((acc, t) => {
        if (d.title.toLowerCase().includes(t)) return acc + 6;
        if (hay.includes(t)) return acc + 2;
        return acc - 10;
      }, 0);
      return { doc: d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.doc);
}
