import type { Metadata } from "next";
import Link from "next/link";
import {
  Flame, Beef, PieChart, Layers, TrendingUp, Ruler, NotebookPen,
  SlidersHorizontal, Calculator, ArrowUpRight, ShieldCheck, Database, BookOpen,
  type LucideIcon,
} from "lucide-react";
import { PageIntro, SectionHeading, Tag, Note, ButtonLink } from "@/components/ui";
import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "工具箱",
  description: "每日热量、蛋白质、三大营养素、训练容量、1RM、BMI、增肌进度记录与训练计划生成器，共 8 个可交互计算器，均给出公式、口径与误差说明。",
};

const ICONS: Record<string, LucideIcon> = {
  Flame, Beef, PieChart, Layers, TrendingUp, Ruler, NotebookPen, SlidersHorizontal,
};

export default function ToolsPage() {
  return (
    <>
      <PageIntro
        eyebrow="TOOLBOX / 实用工具"
        title="把概念换成可以动手算的数字"
        desc={`${tools.length} 个交互计算器：从热量与蛋白质起步，到训练容量、1RM、体型指标，再到可本地保存的进度记录与计划生成。每个工具都写明公式、统计口径、误差来源与适用边界——数字是起点，不是结论。`}
        crumbs={[{ label: "工具箱" }]}
        meta={<><Tag tone="brand">{tools.length} 个工具</Tag><Tag tone="dark">公式透明 / 本地存储</Tag></>}
        dark
      />

      <section className="section !pb-10">
        <div className="shell">
          <Note type="info" title="先读这一句，再开始算">
            所有结果都是基于群体公式或经验式的估算，不是体检数据、医学结论或个体化处方。请把它们当作「起始猜测」，再用 2–3 周的真实记录去校正。数据仅保存在本机浏览器，不会上传服务器。
          </Note>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tools.map((t, i) => {
              const Icon = ICONS[t.icon] ?? Calculator;
              return (
                <Link key={t.key} href={`/tools/${t.key}`} className="card card-hover group flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                      <Icon size={21} strokeWidth={1.8} />
                    </span>
                    <span className="font-display text-[13px] tracking-[0.16em] text-ink/25">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="eyebrow mt-5 !text-[10px]">{t.en}</div>
                  <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-ink transition group-hover:text-brand-dark">{t.name}</h3>
                  <p className="mt-2.5 text-[12.5px] leading-[1.8] text-muted">{t.description}</p>
                  <ul className="mt-4 space-y-1.5 border-t border-line pt-3.5">
                    {t.outputs.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-[11.5px] text-ink-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand/70" />{o}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between pt-4 text-[11.5px] text-brand-dark">
                    <span>打开工具</span>
                    <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="HOW TO USE / 使用原则"
            title="算得清楚，也要知道哪里算不准"
            desc="工具的价值是帮你把模糊感觉变成可追踪的变量，而不是给一个看起来很精确的答案。"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <BookOpen size={18} />,
                title: "先看公式与口径",
                desc: "每个工具下方都写了计算式、单位与统计口径。同一个「训练容量」在不同口径下含义完全不同，先确认你算的是哪一个。",
              },
              {
                icon: <Database size={18} />,
                title: "用趋势校正估算",
                desc: "公式来自群体数据，对个体可能有明显偏差。用晨起体重 7 日均线、围度与同动作表现去修正起始值，比换一个公式更有用。",
              },
              {
                icon: <ShieldCheck size={18} />,
                title: "守住健康边界",
                desc: "工具不评估伤病、疾病或用药情况，也不提供任何非法药物方案。出现疼痛、持续表现下滑或医学问题，请找医生与具备资质的专业人员。",
              },
            ].map((x) => (
              <div key={x.title} className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-carbon text-white">{x.icon}</span>
                <h3 className="mt-4 text-[16px] font-bold text-ink">{x.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.85] text-muted">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-6 py-5">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-ink">想看数字背后的推理过程？</p>
              <p className="mt-1 text-[13px] text-muted">从训练变量、渐进超负荷到热量盈余，知识体系里有对应的完整文章。</p>
            </div>
            <ButtonLink href="/articles" variant="outline" size="sm">浏览全部文章</ButtonLink>
            <ButtonLink href="/lab" variant="dark" size="sm">去数据实验室</ButtonLink>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/articles/training-variables"><Tag>训练变量</Tag></Link>
            <Link href="/articles/weekly-sets"><Tag>周组数</Tag></Link>
            <Link href="/articles/calorie-surplus"><Tag>热量盈余</Tag></Link>
            <Link href="/articles/protein-intake"><Tag>蛋白质摄入</Tag></Link>
            <Link href="/articles/no-progress-six-months"><Tag>半年没进步</Tag></Link>
          </div>
        </div>
      </section>
    </>
  );
}
