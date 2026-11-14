"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, X } from "lucide-react";
import { EmptyState, Tag } from "@/components/ui";
import { cn } from "@/lib/utils";
import { typeLabel, searchDocs, type SearchDoc } from "@/lib/search-core";

const FILTERS: { key: "全部" | SearchDoc["type"]; label: string }[] = [
  { key: "全部", label: "全部" },
  { key: "article", label: "文章" },
  { key: "exercise", label: "动作" },
  { key: "plan", label: "训练计划" },
  { key: "tool", label: "工具" },
  { key: "book", label: "书籍" },
  { key: "site", label: "专业网站" },
];

const QUICK = ["从零开始增肌", "RIR", "蛋白质", "深蹲", "推拉腿", "肌酸", "平台期", "数据实验室"];

export function SearchPageClient({ docs }: { docs: SearchDoc[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"全部" | SearchDoc["type"]>("全部");
  const skipFirstWrite = useRef(true);

  useEffect(() => {
    const readUrl = () => {
      const q = new URLSearchParams(window.location.search).get("q");
      setQuery(q ?? "");
    };
    const onHeaderSearch = (e: Event) => {
      const q = (e as CustomEvent<string>).detail;
      if (typeof q === "string") setQuery(q);
    };
    readUrl();
    window.addEventListener("popstate", readUrl);
    window.addEventListener("iron-notes:search", onHeaderSearch);
    return () => {
      window.removeEventListener("popstate", readUrl);
      window.removeEventListener("iron-notes:search", onHeaderSearch);
    };
  }, []);

  // 用相对路径同步 URL，保留 GitHub Pages 的 basePath 与尾斜杠。
  useEffect(() => {
    if (skipFirstWrite.current) {
      skipFirstWrite.current = false;
      return;
    }
    const q = query.trim();
    const url = `${window.location.pathname}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", url);
    }
  }, [query]);

  const results = useMemo(() => searchDocs(docs, query, 80), [docs, query]);
  const list = filter === "全部" ? results : results.filter((r) => r.type === filter);
  const counts = useMemo(() => {
    const m: Record<string, number> = { 全部: results.length };
    for (const r of results) m[r.type] = (m[r.type] ?? 0) + 1;
    return m;
  }, [results]);

  return (
    <>
      <div className="rounded-2xl border border-line bg-white p-4 md:p-5">
        <div className="flex items-center gap-3">
          <Search size={20} className="shrink-0 text-brand" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、动作、计划、书籍、工具…"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted/70"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="清空搜索" className="rounded p-1 text-muted hover:text-ink">
              <X size={18} />
            </button>
          )}
        </div>
        <p className="mt-3 border-t border-line pt-3 text-[11.5px] text-muted">共收录 {docs.length} 条可检索内容 · 按 Ctrl / ⌘ + K 也可以随时打开顶部搜索框</p>
      </div>

      {!query.trim() ? (
        <div className="mt-6">
          <div className="eyebrow !text-[11px]">POPULAR / 从这里开始</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setQuery(t)}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[12.5px] text-ink-2 transition hover:border-brand hover:text-brand-dark"
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "按知识体系找", d: "六大海道从入门到恢复与进步，每个频道都有结构化知识地图。", href: "/getting-started" },
              { t: "按动作找", d: "按肌群筛选动作图鉴，附原创 SVG 分解与常见错误。", href: "/exercises" },
              { t: "按目标找", d: "按水平、天数与器械筛选可执行的训练计划。", href: "/plans" },
            ].map((x) => (
              <Link key={x.t} href={x.href} className="card card-hover group flex flex-col p-5">
                <h3 className="text-[15px] font-bold text-ink group-hover:text-brand-dark">{x.t}</h3>
                <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-muted">{x.d}</p>
                <div className="mt-3 flex items-center gap-1 text-[12px] text-brand-dark">前往 <ArrowUpRight size={13} /></div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[12.5px] transition",
                  filter === f.key ? "border-brand bg-brand-soft font-semibold text-brand-dark" : "border-line bg-white text-ink-2 hover:border-brand hover:text-brand-dark",
                )}
              >
                {f.label}
                <span className="ml-1.5 font-mono text-[10.5px] opacity-60">{counts[f.key] ?? 0}</span>
              </button>
            ))}
          </div>

          {list.length ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
              {list.map((r, i) => (
                <Link
                  key={`${r.type}-${r.href}-${i}`}
                  href={r.href}
                  className="group flex items-start gap-3 border-b border-line px-4 py-3.5 transition last:border-0 hover:bg-paper/70 md:px-5"
                >
                  <span className="mt-0.5 w-8 shrink-0 font-display text-[13px] text-ink/25">{String(i + 1).padStart(2, "0")}</span>
                  <Tag>{typeLabel(r.type)}</Tag>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-semibold text-ink transition group-hover:text-brand-dark">{r.title}</span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-muted">{r.subtitle}</span>
                  </span>
                  <ArrowUpRight size={15} className="mt-1 shrink-0 text-muted transition group-hover:text-brand" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title={results.length ? "这个分类下没有匹配内容" : `没有找到「${query.trim()}」相关内容`}
                desc="试试更短的关键词、换一个同义说法，或切回「全部」分类。文章里用的术语也可能和你习惯的叫法不同。"
                icon={<Search size={22} />}
                action={<button type="button" onClick={() => { setQuery(""); setFilter("全部"); }} className="btn btn-outline btn-sm">清空搜索</button>}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
