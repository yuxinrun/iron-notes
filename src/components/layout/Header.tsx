"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, Bookmark, ArrowUpRight, Command, ChevronRight } from "lucide-react";
import { Logo } from "@/components/brand";
import { navItems } from "@/data/categories";
import { typeLabel, searchDocs } from "@/lib/search-core";
import { readFavorites, subscribeStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { SearchDoc } from "@/lib/search-core";

export function Header({ docs }: { docs: SearchDoc[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [favCount, setFavCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => setFavCount(readFavorites().length);
    sync();
    return subscribeStorage(sync);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen || menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, menuOpen]);

  const results = useMemo(() => searchDocs(docs, query, 12), [docs, query]);

  const submitSearch = () => {
    if (!query.trim()) return;
    setSearchOpen(false);
    // 若已停留在 /search，路由不会重新挂载搜索页，用事件把关键词直接送过去。
    window.dispatchEvent(new CustomEvent("iron-notes:search", { detail: query.trim() }));
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-line/80 bg-paper/95 backdrop-blur-md transition-shadow",
          scrolled && "shadow-[0_6px_24px_rgba(20,23,26,.07)]",
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-4">
          <Logo />

          <nav aria-label="主导航" className="hidden items-center gap-[18px] xl:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative whitespace-nowrap text-[13.5px] font-medium transition-colors",
                    active ? "text-brand-dark" : "text-ink-2 hover:text-brand-dark",
                  )}
                >
                  {item.label}
                  {active && <span className="absolute -bottom-[9px] left-0 h-[2px] w-full bg-brand" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="打开搜索"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-2.5 text-[12.5px] text-muted transition hover:border-ink hover:text-ink"
            >
              <Search size={16} />
              <span className="hidden lg:inline">搜索</span>
              <span className="hidden items-center gap-0.5 rounded border border-line px-1 font-mono text-[10px] lg:inline-flex">
                <Command size={9} />K
              </span>
            </button>
            <Link
              href="/my"
              aria-label="我的收藏与记录"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink-2 transition hover:border-ink"
            >
              <Bookmark size={16} />
              {favCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {favCount > 99 ? "99+" : favCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="打开导航菜单"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink xl:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* 移动端抽屉 */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            aria-label="关闭菜单"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-carbon/50 backdrop-blur-[2px]"
          />
          <div className="absolute right-0 top-0 h-full w-[min(340px,86vw)] overflow-y-auto bg-paper shadow-lift">
            <div className="flex h-[68px] items-center justify-between border-b border-line px-5">
              <Logo compact />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="关闭" className="p-1.5 text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="px-5 py-4">
              <div className="eyebrow">NAVIGATION</div>
              <nav className="mt-3 flex flex-col">
                {navItems.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between border-b border-line py-3.5 text-[15px] font-medium text-ink"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-display text-[12px] text-brand">{String(i).padStart(2, "0")}</span>
                      {item.label}
                    </span>
                    <ChevronRight size={16} className="text-muted" />
                  </Link>
                ))}
              </nav>
              <div className="mt-6 rounded-xl bg-carbon p-4 text-white">
                <div className="eyebrow eyebrow-light">TRAIN SMART. BUILD STRONG.</div>
                <p className="mt-2 text-[13px] leading-relaxed text-white/70">练得明白，长得扎实。</p>
                <Link href="/getting-started" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">
                  从零开始增肌 <ArrowUpRight size={14} />
                </Link>
              </div>
              <Link href="/my" className="mt-4 flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink">
                <span className="flex items-center gap-2"><Bookmark size={15} /> 我的收藏与记录</span>
                <span className="tag tag-brand">{favCount}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 搜索对话框 */}
      {searchOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[10vh]">
          <button
            type="button"
            aria-label="关闭搜索"
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 bg-carbon/60 backdrop-blur-[3px]"
          />
          <div className="relative w-full max-w-[640px] overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Search size={19} className="text-brand" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder="搜索文章、动作、计划、书籍、工具…"
                className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/70"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="rounded p-1 text-muted hover:text-ink" aria-label="关闭">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[52vh] overflow-y-auto px-2 py-2">
              {!query.trim() ? (
                <div className="px-4 py-6">
                  <div className="eyebrow !text-[11px]">快速入口</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["从零开始增肌", "RIR", "蛋白质", "深蹲", "推拉腿", "肌酸", "数据实验室"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setQuery(t)}
                        className="rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink-2 hover:border-brand hover:text-brand-dark"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="mt-5 text-[12px] text-muted">共收录 {docs.length} 条可检索内容 · 按 Ctrl / ⌘ + K 随时打开</p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-9 text-center">
                  <p className="text-[14px] font-medium text-ink">没有找到「{query}」相关内容</p>
                  <p className="mt-1.5 text-[12.5px] text-muted">试试更短的关键词，或按 Enter 查看完整搜索页</p>
                </div>
              ) : (
                results.map((r, i) => (
                  <Link
                    key={`${r.type}-${r.href}-${i}`}
                    href={r.href}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-paper"
                  >
                    <span className="mt-0.5 shrink-0 rounded-md bg-paper-2 px-2 py-1 text-[11px] text-muted">{typeLabel(r.type)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">{r.title}</span>
                      <span className="mt-0.5 block truncate text-[12px] text-muted">{r.subtitle}</span>
                    </span>
                    <ArrowUpRight size={15} className="mt-1 shrink-0 text-muted" />
                  </Link>
                ))
              )}
            </div>
            {query.trim() && (
              <button
                type="button"
                onClick={submitSearch}
                className="flex w-full items-center justify-between border-t border-line bg-paper/60 px-5 py-3 text-[12.5px] text-ink-2 hover:bg-paper"
              >
                <span>查看「{query.trim()}」的全部搜索结果</span>
                <span className="flex items-center gap-1 text-brand-dark">搜索页 <ArrowUpRight size={14} /></span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
