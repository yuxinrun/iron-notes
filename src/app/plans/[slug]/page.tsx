import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, Users, Dumbbell, ShieldCheck, Flame, TrendingUp, RotateCcw } from "lucide-react";
import { Breadcrumb, Tag, SectionHeading, Note, ButtonLink } from "@/components/ui";
import { FavoriteButton } from "@/components/interactive/FavoriteButton";
import { PlanSchedule } from "@/components/plans/PlanSchedule";
import { ArticleCard } from "@/components/cards";
import { plans, planBySlug } from "@/data/plans";
import { planArticles } from "@/lib/plan-links";

export function generateStaticParams() {
  return plans.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = planBySlug[slug];
  if (!p) return { title: "计划未找到" };
  return { title: p.name, description: `${p.name}：${p.split}，每周 ${p.daysPerWeek} 练，${p.audience}` };
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <div className="flex items-center gap-2 text-[15px] font-bold text-ink">{icon}{title}</div>
      <div className="mt-3 text-[13.5px] leading-[1.9] text-ink-2">{children}</div>
    </div>
  );
}

export default async function PlanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = planBySlug[slug];
  if (!p) notFound();
  const related = planArticles(slug);
  const similar = plans.filter((x) => x.slug !== slug && (x.daysPerWeek === p.daysPerWeek || x.split === p.split)).slice(0, 3);

  return (
    <>
      <header className="relative overflow-hidden bg-carbon text-white">
        <div className="grid-lines absolute inset-0 opacity-70" />
        <div className="shell relative py-9 md:py-12">
          <Breadcrumb light items={[{ label: "训练计划", href: "/plans" }, { label: p.name }]} />
          <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="eyebrow eyebrow-light">{p.en}</div>
              <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-[-0.025em] md:text-[46px]">{p.name}</h1>
              <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-white/60">「{p.highlight}」</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Tag tone="dark">每周 {p.daysPerWeek} 练</Tag>
                {p.levels.map((l) => <Tag key={l} tone="dark">{l}</Tag>)}
                <Tag tone="dark">{p.split}</Tag>
                <Tag tone="dark">{p.duration} / 次</Tag>
              </div>
            </div>
            <FavoriteButton kind="plan" id={slug} label="收藏计划" variant="solid" />
          </div>
        </div>
      </header>

      <div className="shell py-10 lg:py-14">
        <Note type="warning" title="这是模板，不是个体化处方">
          {p.cautions} 本站不提供医学或专业体能评估；训练计划生成器生成的安排也不等于医疗或专业个体评估。
        </Note>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Users size={17} />, label: "适合人群", value: p.audience },
            { icon: <Dumbbell size={17} />, label: "器械条件", value: p.equipment.join(" / ") },
            { icon: <Clock size={17} />, label: "单次时长", value: p.duration },
            { icon: <ShieldCheck size={17} />, label: "热身建议", value: p.warmup },
          ].map((x) => (
            <div key={x.label} className="card p-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-muted">{x.icon}{x.label}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{x.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <SectionHeading eyebrow="WEEK AT A GLANCE" title="可视化周训练表" desc="点击「完成打卡」可记录当天训练；数据保存在本机浏览器，可在个人记录页查看与导出。" />
          <PlanSchedule plan={p} />
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Block icon={<TrendingUp size={17} className="text-brand" />} title="进阶规则">
            <ol className="ml-4 list-decimal space-y-2">{p.progression.map((x, i) => <li key={i} className="pl-1">{x}</li>)}</ol>
          </Block>
          <Block icon={<RotateCcw size={17} className="text-data3" />} title="减量与调整建议">
            <p>{p.deload}</p>
            <p className="mt-3 border-t border-line pt-3 text-[13px] text-muted">出现持续疼痛、关节不适或明显乏力时，先停止加量并咨询医生与具备资质的专业人员。</p>
          </Block>
        </div>

        <div className="mt-5">
          <Block icon={<Flame size={17} className="text-data2" />} title="替代动作">
            <ul className="grid gap-2 md:grid-cols-2">
              {p.substitutes.map((x, i) => (
                <li key={i} className="flex gap-2 rounded-lg bg-paper/70 px-3 py-2 text-[13px]"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/70" />{x}</li>
              ))}
            </ul>
          </Block>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 md:p-6">
          <div>
            <h3 className="text-[16px] font-bold text-ink">想把安排改成自己的？</h3>
            <p className="mt-1.5 text-[13px] text-muted">训练计划生成器可按经验、天数、器械、时间与目标生成可编辑的周安排。</p>
          </div>
          <ButtonLink href="/tools/generator" variant="primary">打开生成器 <ArrowUpRight size={15} /></ButtonLink>
        </div>

        {similar.length > 0 && (
          <section className="mt-12">
            <SectionHeading eyebrow="SIMILAR PLANS" title="条件相近的其他计划" desc="对比不同分化在同样天数下的安排差异。" />
            <div className="grid gap-3 sm:grid-cols-3">
              {similar.map((x) => (
                <Link key={x.slug} href={`/plans/${x.slug}`} className="card card-hover group p-4">
                  <div className="eyebrow !text-[10px]">{x.en}</div>
                  <div className="mt-1.5 text-[14.5px] font-bold text-ink group-hover:text-brand-dark">{x.name}</div>
                  <div className="mt-2 text-[12px] text-muted">每周 {x.daysPerWeek} 练 · {x.split}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="section bg-paper-2 !py-14">
          <div className="shell">
            <SectionHeading eyebrow="RELATED READING" title="理解这套计划为什么这样排" desc="先懂变量与容量，再谈照抄。" />
            <div className="grid gap-4 md:grid-cols-3">{related.map((a) => <ArticleCard key={a.slug} article={a} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
