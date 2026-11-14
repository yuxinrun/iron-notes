import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { PageIntro, SectionHeading, Tag, ButtonLink, Note } from "@/components/ui";
import { PlanExplorer } from "@/components/plans/PlanExplorer";
import { ChartBlock } from "@/components/charts/ChartBlock";
import { plans } from "@/data/plans";

export const metadata: Metadata = {
  title: "训练计划库",
  description: "按训练水平、每周天数与器械条件筛选可执行训练计划，含周训练表、组数次数、休息、RIR、热身、进阶与减量建议。",
};

export default function PlansPage() {
  return (
    <>
      <PageIntro
        eyebrow="PROGRAM LIBRARY / 训练计划库"
        title="找到一套你能长期执行的安排"
        desc={`收录 ${plans.length} 套计划，覆盖零基础到高级、每周 2–6 练、健身房与家庭器械。每套都给出完整周表、组数次数、休息、RIR、热身、进阶规则与减量建议，支持收藏与完成打卡。`}
        crumbs={[{ label: "训练计划" }]}
        meta={<><Tag tone="brand">{plans.length} 套计划</Tag><Tag tone="dark">支持筛选 / 收藏 / 打卡</Tag></>}
        dark
      />

      <section className="section !pb-8">
        <div className="shell">
          <Note type="warning" title="不要宣称某个计划适合所有人">
            训练经验、身体状况、训练时间、器械条件与恢复能力都会改变答案。下列计划是模板而非个体化处方；有疼痛、伤病、慢性疾病或特殊健康状况者，请先咨询医生与具备资质的专业人员。
          </Note>
          <div className="mt-6"><PlanExplorer /></div>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="VOLUME COMPARISON / 计划对比"
            title="不同计划的周训练量差在哪"
            desc="图表按本站计划库中的示例周表统计有效组（示例数据），用于理解容量分配，不代表研究结论。"
            action={<ButtonLink href="/tools/generator" variant="outline" size="sm" icon={<ArrowRight size={14} />}>生成自己的计划</ButtonLink>}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartBlock id="plan-comparison" editable height={320} />
            <ChartBlock id="frequency-volume" editable height={320} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { t: "按天数选", d: "先诚实评估每周能稳定训练几天，再决定分化方式。缺勤代价高的计划，执行率往往最先崩。" },
              { t: "按容量选", d: "周有效组数比「几分化」更值得关注。升级计划时一次只加约 20–30% 组数。" },
              { t: "按恢复选", d: "连续两周表现下滑，先减单日容量或安排减量周，而不是立刻换计划。" },
            ].map((x) => (
              <div key={x.t} className="card p-5">
                <div className="flex items-center gap-2 text-[14.5px] font-bold text-ink"><Info size={15} className="text-brand" />{x.t}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{x.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/articles/full-body-vs-upper-lower"><Tag>全身训练 vs 上下肢分化</Tag></Link>
            <Link href="/articles/ppl-explained"><Tag>推拉腿完整解析</Tag></Link>
            <Link href="/articles/three-day-plan"><Tag>新手一周三练</Tag></Link>
            <Link href="/articles/four-day-plan"><Tag>新手一周四练</Tag></Link>
          </div>
        </div>
      </section>
    </>
  );
}
