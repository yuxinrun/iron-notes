import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Database, BookOpen } from "lucide-react";
import { Logo } from "@/components/brand";
import { channels } from "@/data/categories";
import { tools } from "@/data/tools";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-carbon text-white">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <div className="shell relative">
        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:py-16">
          <div>
            <Logo light />
            <p className="mt-5 font-display text-[38px] font-bold leading-[0.98] tracking-[0.01em] text-white/90 md:text-[46px]">
              TRAIN SMART.<br />
              <span className="text-brand">BUILD STRONG.</span>
            </p>
            <p className="mt-4 text-[14px] text-white/60">练得明白，长得扎实。</p>
            <p className="mt-5 max-w-sm text-[13px] leading-[1.85] text-white/45">
              增肌不是把自己练废，而是让身体在正确的刺激、营养和恢复中持续变强。
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/getting-started" className="btn btn-primary btn-sm">从零开始 <ArrowUpRight size={14} /></Link>
              <Link href="/lab" className="btn btn-ghost-light btn-sm">数据实验室</Link>
            </div>
          </div>

          <div>
            <div className="eyebrow eyebrow-light">KNOWLEDGE / 知识体系</div>
            <ul className="mt-4 space-y-2.5">
              {channels.slice(0, 4).map((c) => (
                <li key={c.key}>
                  <Link href={c.href} className="text-[13.5px] text-white/65 transition hover:text-brand">{c.label}</Link>
                </li>
              ))}
            </ul>
            <div className="eyebrow eyebrow-light mt-7">TOOLS / 常用工具</div>
            <ul className="mt-3 space-y-2.5">
              {tools.slice(0, 4).map((t) => (
                <li key={t.key}>
                  <Link href={`/tools/${t.key}`} className="text-[13.5px] text-white/65 transition hover:text-brand">{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow eyebrow-light">EXPLORE / 更多内容</div>
            <ul className="mt-4 space-y-2.5">
              {channels.slice(4).map((c) => (
                <li key={c.key}>
                  <Link href={c.href} className="text-[13.5px] text-white/65 transition hover:text-brand">{c.label}</Link>
                </li>
              ))}
              <li><Link href="/tools" className="text-[13.5px] text-white/65 transition hover:text-brand">全部计算器</Link></li>
              <li><Link href="/my" className="text-[13.5px] text-white/65 transition hover:text-brand">我的收藏与记录</Link></li>
              <li><Link href="/search" className="text-[13.5px] text-white/65 transition hover:text-brand">全站搜索</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow eyebrow-light">EDITORIAL STANDARD / 内容原则</div>
            <ul className="mt-4 space-y-3 text-[12.5px] leading-[1.7] text-white/55">
              <li className="flex gap-2"><BookOpen size={15} className="mt-0.5 shrink-0 text-brand" />科学文章标注证据等级、研究对象与局限，不把相关性写成因果。</li>
              <li className="flex gap-2"><Database size={15} className="mt-0.5 shrink-0 text-brand" />首页与实验室图表均为示例数据，不代表用户真实记录或行业统计。</li>
              <li className="flex gap-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand" />不提供非法药物方案，不宣传极端节食，不承诺固定时间必然增长多少肌肉。</li>
            </ul>
            <Link href="/resources#standards" className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-brand hover:underline">
              查看完整内容质量标准 <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="border-b border-white/10 py-7">
          <p className="text-[12px] font-semibold text-white/70">健康与安全提示</p>
          <p className="mt-2 max-w-4xl text-[12px] leading-[1.9] text-white/45">
            本站是运动科学知识教育平台，内容不替代医生诊断、康复评估或个体化处方。若出现持续疼痛、关节肿胀、活动明显受限，或患有慢性疾病、处于特殊生理状态，请先咨询医生与具备资质的专业人员。训练请在合理负荷与必要保护下进行。
          </p>
        </div>

        <div className="flex flex-col gap-3 py-6 text-[11.5px] text-white/40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} IRON NOTES 铁与笔记 · 科学是训练的方向，执行是增长的基础，恢复是进步的保障。</span>
          <span className="flex flex-wrap gap-4">
            <Link href="/resources#standards" className="hover:text-white/70">内容标准</Link>
            <Link href="/resources" className="hover:text-white/70">书籍与资源</Link>
            <Link href="/lab" className="hover:text-white/70">数据实验室</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
