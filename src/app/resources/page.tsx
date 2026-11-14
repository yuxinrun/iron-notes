import type { Metadata } from "next";
import { ExternalLink, BookOpen, ShieldCheck, Database, Search, AlertTriangle, ArrowUpRight } from "lucide-react";
import { PageIntro, SectionHeading, Tag, Note } from "@/components/ui";
import { BookCover } from "@/components/cards";
import { books } from "@/data/books";
import { websites } from "@/data/websites";
import { references } from "@/data/references";

export const metadata: Metadata = {
  title: "书籍与资源",
  description: "可核验的经典训练与营养书目、国内外专业机构与学术数据库入口、参考文献库，以及 IRON NOTES 的内容质量标准与证据分级原则。",
};

const STANDARDS = [
  { icon: <BookOpen size={17} />, t: "标注证据等级", d: "每篇文章标注证据等级、研究对象、结论与局限；机制研究、急性研究与长期干预的结论强度不同，不混为一谈。" },
  { icon: <Database size={17} />, t: "不伪造数字", d: "图表、案例与统计数字一律标注为示例数据；不虚构行业统计、用户案例、名人名言或研究结论。DOI 未经核实就不填写。" },
  { icon: <Search size={17} />, t: "可回溯来源", d: "重要结论给出文献或立场声明入口，区分研究机构、专业科普与个人创作者平台；二次解读不等于原刊结论。" },
  { icon: <ShieldCheck size={17} />, t: "守住健康边界", d: "不把相关性写成因果，不承诺固定时间必然增长多少肌肉，不宣传极端节食，不提供任何非法药物方案。" },
  { icon: <AlertTriangle size={17} />, t: "示例与建议分离", d: "计划、图表、餐盘分配均为教学模板，不是个体化处方；涉及疼痛、伤病、慢性疾病与特殊生理状态时建议寻求专业评估。" },
  { icon: <ExternalLink size={17} />, t: "链接可核验", d: "外部链接按机构官网或权威数据库整理并检查可访问性；403 / 429 常见于站点反爬策略，链接可能随时间变更，请以机构名称检索为准。" },
];

export default function ResourcesPage() {
  return (
    <>
      <PageIntro
        eyebrow="LIBRARY & LINKS / 书籍与资源"
        title="把「听谁说的」也写清楚"
        desc="经典书目、专业机构与学术数据库、可回溯的参考文献，以及本站的内容质量标准。这里不转载他人内容，只提供原创的梳理、判断与入口。"
        crumbs={[{ label: "书籍与资源" }]}
        meta={<><Tag tone="brand">{books.length} 本书目</Tag><Tag tone="brand">{websites.length} 个站点</Tag><Tag tone="dark">{references.length} 条参考文献</Tag></>}
        dark
      />

      {/* 内容标准 */}
      <section id="standards" className="section scroll-mt-24 !pb-10">
        <div className="shell">
          <SectionHeading
            eyebrow="EDITORIAL STANDARD / 内容质量标准"
            title="我们怎样决定一句话能不能写进文章"
            desc="这套标准适用于全站：文章、动作图鉴、训练计划、图表与工具说明。"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {STANDARDS.map((s) => (
              <div key={s.t} className="card p-5">
                <div className="flex items-center gap-2 text-[15px] font-bold text-ink">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">{s.icon}</span>
                  {s.t}
                </div>
                <p className="mt-3 text-[12.5px] leading-[1.85] text-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <Note type="info" title="关于证据等级">
            本站使用四档表述：「充分研究支持」「有一定证据，仍有争议」「主要来自实践经验」「证据尚不充分」。等级描述的是某类结论背后的证据强度，不代表该结论对每个人都成立，也不等同于医学建议。
          </Note>
        </div>
      </section>

      {/* 书籍 */}
      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="BOOKSHELF / 经典书目"
            title="值得反复读的书，和它们各自擅长什么"
            desc="只收录可核验的公开书目信息；中文书名若为直译会明确标注。下方封面为本站排版生成的示意封面，不是出版社原版封面。"
          />
          <div className="space-y-5">
            {books.map((b, i) => (
              <article key={b.id} id={`book-${b.id}`} className="card scroll-mt-24 p-5 md:p-7">
                <div className="grid gap-6 md:grid-cols-[132px_1fr]">
                  <div className="mx-auto w-[112px] md:mx-0 md:w-full"><BookCover book={b} /></div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[12px] tracking-[0.16em] text-brand">{String(i + 1).padStart(2, "0")}</span>
                      <Tag tone="brand">{b.category}</Tag>
                      <Tag>{b.region}</Tag>
                      <Tag>{b.difficulty}</Tag>
                    </div>
                    <h3 className="mt-3 text-[20px] font-bold leading-snug text-ink">{b.title}</h3>
                    {b.titleCn && <p className="mt-1 text-[12.5px] text-muted">{b.titleCn}</p>}
                    <p className="mt-2 text-[12.5px] text-ink-2">
                      {b.authors} · {b.publisher} · {b.year}
                    </p>
                    <p className="mt-4 text-[13.5px] leading-[1.9] text-ink-2">{b.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {b.topics.map((t) => <Tag key={t}>{t}</Tag>)}
                    </div>
                    <div className="mt-5 grid gap-4 border-t border-line pt-4 md:grid-cols-2">
                      <div>
                        <div className="eyebrow !text-[10px]">核心视角</div>
                        <ul className="mt-2 space-y-1.5">
                          {b.viewpoints.map((v) => (
                            <li key={v} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-2">
                              <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/70" />{v}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="eyebrow !text-[10px]">读法建议</div>
                        <p className="mt-2 text-[12.5px] leading-[1.85] text-ink-2">{b.chapters}</p>
                        <div className="mt-3 text-[12.5px] leading-relaxed text-muted">
                          <span className="font-semibold text-ink-2">适合：</span>{b.audience}
                        </div>
                      </div>
                    </div>
                    {b.verifyNote && <p className="mt-4 rounded-lg bg-paper px-3 py-2 text-[11.5px] leading-relaxed text-muted">核验说明：{b.verifyNote}</p>}
                    {b.link && (
                      <a href={b.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-brand-dark hover:underline">
                        出版社 / 官方页面 <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 专业网站 */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="PROFESSIONAL SITES / 专业网站"
            title="按来源类型分辨，而不是只看谁说得响亮"
            desc="严格区分学术数据库、专业机构、研究综述平台、专业科普与个人创作者平台。二次解读请回溯原文。"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {websites.map((s) => (
              <article key={s.id} id={`site-${s.id}`} className="card card-hover scroll-mt-24 flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="eyebrow !text-[10px]">{s.kind}</div>
                  <Tag>{s.region}</Tag>
                </div>
                <h3 className="mt-2 text-[16px] font-bold leading-snug text-ink">{s.name}</h3>
                <p className="mt-2.5 text-[12.5px] leading-[1.8] text-muted">{s.description}</p>
                <div className="mt-4 space-y-2 border-t border-line pt-3.5 text-[12px] leading-relaxed">
                  <p><span className="font-semibold text-ink-2">可信度：</span><span className="text-muted">{s.credibility}</span></p>
                  <p><span className="font-semibold text-ink-2">适合：</span><span className="text-muted">{s.audience}</span></p>
                  <p><span className="font-semibold text-ink-2">入门：</span><span className="text-muted">{s.entry}</span></p>
                  <p><span className="font-semibold text-ink-2">费用：</span><span className="text-muted">{s.paid}</span></p>
                  {s.note && <p className="text-muted">{s.note}</p>}
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-between gap-2 border-t border-line pt-3.5 text-[12.5px] text-brand-dark hover:underline"
                >
                  <span className="truncate">{s.url.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink size={14} className="shrink-0" />
                </a>
              </article>
            ))}
          </div>
          <Note type="warning" title="链接可能失效，机构判断更重要">
            外部站点会改版、迁移或调整访问策略。2026-11 抽查时，部分站点对自动请求返回 403 / 429，这通常是限流或反爬而不是站点不存在；域名与机构归属已按官方信息核对。若链接打不开，请用机构名称自行检索。本站不为第三方站点的内容背书。
          </Note>
        </div>
      </section>

      {/* 参考文献 */}
      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="REFERENCES / 参考文献库"
            title="结论从哪里来，局限在哪里"
            desc="每条都写明研究对象、概括性发现、局限与实际意义。DOI 未经核实的一律不填，改以来源链接或检索入口呈现。"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {references.map((r, i) => {
              const href = r.url ?? (r.doi ? `https://doi.org/${r.doi}` : `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(r.title)}`);
              return (
                <article key={r.id} className="card flex flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[12px] tracking-[0.14em] text-brand">REF {String(i + 1).padStart(2, "0")}</span>
                    <Tag>{r.type}</Tag>
                    <Tag tone="brand">{r.year}</Tag>
                  </div>
                  <h3 className="mt-2.5 text-[14.5px] font-bold leading-snug text-ink">{r.title}</h3>
                  <p className="mt-1.5 text-[12px] text-muted">{r.authors} · {r.source}</p>
                  <div className="mt-4 space-y-2 text-[12.5px] leading-[1.8]">
                    <p><span className="font-semibold text-ink-2">研究对象 / 范围：</span><span className="text-muted">{r.population}</span></p>
                    <p><span className="font-semibold text-ink-2">概括性发现：</span><span className="text-muted">{r.finding}</span></p>
                    <p><span className="font-semibold text-ink-2">局限：</span><span className="text-muted">{r.limitation}</span></p>
                    <p><span className="font-semibold text-ink-2">实际意义：</span><span className="text-muted">{r.practical}</span></p>
                  </div>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 border-t border-line pt-3.5 text-[12px] text-brand-dark hover:underline">
                    {r.doi ? `DOI ${r.doi}` : "查看来源 / 检索入口"} <ArrowUpRight size={13} />
                  </a>
                </article>
              );
            })}
          </div>
          <p className="mt-6 text-[12px] leading-relaxed text-muted">
            上列「概括性发现」为本站编辑部的转述，不是原刊结论的逐字引用；请结合原文与局限一起理解，不要把它当作个体化建议。
          </p>
        </div>
      </section>
    </>
  );
}
