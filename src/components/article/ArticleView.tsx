"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, Share2, Check, Type, ChevronDown, ArrowLeft, ArrowRight, Clock, CalendarDays, PenLine, List, FlaskConical } from "lucide-react";
import { Breadcrumb, Tag, EvidenceBadge, SectionHeading } from "@/components/ui";
import { ArticleCard } from "@/components/cards";
import { MarkdownRenderer, ReferenceList } from "@/components/article/MarkdownRenderer";
import { channelByKey } from "@/data/categories";
import { isFavorite, toggleFavorite, ADAPTER } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { Article, ArticleMeta } from "@/types";

export function ArticleView({
  article,
  related,
  prev,
  next,
}: {
  article: Article;
  related: ArticleMeta[];
  prev?: ArticleMeta;
  next?: ArticleMeta;
}) {
  const [size, setSize] = useState<"s" | "m" | "l">("m");
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const channel = channelByKey[article.channel];

  useEffect(() => {
    setFav(isFavorite("article", article.slug));
    const saved = ADAPTER.read<"s" | "m" | "l" | null>("font-size", null);
    if (saved) setSize(saved);
  }, [article.slug]);

  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const passed = window.innerHeight * 0.35 - rect.top;
      setProgress(Math.max(0, Math.min(100, (passed / Math.max(total, 1)) * 100)));
      const heads = Array.from(el.querySelectorAll("h2[id], h3[id]"));
      let current = "";
      for (const h of heads) {
        if (h.getBoundingClientRect().top < 150) current = h.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const doFavorite = () => setFav(toggleFavorite("article", article.slug));

  const doShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.subtitle, url });
        return;
      }
    } catch {
      /* 用户取消分享则转为复制链接 */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const changeSize = (s: "s" | "m" | "l") => {
    setSize(s);
    ADAPTER.write("font-size", s);
  };

  const jump = (id: string) => {
    setTocOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 95, behavior: "smooth" });
  };

  return (
    <>
      {/* 阅读进度 */}
      <div className="fixed left-0 right-0 top-[68px] z-40 h-[3px] bg-transparent">
        <div className="h-full bg-brand transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <article>
        <header className="relative overflow-hidden bg-carbon text-white">
          <div className="grid-lines absolute inset-0 opacity-70" />
          <div className="shell relative py-9 md:py-12">
            <Breadcrumb
              light
              items={[
                { label: channel.label, href: channel.href },
                { label: "文章", href: "/articles" },
                { label: article.title },
              ]}
            />
            <div className="mt-8 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="dark">{channel.label}</Tag>
                {article.number && <Tag tone="dark">NO. {String(article.number).padStart(2, "0")}</Tag>}
                {article.tags.slice(0, 2).map((t) => <Tag key={t} tone="dark">#{t}</Tag>)}
              </div>
              <h1 className="mt-5 text-[30px] font-bold leading-[1.28] tracking-[-0.025em] md:text-[44px]">{article.title}</h1>
              <p className="mt-4 text-[15px] leading-[1.8] text-white/60 md:text-[17px]">{article.subtitle}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/12 pt-5 text-[12.5px] text-white/50">
                <span className="inline-flex items-center gap-1.5"><PenLine size={13} /> {article.author}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> 更新于 {article.updated}</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={13} /> 约 {article.readingTime} 分钟</span>
                <span className="inline-flex items-center gap-1.5"><FlaskConical size={13} /> {article.evidence}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 核心结论 */}
        {article.conclusions.length > 0 && (
          <div className="shell relative -mt-6 md:-mt-8">
            <div className="max-w-4xl rounded-2xl border border-line bg-white p-5 shadow-card md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="eyebrow">CORE TAKEAWAYS / 核心结论</div>
                <EvidenceBadge level={article.evidence} />
              </div>
              <ul className="mt-4 grid gap-3 md:grid-cols-3">
                {article.conclusions.map((c, i) => (
                  <li key={i} className="flex gap-2.5 border-l-2 border-brand/40 pl-3 text-[13.5px] leading-[1.75] text-ink-2">
                    <span className="font-display text-[13px] font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 移动端目录与工具 */}
        <div className="shell mt-8 lg:hidden">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white p-3">
            <button
              type="button"
              onClick={() => setTocOpen((v) => !v)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-[13px] text-ink"
            >
              <List size={15} /> 文章目录 <ChevronDown size={14} className={cn("transition", tocOpen && "rotate-180")} />
            </button>
            <button type="button" onClick={doFavorite} className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px]", fav ? "border-brand bg-brand-soft text-brand-dark" : "border-line text-ink")}>
              <Bookmark size={15} fill={fav ? "currentColor" : "none"} /> {fav ? "已收藏" : "收藏"}
            </button>
            <button type="button" onClick={doShare} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-ink">
              {copied ? <Check size={15} className="text-data1" /> : <Share2 size={15} />} {copied ? "已复制" : "分享"}
            </button>
            <div className="ml-auto inline-flex items-center gap-1 rounded-lg border border-line px-2">
              <Type size={14} className="text-muted" />
              {(["s", "m", "l"] as const).map((s) => (
                <button key={s} type="button" onClick={() => changeSize(s)} className={cn("h-8 w-7 rounded text-[12px]", size === s ? "bg-brand text-white" : "text-muted")}>
                  {s === "s" ? "小" : s === "m" ? "中" : "大"}
                </button>
              ))}
            </div>
          </div>
          {tocOpen && (
            <nav className="mt-2 rounded-xl border border-line bg-white p-4">
              {article.toc.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => jump(t.id)}
                  className={cn("block w-full py-1.5 text-left text-[13px]", t.level === 3 ? "pl-6 text-muted" : "font-medium text-ink-2", activeId === t.id && "text-brand-dark")}
                >
                  {t.text}
                </button>
              ))}
            </nav>
          )}
        </div>

        <div className="shell grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_250px] lg:py-14">
          <div ref={bodyRef} className="mx-auto w-full min-w-0 max-w-prose">
            <MarkdownRenderer content={article.content} size={size} />
            <ReferenceList ids={article.refs ?? []} />

            {/* 上一篇 / 下一篇 */}
            <div className="mt-12 grid gap-3 border-t border-line pt-7 sm:grid-cols-2">
              {prev ? (
                <Link href={`/articles/${prev.slug}`} className="card card-hover group p-4">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-muted"><ArrowLeft size={13} /> 上一篇</div>
                  <div className="mt-2 line-clamp-2 text-[14px] font-semibold text-ink group-hover:text-brand-dark">{prev.title}</div>
                </Link>
              ) : <div />}
              {next && (
                <Link href={`/articles/${next.slug}`} className="card card-hover group p-4 sm:text-right">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-muted sm:justify-end">下一篇 <ArrowRight size={13} /></div>
                  <div className="mt-2 line-clamp-2 text-[14px] font-semibold text-ink group-hover:text-brand-dark">{next.title}</div>
                </Link>
              )}
            </div>
          </div>

          {/* 桌面端侧栏 */}
          <aside className="hidden lg:block">
            <div className="sticky top-[92px] space-y-5">
              <div className="rounded-xl border border-line bg-white p-4">
                <div className="eyebrow !text-[10px]">READING TOOLS</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={doFavorite} className={cn("inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border text-[12.5px]", fav ? "border-brand bg-brand-soft text-brand-dark" : "border-line text-ink-2 hover:border-ink")}>
                    <Bookmark size={14} fill={fav ? "currentColor" : "none"} /> {fav ? "已收藏" : "收藏"}
                  </button>
                  <button type="button" onClick={doShare} className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line text-[12.5px] text-ink-2 hover:border-ink">
                    {copied ? <Check size={14} className="text-data1" /> : <Share2 size={14} />} {copied ? "已复制链接" : "分享 / 复制"}
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-muted"><Type size={14} /> 正文字号</span>
                  <div className="inline-flex overflow-hidden rounded-lg border border-line">
                    {(["s", "m", "l"] as const).map((s) => (
                      <button key={s} type="button" onClick={() => changeSize(s)} className={cn("h-7 w-8 text-[11.5px]", size === s ? "bg-brand text-white" : "bg-white text-muted hover:bg-paper")}>
                        {s === "s" ? "小" : s === "m" ? "中" : "大"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 border-t border-line pt-3">
                  <div className="flex items-center justify-between text-[11.5px] text-muted">
                    <span>阅读进度</span><span>{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2"><div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} /></div>
                </div>
              </div>

              <nav className="rounded-xl border border-line bg-white p-4">
                <div className="eyebrow !text-[10px]">TABLE OF CONTENTS</div>
                <div className="mt-3 max-h-[52vh] space-y-0.5 overflow-y-auto pr-1">
                  {article.toc.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => jump(t.id)}
                      className={cn(
                        "block w-full border-l-2 py-1.5 text-left text-[12.5px] leading-snug transition",
                        t.level === 3 ? "pl-5" : "pl-3",
                        activeId === t.id ? "border-brand font-semibold text-brand-dark" : "border-line text-muted hover:border-brand/50 hover:text-ink",
                      )}
                    >
                      {t.text}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="rounded-xl bg-carbon p-4 text-white">
                <div className="eyebrow eyebrow-light">KEEP READING</div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/65">把这一篇放进收藏，下一次训练前再回来对照一遍。</p>
                <Link href="/my" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand">我的收藏 <ArrowRight size={13} /></Link>
              </div>
            </div>
          </aside>
        </div>

        {/* 相关文章 */}
        {related.length > 0 && (
          <section className="section bg-paper-2 !py-14">
            <div className="shell">
              <SectionHeading eyebrow="RELATED READING" title="接着读这几篇" desc="围绕同一主题补齐上下文，避免只记住一句结论。" />
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((r) => <ArticleCard key={r.slug} article={r} />)}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
