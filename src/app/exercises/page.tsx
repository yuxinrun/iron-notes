import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageIntro, SectionHeading, Tag, ButtonLink } from "@/components/ui";
import { ExerciseExplorer } from "@/components/exercises/ExerciseExplorer";
import { FigureBlock } from "@/components/svg/registry";
import { exercises } from "@/data/exercises";
import { muscleGroups } from "@/data/muscle-groups";
import { figureNames } from "@/components/svg/registry";

export const metadata: Metadata = {
  title: "动作图鉴",
  description: "按 12 类肌群检索动作，包含起始姿势、动作步骤、呼吸、幅度、常见错误、代偿、调整建议与原创 SVG 图解。",
};

export default function ExercisesPage() {
  return (
    <>
      <PageIntro
        eyebrow="MOVEMENT ATLAS / 动作图鉴"
        title="每个动作，都讲清为什么这样做"
        desc={`收录 ${exercises.length} 个动作，覆盖 ${muscleGroups.length} 类肌群。每个动作独立详情页含完整技术要点与原创矢量图解；所有示意图均为教学示意，不代替现场教练指导。`}
        crumbs={[{ label: "动作图鉴" }]}
        meta={<><Tag tone="brand">{exercises.length} 个动作</Tag><Tag tone="dark">{figureNames.length} 组原创 SVG 图解</Tag></>}
        dark
      />

      <section className="section !pb-8">
        <div className="shell">
          <ExerciseExplorer />
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="shell">
          <SectionHeading
            eyebrow="ORIGINAL FIGURES / 原创矢量图集"
            title="肌群分区与动作分解，都是矢量"
            desc="全部由本站自行绘制，统一线稿风格、支持任意缩放，可按肌群指定高亮颜色；人体结构为教学示意分区，不代表医学解剖结构。"
            action={<ButtonLink href="/lab" variant="outline" size="sm" icon={<ArrowRight size={14} />}>数据实验室</ButtonLink>}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <FigureBlock name="body-front" className="!my-0" />
            <FigureBlock name="body-back" className="!my-0" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <FigureBlock name="squat" className="!my-0" />
            <FigureBlock name="pull-up" className="!my-0" />
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <div className="eyebrow !text-[11px]">FIGURE INDEX / 图解索引</div>
              <h3 className="mt-1.5 text-[17px] font-bold text-ink">共 {figureNames.length} 组原创图解</h3>
              <p className="mt-1.5 text-[12.5px] text-muted">分布于动作详情、深度文章、频道页、首页与数据实验室；以下列出可直接在本页查看的代表类型。</p>
            </div>
            <div className="grid gap-x-6 gap-y-1 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["人体正面肌群分区", "body-front"],
                ["人体背面肌群分区", "body-back"],
                ["胸部 / 背部 / 肩部解剖分区", "chest-anatomy"],
                ["上肢 / 腿部 / 核心解剖分区", "arm-anatomy"],
                ["深蹲 / 卧推 / 硬拉 / 引体", "squat"],
                ["划船 / 侧平举 / 弯举 / 下压", "row"],
                ["训练刺激—恢复周期", "training-cycle"],
                ["双重渐进阶梯 / 营养餐盘", "overload-ladder"],
                ["肌肥大三条件 / 蛋白质分配", "hypertrophy-mechanism"],
              ].map(([label, name], i) => (
                <div key={i} className="flex items-start gap-2 border-b border-line py-2.5 last:border-0">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <div>
                    <div className="text-[13px] font-semibold text-ink">{label}</div>
                    <div className="font-mono text-[11px] text-muted">{name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
