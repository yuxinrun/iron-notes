import { getAllArticles } from "@/lib/content";
import { exercises } from "@/data/exercises";
import { plans } from "@/data/plans";
import { books } from "@/data/books";
import { websites } from "@/data/websites";
import { tools } from "@/data/tools";
import { channels } from "@/data/categories";
import type { SearchDoc } from "@/lib/search-core";

/** 服务端专用：构建全站搜索索引。纯函数与类型请从 @/lib/search-core 引入。 */
export type { SearchDoc } from "@/lib/search-core";
export { typeLabel, searchDocs } from "@/lib/search-core";

export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const c of channels) {
    docs.push({
      type: "tool",
      title: c.label,
      subtitle: c.description,
      href: c.href,
      keywords: `${c.label} ${c.en} ${c.description} 频道 导航`,
    });
  }

  for (const a of getAllArticles()) {
    docs.push({
      type: "article",
      title: a.title,
      subtitle: a.summary || a.subtitle,
      href: `/articles/${a.slug}`,
      keywords: `${a.title} ${a.subtitle} ${a.tags.join(" ")} ${a.summary} 文章`,
    });
  }

  for (const e of exercises) {
    docs.push({
      type: "exercise",
      title: e.name,
      subtitle: `${e.en} · ${e.pattern} · ${e.equipment}`,
      href: `/exercises/${e.slug}`,
      keywords: `${e.name} ${e.en} ${e.primary.join(" ")} ${e.equipment} ${e.pattern} 动作`,
    });
  }

  for (const p of plans) {
    docs.push({
      type: "plan",
      title: p.name,
      subtitle: `${p.split} · 每周 ${p.daysPerWeek} 练 · ${p.levels.join("/")}`,
      href: `/plans/${p.slug}`,
      keywords: `${p.name} ${p.en} ${p.split} ${p.levels.join(" ")} ${p.equipment.join(" ")} 训练计划`,
    });
  }

  for (const b of books) {
    docs.push({
      type: "book",
      title: b.titleCn && b.titleCn.length < 24 ? `${b.titleCn}｜${b.title}` : b.title,
      subtitle: `${b.authors} · ${b.category}`,
      href: `/resources#book-${b.id}`,
      keywords: `${b.title} ${b.titleCn ?? ""} ${b.authors} ${b.category} 书籍`,
    });
  }

  for (const w of websites) {
    docs.push({
      type: "site",
      title: w.name,
      subtitle: `${w.kind} · ${w.category}`,
      href: `/resources#site-${w.id}`,
      keywords: `${w.name} ${w.category} ${w.region} ${w.kind} 网站 资源`,
    });
  }

  for (const t of tools) {
    docs.push({
      type: "tool",
      title: t.name,
      subtitle: t.description,
      href: `/tools/${t.key}`,
      keywords: `${t.name} ${t.en} ${t.description} 计算器 工具`,
    });
  }

  return docs;
}
