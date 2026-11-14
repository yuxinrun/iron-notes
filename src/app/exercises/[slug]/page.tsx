import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Dumbbell, Wind, MoveHorizontal, AlertTriangle, Repeat2, RefreshCw, Layers, CheckCircle2 } from "lucide-react";
import { Breadcrumb, Tag, SectionHeading, Note } from "@/components/ui";
import { FavoriteButton } from "@/components/interactive/FavoriteButton";
import { FigureBlock, MuscleHighlightFigure } from "@/components/svg/registry";
import { ArticleCard } from "@/components/cards";
import { exercises, exerciseBySlug } from "@/data/exercises";
import { muscleName } from "@/data/muscle-groups";
import { articlesByExercise } from "@/lib/exercise-links";

export function generateStaticParams() {
  return exercises.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = exerciseBySlug[slug];
  if (!e) return { title: "动作未找到" };
  return {
    title: `${e.name} · ${e.en} 动作详解`,
    description: `${e.name}（${e.en}）的起始姿势、动作步骤、呼吸、幅度、常见错误、代偿与调整建议，配原创 SVG 图解。`,
    keywords: [e.name, e.en, e.pattern, ...e.primary.map(muscleName)],
  };
}

function InfoRow({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-4 last:border-0">
      <div className="flex items-center gap-2 text-[13px] font-bold text-ink">{icon}{title}</div>
      <div className="mt-2 text-[13.5px] leading-[1.9] text-ink-2">{children}</div>
    </div>
  );
}

export default async function ExerciseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = exerciseBySlug[slug];
  if (!e) notFound();

  const relatedArticles = articlesByExercise(slug);
  const alternatives = e.alternatives
    .map((name) => exercises.find((x) => x.name === name || name.includes(x.name)))
    .filter((x): x is (typeof exercises)[number] => Boolean(x))
    .slice(0, 4);
  const sameMuscle = exercises
    .filter((x) => x.slug !== e.slug && x.primary.some((m) => e.primary.includes(m)))
    .slice(0, 4);

  return (
    <>
      <header className="relative overflow-hidden bg-carbon text-white">
        <div className="grid-lines absolute inset-0 opacity-70" />
        <div className="shell relative py-9 md:py-12">
          <Breadcrumb light items={[{ label: "动作图鉴", href: "/exercises" }, { label: e.name }]} />
          <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="eyebrow eyebrow-light">{e.en} · {e.pattern}</div>
              <h1 className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.025em] md:text-[48px]">{e.name}</h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">{e.cue}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Tag tone="dark">难度：{e.difficulty}</Tag>
                <Tag tone="dark">器械：{e.equipment}</Tag>
                {e.primary.map((m) => <Tag key={m} tone="dark">目标：{muscleName(m)}</Tag>)}
              </div>
            </div>
            <FavoriteButton kind="exercise" id={slug} label="收藏动作" variant="solid" />
          </div>
        </div>
      </header>

      <div className="shell grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:py-14">
        <div className="min-w-0">
          <FigureBlock name={e.figure} caption={`${e.name} · 动作分解教学示意`} className="!mt-0" />

          <div className="mt-8 rounded-2xl border border-line bg-white p-5 md:p-7">
            <InfoRow icon={<Dumbbell size={16} className="text-brand" />} title="起始姿势">{e.startPosition}</InfoRow>
            <InfoRow icon={<Repeat2 size={16} className="text-brand" />} title="动作步骤">
              <ol className="ml-4 list-decimal space-y-2">
                {e.steps.map((s, i) => <li key={i} className="pl-1">{s}</li>)}
              </ol>
            </InfoRow>
            <InfoRow icon={<Wind size={16} className="text-brand" />} title="呼吸方式">{e.breathing}</InfoRow>
            <InfoRow icon={<MoveHorizontal size={16} className="text-brand" />} title="动作幅度">{e.rom}</InfoRow>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center gap-2 text-[14px] font-bold text-ink"><AlertTriangle size={16} className="text-brand" /> 常见错误</div>
              <ul className="mt-3 space-y-2">
                {e.mistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/70" />{m}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center gap-2 text-[14px] font-bold text-ink"><Layers size={16} className="text-data1" /> 容易出现的代偿</div>
              <ul className="mt-3 space-y-2">
                {e.compensations.map((m, i) => (
                  <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-data1" />{m}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center gap-2 text-[14px] font-bold text-ink"><RefreshCw size={16} className="text-data3" /> 动作调整建议</div>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {e.adjustments.map((m, i) => (
                <li key={i} className="flex gap-2 rounded-lg bg-paper/70 px-3 py-2 text-[13px] leading-relaxed text-ink-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-data3" />{m}</li>
              ))}
            </ul>
          </div>

          <Note type="warning" title="安全提示">
            以上为教学示意与通用技术要点，不替代现场教练指导或个体化评估。出现疼痛、关节肿胀、活动明显受限时，请停止诱发动作并咨询医生与具备资质的专业人员。
          </Note>

          {alternatives.length > 0 && (
            <section className="mt-10">
              <SectionHeading eyebrow="ALTERNATIVES" title="相关替代动作" desc="器械、关节状况或训练阶段不同时，可在这里替换。" />
              <div className="grid gap-3 sm:grid-cols-2">
                {alternatives.map((a) => (
                  <Link key={a.slug} href={`/exercises/${a.slug}`} className="card card-hover group flex items-center justify-between gap-3 p-4">
                    <div><div className="text-[14.5px] font-semibold text-ink group-hover:text-brand-dark">{a.name}</div><div className="mt-0.5 text-[11.5px] text-muted">{a.en} · {a.equipment}</div></div>
                    <ArrowUpRight size={16} className="shrink-0 text-brand" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <MuscleHighlightFigure group={e.primary[0]} caption={`目标肌群示意：${e.primary.map(muscleName).join(" / ")}`} />
          <div className="rounded-xl border border-line bg-white p-5">
            <div className="eyebrow !text-[10px]">EXERCISE PROFILE</div>
            <dl className="mt-3 space-y-3 text-[13px]">
              <div className="flex justify-between gap-3"><dt className="text-muted">英文名</dt><dd className="text-right font-medium text-ink">{e.en}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">动作模式</dt><dd className="text-right font-medium text-ink">{e.pattern}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">训练难度</dt><dd className="text-right font-medium text-ink">{e.difficulty}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">器械要求</dt><dd className="text-right font-medium text-ink">{e.equipment}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">协同肌群</dt><dd className="text-right font-medium text-ink">{e.secondary.length ? e.secondary.map(muscleName).join("、") : "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">适合阶段</dt><dd className="text-right font-medium text-ink">{e.phases.join("、")}</dd></div>
            </dl>
          </div>
          <div className="rounded-xl bg-carbon p-5 text-white">
            <div className="eyebrow eyebrow-light">TRAINING CUE</div>
            <p className="mt-3 text-[14.5px] font-semibold leading-[1.7]">「{e.cue}」</p>
            <Link href="/plans" className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand">放进训练计划 <ArrowUpRight size={13} /></Link>
          </div>
          {sameMuscle.length > 0 && (
            <div className="rounded-xl border border-line bg-white p-5">
              <div className="eyebrow !text-[10px]">SAME MUSCLE</div>
              <div className="mt-3 space-y-2">
                {sameMuscle.map((x) => (
                  <Link key={x.slug} href={`/exercises/${x.slug}`} className="group flex items-center justify-between gap-2 text-[13px] text-ink-2 hover:text-brand-dark">
                    {x.name} <ArrowUpRight size={13} className="text-muted" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {relatedArticles.length > 0 && (
        <section className="section bg-paper-2 !py-14">
          <div className="shell">
            <SectionHeading eyebrow="RELATED READING" title="把动作放回知识体系里" desc="理解动作背后的变量安排，比单独记住一个动作更有用。" />
            <div className="grid gap-4 md:grid-cols-3">
              {relatedArticles.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
