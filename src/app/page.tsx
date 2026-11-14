import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, Microscope, BookOpen, Dumbbell, CalendarRange, Utensils, Moon, Quote, Calculator, Database, ShieldCheck, ExternalLink, FlaskConical } from "lucide-react";
import { HeroVisual, QuoteCard, LogoMark } from "@/components/brand";
import { ButtonLink, SectionHeading, Tag, DataLabel } from "@/components/ui";
import { ArticleCard, ExerciseCard, PlanCard, BookCard, SiteCard } from "@/components/cards";
import { FigureBlock } from "@/components/svg/registry";
import { ChartBlock } from "@/components/charts/ChartBlock";
import { getAllArticles } from "@/lib/content";
import { channels } from "@/data/categories";
import { myths } from "@/data/myths";
import { quoteOfDay } from "@/data/quotes";
import { exercises } from "@/data/exercises";
import { plans } from "@/data/plans";
import { books } from "@/data/books";
import { websites } from "@/data/websites";
import { tools } from "@/data/tools";
import { references } from "@/data/references";

const entryIcons = [BookOpen, Microscope, Dumbbell, CalendarRange, Utensils, Moon];

export default function HomePage() {
  const articles = getAllArticles();
  const featured = articles.filter((a) => a.featured).slice(0, 3);
  const heroArticles = featured.length >= 3 ? featured : articles.slice(0, 3);
  const beginnerPicks = articles.filter((a) => a.channel === "getting-started").slice(0, 5);
  const sciencePicks = articles.filter((a) => a.channel === "science").slice(0, 4);
  const quote = quoteOfDay();
  const researchPicks = references.filter((r) => ["grgic2022failure", "morton2018", "kreider2017"].includes(r.id));

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-carbon text-white">
        <div className="grid-lines absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(224,83,42,.16),transparent_55%)]" />
        {/* 移动端：主视觉作为背景层，文字重新排布，而不是压缩 PC 布局 */}
        <div className="absolute inset-y-0 right-0 w-[72%] opacity-[0.28] lg:hidden">
          <HeroVisual />
        </div>

        <div className="shell relative grid items-center gap-10 py-14 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-brand" />
              <span className="eyebrow eyebrow-light">SCIENCE IN. MUSCLE OUT.</span>
            </div>

            <h1 className="mt-6 text-[42px] font-bold leading-[1.14] tracking-[-0.035em] sm:text-[58px] lg:text-[68px] xl:text-[76px]">
              练得明白，<br />
              <span className="text-brand">长得扎实。</span>
            </h1>
            <div className="mt-3 font-display text-[18px] font-semibold tracking-[0.16em] text-white/35 sm:text-[22px]">
              TRAIN SMART. BUILD STRONG.
            </div>

            <p className="mt-7 max-w-[520px] text-[15px] leading-[1.9] text-white/75 sm:text-[16px]">
              从训练原理、动作技术到营养恢复，用科学的方法建立真正有效的增肌体系。
            </p>
            <p className="mt-3 border-l-2 border-brand pl-4 text-[13.5px] leading-relaxed text-white/50 sm:text-[14px]">
              不迷信偏方，不追逐玄学，不拿汗水冒充成果。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/getting-started" variant="primary" className="w-full sm:w-auto">
                从零开始增肌
              </ButtonLink>
              <ButtonLink href="/science" variant="light" className="w-full sm:w-auto" icon={<ArrowRight size={16} />}>
                探索科学训练
              </ButtonLink>
            </div>

            <div className="mt-11 grid max-w-[540px] grid-cols-3 gap-3 border-t border-white/15 pt-6">
              {[
                { n: `${articles.length}`, l: "篇深度文章" },
                { n: "21", l: "组原创 SVG 图解" },
                { n: "15", l: "组数据图表" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-[27px] font-bold leading-none text-white sm:text-[32px]">{s.n}</div>
                  <div className="mt-1.5 text-[11.5px] text-white/45">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden h-[520px] lg:block xl:h-[560px]">
            <HeroVisual />
          </div>
        </div>

        <div className="shell relative hidden pb-5 lg:block">
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/35">
            <span>PREMIUM FITNESS EDITORIAL × SPORTS SCIENCE × PERFORMANCE LAB</span>
            <span>SCROLL TO EXPLORE ↓</span>
          </div>
        </div>
      </section>

      {/* ================= 核心理念 ================= */}
      <section className="border-b border-line bg-white">
        <div className="shell grid gap-8 py-9 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="eyebrow">OUR BELIEF / 核心理念</div>
            <p className="mt-3 max-w-3xl text-[19px] font-semibold leading-[1.65] text-ink md:text-[22px]">
              「增肌不是把自己练废，而是让身体在正确的<span className="text-brand-dark">刺激</span>、<span className="text-brand-dark">营养</span>和<span className="text-brand-dark">恢复</span>中持续变强。」
            </p>
          </div>
          <Link href="/science" className="inline-flex shrink-0 items-center gap-2 text-[13.5px] font-semibold text-brand-dark">
            理解背后的原理 <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* ================= 原理示意 ================= */}
      <section className="section !pb-0">
        <div className="shell">
          <SectionHeading
            eyebrow="WHY MUSCLE GROWS"
            title="训练有效，需要三个条件同时成立"
            desc="少一个环节，训练就容易变成「很努力，但没有累积」。下面这张图是本站组织全部内容的基本框架。"
          />
          <FigureBlock name="hypertrophy-mechanism" />
        </div>
      </section>

      {/* ================= 六大入口 ================= */}
      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="KNOWLEDGE MAP / 知识地图"
            title="六个入口，搭出完整的增肌体系"
            desc="从完全不懂，到能自己判断、安排、记录和调整训练，按顺序走就行。"
            action={<ButtonLink href="/getting-started" variant="outline" size="sm">查看学习路径 <ArrowRight size={14} /></ButtonLink>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.slice(0, 6).map((c, i) => {
              const Icon = entryIcons[i];
              return (
                <Link key={c.key} href={c.href} className="card card-hover group relative overflow-hidden p-6">
                  <div className="absolute right-4 top-3 font-display text-[52px] font-extrabold leading-none text-ink/[0.045]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                      <Icon size={21} strokeWidth={1.8} />
                    </span>
                    <ArrowUpRight size={18} className="text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                  </div>
                  <div className="mt-5 eyebrow !text-[10px] !text-muted">{c.en}</div>
                  <h3 className="mt-1 text-[21px] font-bold text-ink">{c.label}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.8] text-muted">{c.description}</p>
                  <p className="mt-4 border-t border-line pt-3 text-[12px] leading-relaxed text-muted/85">{c.detail}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 科学观点 / 误区 ================= */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="MYTH BUSTING"
            title="你以为的健身，可能并不科学。"
            desc="每一条都对应一篇有科学依据、说明适用边界与局限的深度文章。观点可以犀利，证据必须老实。"
            action={<ButtonLink href="/search?q=误区" variant="outline" size="sm">浏览更多纠正 <ArrowRight size={14} /></ButtonLink>}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myths.map((m, i) => (
              <Link key={m.id} href={`/articles/${m.slug}`} className="card card-hover group flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <Quote size={20} className="text-brand/45" />
                  <span className="font-display text-[13px] tracking-widest text-muted">{String(i + 1).padStart(2, "0")} / 07</span>
                </div>
                <h3 className="mt-4 text-[17px] font-bold leading-[1.5] text-ink transition group-hover:text-brand-dark">{m.claim}</h3>
                <p className="mt-3 text-[13px] leading-[1.8] text-muted">{m.short}</p>
                <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
                  <Tag tone="brand">{m.verdict}</Tag>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-dark">读深度文章 <ArrowUpRight size={13} /></span>
                </div>
              </Link>
            ))}
            <Link href="/articles" className="card card-hover group flex flex-col items-center justify-center bg-carbon p-6 text-center text-white">
              <Sparkles size={24} className="text-brand" />
              <h3 className="mt-4 text-[17px] font-bold">不靠感觉练</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">全部 {articles.length} 篇深度文章，按频道与标签检索</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">查看文章库 <ArrowUpRight size={14} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 数据可视化 ================= */}
      <section className="section bg-carbon text-white">
        <div className="grid-lines absolute inset-x-0 opacity-30" />
        <div className="shell relative">
          <SectionHeading
            light
            eyebrow="DATA LAB / 让进步看得见"
            title="让训练有依据，让进步看得见。"
            desc="图表不是装饰。每张图都写清统计口径、单位与读图提示——先学会读，再谈优化。"
            action={<ButtonLink href="/lab" variant="light" size="sm">进入数据实验室 <ArrowRight size={14} /></ButtonLink>}
          />
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3">
            <DataLabel>示例数据 · SAMPLE DATA</DataLabel>
            <span className="text-[12.5px] leading-relaxed text-white/60">
              以下全部为教学示例数据，不是用户真实训练记录、不是行业统计、也不是研究测量结果。可在实验室录入自己的数据重绘。
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ChartBlock id="muscle-distribution" compact height={290} />
            <ChartBlock id="weight-progress" compact height={290} />
            <ChartBlock id="volume-trend" compact height={290} />
            <ChartBlock id="protein-meals" compact height={290} />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4">
              <FigureBlock name="training-cycle" />
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4">
              <FigureBlock name="overload-ladder" />
            </div>
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-white/45">
            SVG 图解均为原创教学示意，不代替医学解剖资料或现场教练指导；图中所有数值与曲线为概念示例。
          </p>
        </div>
      </section>

      {/* ================= 金句 ================= */}
      <section className="section !py-14">
        <div className="shell grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-stretch">
          <QuoteCard quote={quote} dark />
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6 md:p-8">
            <div>
              <div className="eyebrow">EDITORIAL VOICE</div>
              <h3 className="mt-2 text-[20px] font-bold text-ink">有观点，但不冒充结论</h3>
              <p className="mt-3 text-[13.5px] leading-[1.85] text-muted">
                「铁与笔记 · 今日训练哲学」全部为本栏原创短句，用来提醒训练中容易忽略的判断，不是研究结论，也不伪造名人名言。
              </p>
            </div>
            <Link href="/science" className="mt-6 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-dark">
              看证据怎么写 <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 精选内容 ================= */}
      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="EDITOR'S PICKS / 首页精选"
            title="这一周，值得先读这些"
            desc="文章、计划、动作、书籍、网站与研究解读，按用途分开陈列。"
            action={<ButtonLink href="/articles" variant="outline" size="sm">全部 {articles.length} 篇文章 <ArrowRight size={14} /></ButtonLink>}
          />

          {/* 本周科学训练精选 */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-6 w-1 rounded bg-brand" />
            <h3 className="text-[18px] font-bold text-ink">本周科学训练精选</h3>
            <span className="text-[12px] text-muted">FEATURED ARTICLES</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {heroArticles.map((a) => <ArticleCard key={a.slug} article={a} variant="feature" />)}
          </div>

          {/* 四栏精选 */}
          <div className="mt-12 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-ink">新手必读</h3>
                <Tag tone="brand">START HERE</Tag>
              </div>
              <div className="mt-2">
                {(beginnerPicks.length ? beginnerPicks : articles.slice(0, 5)).map((a, i) => (
                  <ArticleCard key={a.slug} article={a} variant="compact" index={i + 1} />
                ))}
              </div>
              <Link href="/getting-started" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-dark">进入增肌入门 <ArrowUpRight size={13} /></Link>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2"><h3 className="text-[16px] font-bold text-ink">高质量训练计划</h3><Tag>PLANS</Tag></div>
              {plans.slice(1, 3).map((p) => <PlanCard key={p.slug} plan={p} />)}
              <Link href="/plans" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-dark">浏览全部 {plans.length} 套计划 <ArrowUpRight size={13} /></Link>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2"><h3 className="text-[16px] font-bold text-ink">热门动作图解</h3><Tag>ATLAS</Tag></div>
              {exercises.slice(0, 2).map((e) => <ExerciseCard key={e.slug} exercise={e} />)}
              <Link href="/exercises" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-dark">查看动作图鉴 <ArrowUpRight size={13} /></Link>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2"><h3 className="text-[16px] font-bold text-ink">健身误区纠正</h3><Tag>MYTHS</Tag></div>
              <div className="card p-5">
                {myths.slice(0, 4).map((m, i) => (
                  <Link key={m.id} href={`/articles/${m.slug}`} className="group flex gap-3 border-b border-line py-3 first:pt-0 last:border-0 last:pb-0">
                    <span className="font-display text-[14px] font-bold text-brand/70">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[13.5px] font-medium leading-relaxed text-ink group-hover:text-brand-dark">{m.claim}</span>
                  </Link>
                ))}
              </div>
              <div className="card p-5">
                <div className="eyebrow !text-[10px]">RESEARCH NOTES</div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">读研究要看对象、设计与局限。这里展示的是解读方法示例，不代表最新进展。</p>
              </div>
            </div>
          </div>

          {/* 书籍 / 网站 / 研究解读 */}
          <div className="mt-12 grid gap-10 xl:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-ink">经典健身书籍</h3>
                <Link href="/resources#books" className="text-[12.5px] font-semibold text-brand-dark">书库 <ArrowUpRight size={13} className="inline" /></Link>
              </div>
              <div className="space-y-3">
                {books.slice(0, 2).map((b) => <BookCard key={b.id} book={b} />)}
              </div>
            </div>
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-ink">国际专业网站推荐</h3>
                <Link href="/resources#sites" className="text-[12.5px] font-semibold text-brand-dark">全部资源 <ArrowUpRight size={13} className="inline" /></Link>
              </div>
              <div className="space-y-3">
                {websites.filter((w) => ["pubmed", "sbs", "jissn"].includes(w.id)).slice(0, 2).map((w) => <SiteCard key={w.id} site={w} />)}
              </div>
            </div>
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-ink">研究解读 · 证据卡</h3>
                <Link href="/resources#references" className="text-[12.5px] font-semibold text-brand-dark">参考文献库 <ArrowUpRight size={13} className="inline" /></Link>
              </div>
              <div className="space-y-3">
                {researchPicks.map((r) => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <Tag tone="brand">{r.type}</Tag>
                      <span className="font-display text-[12px] text-muted">{r.year}</span>
                    </div>
                    <h4 className="mt-2 text-[13.5px] font-bold leading-snug text-ink">{r.title}</h4>
                    <p className="mt-1 text-[11.5px] text-muted">{r.authors} · {r.source}</p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{r.finding}</p>
                    <p className="mt-2 border-t border-line pt-2 text-[11.5px] leading-relaxed text-muted"><span className="font-semibold">局限：</span>{r.limitation}</p>
                    {(r.doi || r.url) && (
                      <a href={r.doi ? `https://doi.org/${r.doi}` : r.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-brand-dark hover:underline">
                        {r.doi ? `DOI: ${r.doi}` : "查看来源"} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 工具 ================= */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="TOOLKIT / 实用工具"
            title="算得清楚，才谈得上安排得明白"
            desc="8 个真正可用的计算器与记录器；所有估算都会写明公式、误差与适用边界。"
            action={<ButtonLink href="/tools" variant="outline" size="sm">打开工具箱 <ArrowRight size={14} /></ButtonLink>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t, i) => (
              <Link key={t.key} href={`/tools/${t.key}`} className="card card-hover group p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-2 text-brand-dark">
                    {i % 2 === 0 ? <Calculator size={19} strokeWidth={1.7} /> : <FlaskConical size={19} strokeWidth={1.7} />}
                  </span>
                  <span className="font-display text-[12px] tracking-wider text-muted">{t.en}</span>
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-ink group-hover:text-brand-dark">{t.name}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{t.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11.5px] text-muted">
                  <span>{t.outputs.length} 项输出</span>
                  <ArrowUpRight size={14} className="text-brand" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-white p-6 md:grid-cols-3 md:p-8">
            <div className="flex items-start gap-3">
              <Database size={20} className="mt-0.5 shrink-0 text-brand" />
              <div><h4 className="text-[14.5px] font-bold text-ink">本地优先，结构可扩展</h4><p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">收藏、体重、围度与训练日志保存在浏览器本地；数据结构已预留账号与云端同步接口。</p></div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand" />
              <div><h4 className="text-[14.5px] font-bold text-ink">不承诺，不夸大</h4><p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">估算公式标注误差，补剂区分证据强弱，不提供非法药物方案，不承诺固定时间增长多少肌肉。</p></div>
            </div>
            <div className="flex items-start gap-3">
              <LogoMark size={22} />
              <div><h4 className="text-[14.5px] font-bold text-ink">科学是方向，执行是基础</h4><p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">恢复是进步的保障。把每一次训练记下来，让数据替你回答「到底有没有变强」。</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 底部 CTA ================= */}
      <section className="relative overflow-hidden bg-carbon py-16 text-white md:py-20">
        <div className="grid-lines absolute inset-0 opacity-70" />
        <div className="shell relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="eyebrow eyebrow-light">START TODAY / 从今天开始</div>
            <h2 className="mt-3 max-w-2xl text-[28px] font-bold leading-[1.35] tracking-[-0.02em] md:text-[38px]">
              别再每次重新开始。<br />从第一页开始，把训练变成一套系统。
            </h2>
            <p className="mt-4 text-[14px] text-white/55">一篇文章、一个动作、一张表格，都是可以累积的东西。</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/articles/start-from-zero" variant="primary">读《从零开始增肌》</ButtonLink>
            <ButtonLink href="/plans" variant="light" icon={<ArrowRight size={16} />}>找一套训练计划</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
