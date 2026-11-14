import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Database, LineChart, ShieldCheck, ArrowUpRight } from "lucide-react";
import { PageIntro, SectionHeading, Tag, Note, ButtonLink } from "@/components/ui";
import { LabExplorer } from "@/components/lab/LabExplorer";
import { charts } from "@/components/charts/registry";

export const metadata: Metadata = {
  title: "数据实验室",
  description: "15 组 ECharts 图表，覆盖训练量、进步、强度、身体数据、营养、计划与恢复；全部标注统计口径与示例数据，并可录入自己的记录重绘。",
};

export default function LabPage() {
  return (
    <>
      <PageIntro
        eyebrow="DATA LAB / 数据实验室"
        title="先学会读图，再谈进步"
        desc={`${charts.length} 组图表把训练里最容易被感觉带偏的变量放到同一套坐标里：周组数、负荷变化、RIR、体重均线、蛋白质分配、计划容量对比与长期趋势。所有内置数值都是示例数据，每张图都写明单位、统计口径与读图提示，也可以录入自己的记录重绘。`}
        crumbs={[{ label: "数据实验室" }]}
        meta={<><Tag tone="brand">{charts.length} 组图表</Tag><Tag tone="dark">示例数据 / 可录入</Tag></>}
        dark
      />

      <section className="section !pb-10">
        <div className="shell">
          <Note type="warning" title="示例数据不是研究结论，也不是你的记录">
            图中的数值是为演示统计口径与读图方法构造的示例，不代表任何用户真实数据、行业统计或研究结果。相关性不等于因果：两条线一起变化，只能提供线索，不能证明谁导致了谁。
          </Note>
          <div className="mt-8"><LabExplorer /></div>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="HOW TO READ / 读图方法"
            title="四个比数字本身更重要的问题"
            desc="图表最容易误导人的地方，不是画得不好看，而是口径不清、尺度不明、把噪声当趋势。"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: <Database size={18} />, t: "统计口径是什么", d: "有效组怎么算？热身组算不算？不同动作能不能相加？口径不同的两个数字不能放在一起比较。" },
              { icon: <BarChart3 size={18} />, t: "单位与尺度", d: "纵轴是否从零开始、用了几个坐标轴、是绝对值还是相对百分比，都会显著改变视觉印象。" },
              { icon: <LineChart size={18} />, t: "看趋势，不看单点", d: "体重、表现与疲劳都有日常波动。至少 2–3 周的均线方向，比某一天的新高或新低更有信息量。" },
              { icon: <ShieldCheck size={18} />, t: "先排除混杂因素", d: "睡眠缩短、饮食变化、动作改动都可能同时影响表现。图表给出线索，解释仍需结合训练日志。" },
            ].map((x) => (
              <div key={x.t} className="card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-carbon text-white">{x.icon}</span>
                <h3 className="mt-4 text-[15.5px] font-bold text-ink">{x.t}</h3>
                <p className="mt-2 text-[12.5px] leading-[1.85] text-muted">{x.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-white p-5 md:p-7">
            <div className="eyebrow !text-[11px]">CHART INDEX / 图表索引</div>
            <h3 className="mt-2 text-[19px] font-bold text-ink">这里收录了哪些口径</h3>
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[720px] text-left text-[12.5px]">
                <thead className="bg-carbon text-white">
                  <tr>
                    <th className="px-3.5 py-2.5 font-semibold">图表</th>
                    <th className="px-3.5 py-2.5 font-semibold">类别</th>
                    <th className="px-3.5 py-2.5 font-semibold">单位</th>
                    <th className="px-3.5 py-2.5 font-semibold">统计口径</th>
                  </tr>
                </thead>
                <tbody>
                  {charts.map((c, i) => (
                    <tr key={c.id} className={i % 2 ? "bg-paper/50" : "bg-white"}>
                      <td className="px-3.5 py-2.5 font-medium text-ink">{c.title}</td>
                      <td className="px-3.5 py-2.5"><Tag>{c.category}</Tag></td>
                      <td className="px-3.5 py-2.5 text-ink-2">{c.unit}</td>
                      <td className="px-3.5 py-2.5 leading-relaxed text-muted">{c.methodology}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-6 py-5">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-ink">想用自己的数据画图？</p>
              <p className="mt-1 text-[13px] text-muted">在「增肌进度记录器」记录体重与围度，趋势图会自动使用你自己的记录；每张图也支持直接录入数值，数据只保存在本机浏览器。</p>
            </div>
            <ButtonLink href="/tools/progress" variant="outline" size="sm">进度记录器</ButtonLink>
            <ButtonLink href="/tools/volume" variant="dark" size="sm">容量计算器</ButtonLink>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/articles/weekly-sets"><Tag>周组数</Tag></Link>
            <Link href="/articles/progressive-overload"><Tag>渐进超负荷</Tag></Link>
            <Link href="/articles/no-progress-six-months"><Tag>半年没进步</Tag></Link>
            <Link href="/articles/plateau"><Tag>平台期</Tag></Link>
            <Link href="/articles/sleep"><Tag>睡眠与恢复</Tag></Link>
            <Link href="/my" className="inline-flex items-center gap-1 text-[12.5px] text-brand-dark hover:underline">管理我的记录 <ArrowUpRight size={13} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
