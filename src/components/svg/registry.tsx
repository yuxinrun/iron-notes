import type { ReactNode } from "react";
import { BodyMap, AnatomyPanel, anatomyParts } from "@/components/svg/body";
import {
  MovementDiagram,
  TrainingCycleDiagram,
  OverloadLadderDiagram,
  NutritionPlateDiagram,
  HypertrophyMechanismDiagram,
  ProteinDistributionDiagram,
} from "@/components/svg/movements";
import { cn } from "@/lib/utils";

export interface FigureDef {
  title: string;
  category: string;
  note: string;
  render: () => ReactNode;
}

/**
 * 原创 SVG 图解注册表（共 21 组）。
 * 文章、动作详情页、首页与数据实验室通过名称引用，保证视觉风格统一、可复用。
 */
export const figures: Record<string, FigureDef> = {
  "body-front": {
    title: "人体正面主要肌群分区",
    category: "肌群示意",
    note: "分区教学示意，不代替医学解剖资料",
    render: () => <BodyMap view="front" highlight={["chest", "abs", "quads"]} showLegend className="mx-auto max-w-[280px]" />,
  },
  "body-back": {
    title: "人体背面主要肌群分区",
    category: "肌群示意",
    note: "分区教学示意，不代替医学解剖资料",
    render: () => <BodyMap view="back" highlight={["back", "glutes", "hamstrings"]} showLegend className="mx-auto max-w-[280px]" />,
  },
  "chest-anatomy": {
    title: "胸部肌肉解剖分区示意",
    category: "解剖分区",
    note: "教学示意图，肌肉起止点与深层结构请以专业教材为准",
    render: () => <AnatomyPanel part="chest" />,
  },
  "back-anatomy": {
    title: "背部肌肉解剖分区示意",
    category: "解剖分区",
    note: "教学示意图，肌肉起止点与深层结构请以专业教材为准",
    render: () => <AnatomyPanel part="back" />,
  },
  "shoulder-anatomy": {
    title: "肩部肌肉解剖分区示意",
    category: "解剖分区",
    note: "教学示意图，三角肌三束功能不同，训练动作需分别覆盖",
    render: () => <AnatomyPanel part="shoulder" />,
  },
  "arm-anatomy": {
    title: "上肢肌肉解剖分区示意",
    category: "解剖分区",
    note: "教学示意图，不代替医学解剖资料",
    render: () => <AnatomyPanel part="arm" />,
  },
  "leg-anatomy": {
    title: "腿部肌肉解剖分区示意",
    category: "解剖分区",
    note: "教学示意图，不代替医学解剖资料",
    render: () => <AnatomyPanel part="leg" />,
  },
  "core-anatomy": {
    title: "核心肌群分区示意",
    category: "解剖分区",
    note: "教学示意图，腹横肌等深层结构未做解剖学精确表达",
    render: () => <AnatomyPanel part="core" />,
  },
  squat: {
    title: "深蹲动作分解",
    category: "动作分解",
    note: "侧面教学示意，表达关节运动方向；实际动作请在专业指导下学习",
    render: () => <MovementDiagram name="squat" />,
  },
  "bench-press": {
    title: "卧推动作分解",
    category: "动作分解",
    note: "侧面教学示意；杠铃落点、握距与起桥程度需按体型调整",
    render: () => <MovementDiagram name="bench-press" />,
  },
  deadlift: {
    title: "硬拉动作分解",
    category: "动作分解",
    note: "侧面教学示意；杠铃应始终贴近身体垂直移动",
    render: () => <MovementDiagram name="deadlift" />,
  },
  "pull-up": {
    title: "引体向上动作分解",
    category: "动作分解",
    note: "正面教学示意；远侧肢体以浅色表示",
    render: () => <MovementDiagram name="pull-up" />,
  },
  row: {
    title: "俯身划船动作分解",
    category: "动作分解",
    note: "侧面教学示意；躯干角度应全程保持稳定",
    render: () => <MovementDiagram name="row" />,
  },
  "lateral-raise": {
    title: "侧平举动作分解",
    category: "动作分解",
    note: "正面教学示意；抬至与肩齐平即可，避免耸肩代偿",
    render: () => <MovementDiagram name="lateral-raise" />,
  },
  curl: {
    title: "哑铃弯举动作分解",
    category: "动作分解",
    note: "侧面教学示意；上臂位置保持固定",
    render: () => <MovementDiagram name="curl" />,
  },
  pushdown: {
    title: "三头下压动作分解",
    category: "动作分解",
    note: "侧面教学示意；肘部贴近躯干不外飘",
    render: () => <MovementDiagram name="pushdown" />,
  },
  "training-cycle": {
    title: "训练刺激—疲劳—恢复周期",
    category: "原理示意",
    note: "概念曲线，非实测数据；实际恢复时间因动作、容量与个体而异",
    render: () => <TrainingCycleDiagram />,
  },
  "overload-ladder": {
    title: "双重渐进法阶梯示意",
    category: "原理示意",
    note: "示例数据，用于说明「先加次数、再加重量」的执行逻辑",
    render: () => <OverloadLadderDiagram />,
  },
  "nutrition-plate": {
    title: "增肌期餐盘结构",
    category: "营养示意",
    note: "教学示意，具体克数应按体重、训练量与目标计算",
    render: () => <NutritionPlateDiagram />,
  },
  "hypertrophy-mechanism": {
    title: "肌肥大的三个必要条件",
    category: "原理示意",
    note: "概念模型，用于组织决策；不等于严格的因果方程",
    render: () => <HypertrophyMechanismDiagram />,
  },
  "protein-distribution": {
    title: "每日蛋白质分配",
    category: "营养示意",
    note: "示例数据，不代表任何人的真实摄入记录",
    render: () => <ProteinDistributionDiagram />,
  },
};

export const figureNames = Object.keys(figures);

export function FigureBlock({
  name,
  caption,
  className,
}: {
  name: string;
  caption?: string;
  className?: string;
}) {
  const fig = figures[name];
  if (!fig) return null;
  return (
    <figure className={cn("my-9", className)}>
      <div className="overflow-hidden rounded-2xl border border-line bg-white p-3 md:p-5">
        {fig.render()}
      </div>
      <figcaption className="mt-3 border-l-2 border-brand pl-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-[11px] font-bold tracking-[0.16em] text-brand">{fig.category.toUpperCase()}</span>
          <span className="text-[13.5px] font-semibold text-ink">{caption ?? fig.title}</span>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">{fig.note}</p>
      </figcaption>
    </figure>
  );
}

/** 提供「按肌群高亮」的可复用人体图，供动作详情与频道页直接调用 */
export function MuscleHighlightFigure({
  group,
  caption,
}: {
  group: string;
  caption?: string;
}) {
  const mapping: Record<string, { view: "front" | "back"; ids: string[] }> = {
    chest: { view: "front", ids: ["chest"] },
    back: { view: "back", ids: ["back", "traps"] },
    shoulders: { view: "front", ids: ["shoulders"] },
    biceps: { view: "front", ids: ["biceps"] },
    triceps: { view: "back", ids: ["triceps"] },
    forearms: { view: "front", ids: ["forearms"] },
    abs: { view: "front", ids: ["abs", "obliques"] },
    glutes: { view: "back", ids: ["glutes"] },
    quads: { view: "front", ids: ["quads"] },
    hamstrings: { view: "back", ids: ["hamstrings"] },
    calves: { view: "back", ids: ["calves"] },
    compound: { view: "front", ids: ["chest", "quads", "shoulders", "abs"] },
  };
  const cfg = mapping[group] ?? { view: "front" as const, ids: [] as string[] };
  return (
    <figure className="my-0">
      <div className="rounded-2xl border border-line bg-white p-4">
        <div className="mx-auto max-w-[210px]">
          <BodyMap view={cfg.view} highlight={cfg.ids} />
        </div>
      </div>
      <figcaption className="mt-2.5 text-center text-[12px] text-muted">
        {caption ?? "人体肌群分区教学示意 · 橙色为目标区域 · 不代替医学解剖资料"}
      </figcaption>
    </figure>
  );
}

export { anatomyParts };
