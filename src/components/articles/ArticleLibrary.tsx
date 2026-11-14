"use client";

import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/cards";
import { EmptyState, Tag } from "@/components/ui";
import { channels, channelLabel } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { ArticleMeta, ChannelKey } from "@/types";

/**
 * 文章库筛选器（纯客户端）。
 * 使用 URL query + History API 而非服务端 searchParams，
 * 这样 /articles 可以被静态导出到 GitHub Pages，同时保留可分享的筛选链接。
 */
export function ArticleLibrary({ articles }: { articles: ArticleMeta[] }) {
  const [channel, setChannel] = useState<ChannelKey | undefined>(undefined);
  const [tag, setTag] = useState<string | undefined>(undefined);

  useEffect(() => {
    const readUrl = () => {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("channel");
      setChannel(channels.some((x) => x.key === c) ? (c as ChannelKey) : undefined);
      setTag(p.get("tag") ?? undefined);
    };
    readUrl();
    window.addEventListener("popstate", readUrl);
    return () => window.removeEventListener("popstate", readUrl);
  }, []);

  const apply = (next: { channel?: ChannelKey; tag?: string }) => {
    const p = new URLSearchParams();
    if (next.channel) p.set("channel", next.channel);
    if (next.tag) p.set("tag", next.tag);
    const qs = p.toString();
    window.history.pushState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    setChannel(next.channel);
    setTag(next.tag);
  };

  const tags = Array.from(new Set(articles.flatMap((a) => a.tags))).slice(0, 22);
  const list = articles.filter(
    (a) => (!channel || a.channel === channel) && (!tag || a.tags.includes(tag)),
  );

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-line pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[12.5px] font-semibold text-muted">频道</span>
          <button type="button" onClick={() => apply({})} className={cn("tag hover:border-brand", !channel && !tag && "tag-brand")}>全部</button>
          {channels.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => apply({ channel: c.key })}
              className={cn("tag hover:border-brand", channel === c.key && !tag && "tag-brand")}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[12.5px] font-semibold text-muted">标签</span>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => apply({ tag: t })}
              className={cn("tag hover:border-brand", tag === t && "tag-brand")}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="text-[20px] font-bold text-ink">
          {tag ? "标签筛选" : channel ? channelLabel(channel) : "全部文章"}
          {tag && <span className="ml-2 text-[14px] font-normal text-muted">#{tag}</span>}
        </h2>
        <span className="text-[12.5px] text-muted">共 {list.length} 篇</span>
      </div>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="这个筛选下暂时没有文章"
            desc="换一个频道或标签试试，全部文章都在文章库里。"
            action={<button type="button" onClick={() => apply({})} className="btn btn-outline btn-sm">查看全部文章</button>}
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => <ArticleCard key={a.slug} article={a} />)}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-5">
        <Tag tone="brand">{articles.length} 篇深度文章</Tag>
        <Tag>证据等级标注</Tag>
        <Tag>参考文献可回溯</Tag>
      </div>
    </>
  );
}
