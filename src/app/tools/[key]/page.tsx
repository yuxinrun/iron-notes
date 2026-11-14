import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { PageIntro, SectionHeading, Tag, Note } from "@/components/ui";
import { ToolRunner } from "@/components/tools/ToolRunner";
import { tools, toolByKey } from "@/data/tools";
import { getArticle, getArticleSlugs } from "@/lib/content";

export function generateStaticParams() {
  return tools.map((t) => ({ key: t.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const tool = toolByKey[key];
  if (!tool) return { title: "工具未找到" };
  return { title: tool.name, description: tool.description };
}

const RELATED: Record<string, string[]> = {
  calorie: ["calorie-surplus", "carbs-fats", "ten-habits"],
  protein: ["protein-intake", "creatine", "calorie-surplus"],
  macros: ["carbs-fats", "protein-intake", "calorie-surplus"],
  volume: ["weekly-sets", "training-variables", "progressive-overload"],
  onerm: ["rir-rpe", "rep-ranges", "progressive-overload"],
  bmi: ["no-progress-six-months", "ten-habits", "plateau"],
  progress: ["plateau", "no-progress-six-months", "sleep"],
  generator: ["three-day-plan", "four-day-plan", "full-body-vs-upper-lower"],
};

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const tool = toolByKey[key];
  if (!tool) notFound();

  const index = tools.findIndex((t) => t.key === key);
  const prev = index > 0 ? tools[index - 1] : undefined;
  const next = index >= 0 && index < tools.length - 1 ? tools[index + 1] : undefined;

  const slugs = new Set(getArticleSlugs());
  const related = (RELATED[key] ?? [])
    .filter((s) => slugs.has(s))
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => a !== null);

  return (
    <>
      <PageIntro
        eyebrow={`TOOLBOX / ${tool.en}`}
        title={tool.name}
        desc={tool.description}
        crumbs={[{ label: "工具箱", href: "/tools" }, { label: tool.name }]}
        meta={<><Tag tone="brand">交互计算器</Tag>{tool.outputs.slice(0, 3).map((o) => <Tag key={o}>{o}</Tag>)}</>}
        dark
      />

      <section className="section !pb-8">
        <div className="shell">
          <Note type="info" title="关于结果">
            下方结果是按公开公式或经验式计算的估算值，不是医学评估或个体化处方。请结合公式说明、统计口径与自身记录理解它；本站所有内置数字均为示例，不代表你的真实数据。
          </Note>
          <div className="mt-8">
            <ToolRunner toolKey={tool.key} />
          </div>
        </div>
      </section>

      <section className="section bg-paper-2 !py-14">
        <div className="shell">
          <SectionHeading
            eyebrow="GO DEEPER / 相关阅读"
            title="理解数字背后的为什么"
            desc="计算器回答「大概是多少」，文章回答「为什么是这样、什么时候不适用」。"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="card card-hover group flex flex-col p-5">
                <div className="eyebrow !text-[10px]">ARTICLE / {a.readingTime} 分钟</div>
                <h3 className="mt-2 text-[16px] font-bold leading-snug text-ink transition group-hover:text-brand-dark">{a.title}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-muted">{a.summary || a.subtitle}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11.5px] text-muted">
                  <span>{a.tags.slice(0, 2).join(" / ")}</span>
                  <ArrowUpRight size={15} className="text-brand" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            {prev ? (
              <Link href={`/tools/${prev.key}`} className="inline-flex items-center gap-2 text-[13.5px] text-ink-2 transition hover:text-brand-dark">
                <ChevronLeft size={16} /><span><span className="block text-[11px] text-muted">上一个工具</span>{prev.name}</span>
              </Link>
            ) : <span />}
            <Link href="/tools" className="text-[13px] text-muted hover:text-brand-dark">返回工具箱</Link>
            {next ? (
              <Link href={`/tools/${next.key}`} className="inline-flex items-center gap-2 text-right text-[13.5px] text-ink-2 transition hover:text-brand-dark">
                <span><span className="block text-[11px] text-muted">下一个工具</span>{next.name}</span><ChevronRight size={16} />
              </Link>
            ) : <span />}
          </div>
        </div>
      </section>
    </>
  );
}
