import type { ToolDef } from "@/types";

export const tools: ToolDef[] = [
  {
    key: "calorie",
    name: "每日热量估算器",
    en: "DAILY ENERGY",
    icon: "Flame",
    description: "用 Mifflin-St Jeor 公式估算基础代谢与每日总消耗，给出温和增肌盈余区间。",
    outputs: ["基础代谢 BMR", "每日总消耗 TDEE", "增肌热量区间", "公式与误差说明"],
  },
  {
    key: "protein",
    name: "蛋白质摄入计算器",
    en: "PROTEIN TARGET",
    icon: "Beef",
    description: "按体重、训练水平与目标给出每日蛋白质区间、每餐分配和常见食物对照。",
    outputs: ["每日建议区间 g", "每餐分配示例", "常见食物蛋白含量", "证据边界说明"],
  },
  {
    key: "macros",
    name: "三大营养素计算器",
    en: "MACRO SPLIT",
    icon: "PieChart",
    description: "按热量与比例换算蛋白/碳水/脂肪克数，支持手动微调并校验热量是否守恒。",
    outputs: ["三大营养素克数", "比例与热量校验", "手动微调", "换算公式"],
  },
  {
    key: "volume",
    name: "训练容量计算器",
    en: "TRAINING VOLUME",
    icon: "Layers",
    description: "统计周组数、总次数与单动作负荷参考，并对比不同训练周。",
    outputs: ["周训练组数", "总重复次数", "单动作负荷参考", "周对比与警示"],
  },
  {
    key: "onerm",
    name: "1RM 估算器",
    en: "ONE REP MAX",
    icon: "TrendingUp",
    description: "用 Epley 与 Brzycki 两式给出估算区间及不同次数区间的误差提示。",
    outputs: ["1RM 估算区间", "百分比负荷表", "公式说明", "安全提醒"],
  },
  {
    key: "bmi",
    name: "BMI 与体型指标",
    en: "BODY METRICS",
    icon: "Ruler",
    description: "计算 BMI 并解释其局限：不能用它判断肌肉量或体脂率。",
    outputs: ["BMI 数值", "参考区间", "腰围与围度提示", "局限性说明"],
  },
  {
    key: "progress",
    name: "增肌进度记录器",
    en: "PROGRESS LOG",
    icon: "NotebookPen",
    description: "记录体重、围度与训练表现，本地保存、生成趋势图、导出 JSON。",
    outputs: ["体重/围度记录", "趋势图", "训练表现备注", "数据导出"],
  },
  {
    key: "generator",
    name: "训练计划生成器",
    en: "PLAN BUILDER",
    icon: "SlidersHorizontal",
    description: "按经验、天数、器械、时长与目标生成可编辑的周训练安排。",
    outputs: ["周训练表", "动作与组次建议", "可编辑训练量", "收藏与导出"],
  },
];

export const toolByKey = Object.fromEntries(tools.map((t) => [t.key, t]));
