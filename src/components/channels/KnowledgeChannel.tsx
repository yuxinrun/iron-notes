import Link from "next/link";
import { ArrowUpRight, ArrowRight, BookOpen, Compass, Calculator, Database } from "lucide-react";
import { PageIntro, SectionHeading, Tag, ButtonLink, DataLabel } from "@/components/ui";
import { ArticleCard } from "@/components/cards";
import { FigureBlock } from "@/components/svg/registry";
import { ChartBlock } from "@/components/charts/ChartBlock";
import { channelByKey } from "@/data/categories";
import { knowledgeMap } from "@/data/knowledge-map";
import { getArticlesByChannel, getAllArticles } from "@/lib/content";
import { quotes } from "@/data/quotes";
import type { ChannelKey } from "@/types";

const visuals: Record<string, { figures: { name: string; caption?: string }[]; charts: string[]; toolLinks: { href: string; label: string }[] }> = {
  "getting-started": {
    figures: [
      { name: "hypertrophy-mechanism", caption: "三个条件同时成立，训练才会累积成进步" },
      { name: "body-front", caption: "人体正面主要肌群分区（教学示意）" },
      { name: "body-back", caption: "人体背面主要肌群分区（教学示意）" },
    ],
    charts: ["frequency-volume", "reps-trend"],
    toolLinks: [
      { href: "/tools/calorie", label: "每日热量估算器" },
      { href: "/tools/protein", label: "蛋白质摄入计算器" },
      { href: "/tools/generator", label: "训练计划生成器" },
    ],
  },
  science: {
    figures: [
      { name: "training-cycle", caption: "刺激、疲劳与恢复的周期（概念示意）" },
      { name: "overload-ladder", caption: "双重渐进法的进阶节奏（示例数据）" },
      { name: "bench-press", caption: "动作幅度与路径会影响跨周可比性" },
    ],
    charts: ["volume-trend", "plan-comparison", "rir-rpe", "sets-by-muscle"],
    toolLinks: [
      { href: "/tools/volume", label: "训练容量计算器" },
      { href: "/tools/onerm", label: "1RM 估算器" },
      { href: "/lab", label: "数据实验室" },
    ],
  },
  nutrition: {
    figures: [
      { name: "nutrition-plate", caption: "增肌期餐盘结构（教学示意）" },
      { name: "protein-distribution", caption: "每日蛋白质分配（示例数据）" },
    ],
    charts: ["protein-meals", "macro-ratio", "bodyweight-trend"],
    toolLinks: [
      { href: "/tools/calorie", label: "每日热量估算器" },
      { href: "/tools/protein", label: "蛋白质摄入计算器" },
      { href: "/tools/macros", label: "三大营养素计算器" },
    ],
  },
  recovery: {
    figures: [
      { name: "training-cycle", caption: "疲劳未消退时叠加刺激，等于停在曲线下降段" },
      { name: "overload-ladder", caption: "减量后按双重渐进重新爬升（示例数据）" },
    ],
    charts: ["performance-recovery", "long-term-progress", "bodyweight-trend"],
    toolLinks: [
      { href: "/tools/progress", label: "增肌进度记录器" },
      { href: "/lab", label: "数据实验室" },
      { href: "/tools/bmi", label: "BMI 与体型指标" },
    ],
  },
};

export function KnowledgeChannel({ channelKey }: { channelKey: ChannelKey }) {
  const channel = channelByKey[channelKey];
  const articles = getArticlesByChannel(channelKey);
  const sections = knowledgeMap[channelKey] ?? [];
  const cfg = visuals[channelKey] ?? visuals.science;
  const quote = quotes[(channel.order * 3) % quotes.length];
  const allCount = getAllArticles().length;

  return (
    <>
      <PageIntro
        eyebrow={`${channel.en} / 频道 ${String(channel.order).padStart(2, "0")}`}
        title={channel.label}
        desc={channel.detail}
        crumbs={[{ label: channel.label }]}
        meta={
          <>
            <Tag tone="brand">{articles.length} 篇深度文章</Tag>
            <Tag tone="dark">{sections.reduce((n, s) => n + s.topics.length, 0)} 个知识主题</Tag>
            <Tag tone="dark">全站 {allCount} 篇</Tag>
          </>
        }
        dark
      />

      {/* 知识地图 */}
      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="KNOWLEDGE MAP / 知识地图"
            title="把这一频道该懂的，逐项讲清楚"
            desc="每个主题都给出可检验的解释与对应内容入口；不是目录堆砌，是可以按顺序读下去的路径。"
            action={<ButtonLink href="/articles" variant="outline" size="sm">文章库 <ArrowRight size={14} /></ButtonLink>}
          />
          <div className="space-y-5">
            {sections.map((s) => (
              <div key={s.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-paper/60 px-5 py-4 md:px-6">
                  <div>
                    <div className="eyebrow !text-[11px]">{s.en}</div>
                    <h3 className="mt-1.5 text-[20px] font-bold text-ink">{s.title}</h3>
                  </div>
                  <Tag tone="brand">{s.topics.length} 个主题</Tag>
                </div>
                <p className="border-b border-line px-5 py-4 text-[13.5px] leading-[1.9] text-ink-2 md:px-6">{s.intro}</p>
                <div className="grid gap-x-6 gap-y-1 p-4 md:grid-cols-2 md:p-5">
                  {s.topics.map((t) => (
                    <Link
                      key={t.name}
                      href={t.href}
                      className="group flex items-start gap-3 rounded-lg px-2 py-2.5 transition hover:bg-paper"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/70" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ink group-hover:text-brand-dark">
                          {t.name} <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100" />
                        </span>
                        <span className="mt-0.5 block text-[12.5px] leading-[1.7] text-muted">{t.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 图解 */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="ORIGINAL SVG / 原创图解"
            title="用图把结构讲明白"
            desc="全部为本站原创矢量教学示意图，支持缩放；人体结构示意不代替医学解剖资料。"
            action={<ButtonLink href="/exercises" variant="outline" size="sm">动作图鉴 <ArrowRight size={14} /></ButtonLink>}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {cfg.figures.map((f) => <FigureBlock key={f.name} name={f.name} caption={f.caption} className="!my-0" />)}
          </div>
        </div>
      </section>

      {/* 示例数据图表 */}
      <section className="section bg-carbon text-white">
        <div className="shell">
          <SectionHeading
            light
            eyebrow="DATA LAB / 数据视角"
            title="把概念放进可比较的曲线里"
            desc="以下图表全部为教学示例数据，可录入自己的数据重绘；每张图都标注统计口径与单位。"
            action={<ButtonLink href="/lab" variant="light" size="sm">数据实验室 <ArrowRight size={14} /></ButtonLink>}
          />
          <div className="mb-6"><DataLabel>示例数据 · SAMPLE DATA · 非用户真实记录</DataLabel></div>
          <div className="grid gap-5 lg:grid-cols-2">
            {cfg.charts.map((id) => <ChartBlock key={id} id={id} editable compact height={280} />)}
          </div>
        </div>
      </section>

      {/* 文章 */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="DEEP READING / 深度文章"
            title={`${channel.label} · ${articles.length} 篇深度文章`}
            desc="每篇都写清科学原理、适用边界、训练示例、常见误区、行动清单与参考来源。"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>

      {/* 工具与观点 */}
      <section className="section bg-paper-2 !py-14">
        <div className="shell grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-line bg-white p-6 md:p-8">
            <div className="flex items-center gap-2"><Compass size={19} className="text-brand" /><h3 className="text-[18px] font-bold text-ink">配套工具与入口</h3></div>
            <div className="mt-5 space-y-2">
              {cfg.toolLinks.map((t) => (
                <Link key={t.href} href={t.href} className="group flex items-center justify-between rounded-lg border border-line px-4 py-3 text-[14px] text-ink hover:border-brand">
                  <span className="flex items-center gap-2"><Calculator size={15} className="text-muted" /> {t.label}</span>
                  <ArrowUpRight size={15} className="text-brand" />
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/plans"><Tag>训练计划库</Tag></Link>
              <Link href="/exercises"><Tag>动作图鉴</Tag></Link>
              <Link href="/resources"><Tag>书籍与资源</Tag></Link>
            </div>
          </div>
          <div className="rounded-2xl bg-carbon p-6 text-white md:p-8">
            <div className="eyebrow eyebrow-light">IRON NOTES · 训练哲学</div>
            <p className="mt-5 text-[21px] font-semibold leading-[1.65] md:text-[24px]">「{quote.text}」</p>
            <div className="mt-6 flex items-center gap-2 text-[11.5px] text-white/45">
              <span className="h-px w-8 bg-brand" /> 原创观点 · 非研究结论 · #{quote.tag}
            </div>
            <Link href="/articles" className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">
              继续读文章 <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 学习路径 */}
      <section className="section !py-12">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-white p-6 md:flex-row md:items-center md:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><BookOpen size={21} /></span>
              <div>
                <h3 className="text-[18px] font-bold text-ink">第一次来？从这条路径开始</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">先读新手行动指南 → 弄懂训练变量 → 选一套计划 → 学会记录与复盘。</p>
              </div>
            </div>
            <ButtonLink href="/articles/start-from-zero" variant="primary">从零开始增肌 <ArrowRight size={15} /></ButtonLink>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] text-muted">
            <Database size={13} /> 本站所有示例数据、示例图表与示意图均明确标注，不代表用户真实记录或行业统计。
          </div>
        </div>
      </section>
    </>
  );
}
