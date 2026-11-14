import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Article, ArticleMeta, TocItem, Reference } from "@/types";
import { headingId, stripMarkdown } from "@/lib/utils";
import { references } from "@/data/references";

const ARTICLE_DIR = path.join(process.cwd(), "src", "content", "articles");

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLE_DIR)) return [];
  return fs
    .readdirSync(ARTICLE_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getArticle(slug: string): Article | null {
  const file = path.join(ARTICLE_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const meta: ArticleMeta = {
    slug,
    title: String(data.title ?? slug),
    subtitle: String(data.subtitle ?? ""),
    channel: data.channel ?? "getting-started",
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: String(data.author ?? "IRON NOTES 编辑部"),
    updated: String(data.updated ?? "2026-01-01"),
    readingTime: Number(data.readingTime ?? 8),
    summary: String(data.summary ?? ""),
    conclusions: Array.isArray(data.conclusions) ? data.conclusions : [],
    evidence: data.evidence ?? "充分研究支持",
    figure: data.figure,
    chart: data.chart,
    related: Array.isArray(data.related) ? data.related : [],
    refs: Array.isArray(data.refs) ? data.refs : [],
    featured: Boolean(data.featured),
    number: data.number ? Number(data.number) : undefined,
  };

  return { ...meta, content, toc: extractToc(content) };
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map((slug) => getArticle(slug))
    .filter((a): a is Article => a !== null)
    .map(({ content: _content, toc: _toc, ...meta }) => meta)
    .sort((a, b) => (a.number ?? 999) - (b.number ?? 999));
}

export function getArticlesByChannel(channel: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.channel === channel);
}

export function getRelatedArticles(meta: ArticleMeta, limit = 3): ArticleMeta[] {
  const all = getAllArticles();
  const explicit = meta.related
    .map((slug) => all.find((a) => a.slug === slug))
    .filter((a): a is ArticleMeta => Boolean(a));
  const sameChannel = all.filter(
    (a) => a.channel === meta.channel && a.slug !== meta.slug && !explicit.some((e) => e.slug === a.slug),
  );
  return [...explicit, ...sameChannel].slice(0, limit);
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const text = stripMarkdown(m[2]);
    items.push({ id: headingId(text), text, level: m[1].length as 2 | 3 });
  }
  return items;
}

export function getReference(id: string): Reference | undefined {
  return references.find((r) => r.id === id);
}

/** 兼容旧引用：类型定义已迁至 @/lib/search-core，避免客户端打包 node:fs */
export type { SearchDoc } from "@/lib/search-core";
