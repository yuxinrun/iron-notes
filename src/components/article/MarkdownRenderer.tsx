"use client";

import { isValidElement, useState, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import { Check, ExternalLink, FlaskConical, ListChecks } from "lucide-react";
import { FigureBlock } from "@/components/svg/registry";
import { ChartBlock } from "@/components/charts/ChartBlock";
import { Note } from "@/components/ui";
import { referenceById } from "@/data/references";
import { headingId, cn } from "@/lib/utils";

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
  return "";
}

function parseJSON<T>(raw: string): T | null {
  try {
    return JSON.parse(raw.trim()) as T;
  } catch {
    return null;
  }
}

function ActionList({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<number[]>([]);
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center gap-2 border-b border-line bg-paper/70 px-5 py-3.5">
        <ListChecks size={17} className="text-brand" />
        <span className="text-[14.5px] font-bold text-ink">行动清单</span>
        <span className="ml-auto text-[11.5px] text-muted">点击可勾选 · 仅本次浏览有效</span>
      </div>
      <ul className="divide-y divide-line">
        {items.map((item, i) => {
          const on = checked.includes(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setChecked((c) => (on ? c.filter((x) => x !== i) : [...c, i]))}
                className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition hover:bg-paper/60"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition",
                    on ? "border-brand bg-brand text-white" : "border-line bg-white",
                  )}
                >
                  {on && <Check size={12} strokeWidth={3} />}
                </span>
                <span className={cn("text-[14px] leading-[1.75]", on ? "text-muted line-through" : "text-ink-2")}>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ReferenceCard({ id, index }: { id: string; index: number }) {
  const r = referenceById[id];
  if (!r) {
    return (
      <p className="text-[12.5px] text-brand-dark">参考文献 ID「{id}」未在库中登记，已省略以避免引用不存在的资料。</p>
    );
  }
  const href = r.doi ? `https://doi.org/${r.doi}` : r.url;
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="font-display text-[14px] font-bold text-brand">[{index}] {r.type}</span>
        <span className="font-display text-[12px] text-muted">{r.year}</span>
      </div>
      <h4 className="mt-2 text-[14px] font-bold leading-snug text-ink">{r.title}</h4>
      <p className="mt-1 text-[12px] text-muted">{r.authors} · {r.source}</p>
      <div className="mt-3 space-y-1.5 text-[12.5px] leading-[1.75] text-ink-2">
        <p><span className="font-semibold text-ink">研究对象：</span>{r.population}</p>
        <p><span className="font-semibold text-ink">主要结论：</span>{r.finding}</p>
        <p><span className="font-semibold text-ink">研究局限：</span>{r.limitation}</p>
        <p><span className="font-semibold text-ink">实际意义：</span>{r.practical}</p>
      </div>
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 break-all text-[11.5px] text-brand-dark hover:underline">
          <FlaskConical size={12} />
          {r.doi ? `DOI: ${r.doi}` : "查看来源"} <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

export function ReferenceList({ ids, title = "参考文献" }: { ids: string[]; title?: string }) {
  if (!ids.length) return null;
  return (
    <section className="mt-14 scroll-mt-24" id="references">
      <h2 className="!mt-0 flex items-center gap-2 border-t border-line pt-8 text-[23px] font-bold text-ink">
        <span className="font-display text-[14px] text-brand">REF.</span> {title}
      </h2>
      <p className="mb-5 mt-3 text-[13px] leading-relaxed text-muted">
        以下为可核验的公开文献、立场声明或指南。引文信息按公开记录整理，未确认的 DOI 一律不填写，
        改以 PubMed 检索链接或机构页面呈现。「结论」为本站编辑部的概括转述，请结合原文阅读。
      </p>
      <div className="space-y-3">
        {ids.map((id, i) => <ReferenceCard key={id} id={id} index={i + 1} />)}
      </div>
    </section>
  );
}

const components: Components = {
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children, ...props }) => {
    const raw = String(children).replace(/\n$/, "");
    const lang = /language-(iron-[\w-]+)/.exec(className ?? "")?.[1];

    if (lang === "iron-chart") {
      const cfg = parseJSON<{ id: string }>(raw);
      return cfg?.id ? <ChartBlock id={cfg.id} compact height={280} className="my-8" /> : null;
    }
    if (lang === "iron-figure") {
      const cfg = parseJSON<{ name: string; caption?: string }>(raw);
      return cfg?.name ? <FigureBlock name={cfg.name} caption={cfg.caption} /> : null;
    }
    if (lang === "iron-note") {
      const cfg = parseJSON<{ type?: "info" | "warning" | "tip" | "action"; title?: string; text?: string }>(raw);
      return cfg ? (
        <Note type={cfg.type ?? "info"} title={cfg.title}>{cfg.text ?? ""}</Note>
      ) : null;
    }
    if (lang === "iron-actions") {
      const cfg = parseJSON<string[]>(raw);
      return Array.isArray(cfg) ? <ActionList items={cfg} /> : null;
    }
    if (lang === "iron-refs") {
      const cfg = parseJSON<string[]>(raw);
      return Array.isArray(cfg) ? <ReferenceList ids={cfg} title="本节参考文献" /> : null;
    }
    if (className?.startsWith("language-")) {
      return <pre><code className={className}>{raw}</code></pre>;
    }
    return <code {...props}>{children}</code>;
  },
  h2: ({ children }) => {
    const text = nodeText(children);
    return (
      <h2 id={headingId(text)}>
        <span className="h2-index">§</span>{children}
      </h2>
    );
  },
  h3: ({ children }) => <h3 id={headingId(nodeText(children))}>{children}</h3>,
  a: ({ href, children }) => {
    const url = href ?? "#";
    if (url.startsWith("http")) {
      return <a href={url} target="_blank" rel="noopener noreferrer">{children} <ExternalLink size={12} className="inline" /></a>;
    }
    return <Link href={url}>{children}</Link>;
  },
  table: ({ children }) => (
    <div className="my-7 overflow-x-auto rounded-xl border border-line">
      <table>{children}</table>
    </div>
  ),
};

export function MarkdownRenderer({
  content,
  size = "m",
}: {
  content: string;
  size?: "s" | "m" | "l";
}) {
  return (
    <div className="prose-iron" data-size={size}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
