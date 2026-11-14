import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Database, ArrowUpRight } from "lucide-react";
import { PageIntro, Note, Tag, SectionHeading } from "@/components/ui";
import { MyDashboard, type MyIndexEntry } from "@/components/my/MyDashboard";
import { getAllArticles } from "@/lib/content";
import { exercises } from "@/data/exercises";
import { plans } from "@/data/plans";
import { channelLabel } from "@/data/categories";

export const metadata: Metadata = {
  title: "我的收藏与记录",
  description: "集中管理本机保存的收藏、训练计划打卡、身体记录、训练日志与生成的计划，可整体导出 JSON 备份。",
};

export default function MyPage() {
  const index: Record<string, MyIndexEntry> = {};

  for (const a of getAllArticles()) {
    index[`article:${a.slug}`] = { title: a.title, href: `/articles/${a.slug}`, channel: channelLabel(a.channel) };
  }
  for (const e of exercises) {
    index[`exercise:${e.slug}`] = { title: e.name, href: `/exercises/${e.slug}`, channel: `${e.pattern} · ${e.equipment}` };
  }
  for (const p of plans) {
    index[`plan:${p.slug}`] = { title: p.name, href: `/plans/${p.slug}`, channel: `${p.split} · 每周 ${p.daysPerWeek} 练` };
  }

  return (
    <>
      <PageIntro
        eyebrow="MY SPACE / 我的收藏与记录"
        title="把散落在各处的记录收在一起"
        desc="收藏、训练打卡、体重围度、训练日志与生成的计划，都保存在这台设备的浏览器里。这里提供统一查看、导出备份与清空入口——不登录、不上传、不追踪。"
        crumbs={[{ label: "我的收藏与记录" }]}
        meta={<><Tag tone="brand">本地优先</Tag><Tag tone="dark">可导出 JSON</Tag></>}
        dark
      />

      <section className="section !pb-10">
        <div className="shell">
          <Note type="info" title="数据在哪里">
            本站没有账号系统，也不会把记录发送到服务器。所有内容通过浏览器本地存储保存，因此换浏览器、换设备或清除站点数据后会丢失。建议定期用下方「导出全部数据」做一份备份。
          </Note>
          <div className="mt-7"><MyDashboard index={index} /></div>
        </div>
      </section>

      <section className="section bg-paper-2 !py-14">
        <div className="shell">
          <SectionHeading
            eyebrow="NEXT / 接下来"
            title="记录是为了回答更好的问题"
            desc="数据本身不是目的，把它和正确的观察窗口结合起来才有意义。"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <div className="flex items-center gap-2 text-[15px] font-bold text-ink"><Database size={17} className="text-brand" />用趋势看，不用单日看</div>
              <p className="mt-2 text-[12.5px] leading-[1.85] text-muted">体重、表现与疲劳都有日常波动。至少 2–3 周的均线方向，配合围度与同动作表现，才值得据此调整热量或训练量。</p>
              <Link href="/lab" className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-brand-dark hover:underline">去数据实验室 <ArrowUpRight size={13} /></Link>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2 text-[15px] font-bold text-ink"><ShieldCheck size={17} className="text-brand" />健康边界</div>
              <p className="mt-2 text-[12.5px] leading-[1.85] text-muted">本站内容不替代医生诊断、康复评估或个体化处方。持续疼痛、关节肿胀、活动受限或有慢性疾病者，请先咨询医生与具备资质的专业人员。</p>
              <Link href="/resources#standards" className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-brand-dark hover:underline">查看内容标准 <ArrowUpRight size={13} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
