import type { EChartsOption } from "echarts";

/**
 * 数据实验室图表注册表。
 * 所有内置数值均为「示例数据」，用于演示统计口径与读图方法，
 * 不代表用户真实记录、行业统计或研究结果。
 */

export interface ChartSeries {
  name: string;
  data: number[];
  color: string;
  type?: "bar" | "line" | "scatter";
  area?: boolean;
  smooth?: boolean;
  stack?: string;
  yAxisIndex?: number;
  symbolSize?: number;
}

export interface ChartDef {
  id: string;
  title: string;
  en: string;
  category: string;
  description: string;
  methodology: string;
  unit: string;
  axisLabel: string;
  axis: string[];
  series: ChartSeries[];
  kind: "cartesian" | "pie" | "radar" | "heatmap";
  yAxisName?: string;
  secondaryUnit?: string;
  emptyHint: string;
  insight: string;
}

const C = {
  brand: "#e0532a",
  teal: "#2f6f6b",
  amber: "#d98324",
  blue: "#4c6ef5",
  rose: "#a84a6a",
  olive: "#7c8a3c",
  steel: "#8b959d",
  ink: "#14171a",
};

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export const charts: ChartDef[] = [
  {
    id: "muscle-distribution",
    title: "一周肌群训练分布",
    en: "WEEKLY MUSCLE DISTRIBUTION",
    category: "训练量",
    description: "把每周总训练组数按肌群拆开，检查是否有部位被完全忽略或过度集中。",
    methodology: "按动作的主要目标肌群计入「有效组」；一个动作只计入一个主肌群，协同肌不重复计数。",
    unit: "组 / 周",
    axisLabel: "肌群",
    axis: ["胸", "背", "肩", "股四头", "臀腘", "手臂", "小腿", "核心"],
    series: [{ name: "周组数", data: [12, 14, 10, 12, 10, 8, 6, 4], color: C.brand, type: "bar" }],
    kind: "pie",
    emptyHint: "尚未录入任何训练组数，请先记录一周训练后再查看分布。",
    insight: "示例计划把最多容量给了背与胸；手臂、小腿、核心多半由复合动作附带刺激。",
  },
  {
    id: "sets-by-muscle",
    title: "各肌群训练组数对比",
    en: "SETS BY MUSCLE GROUP",
    category: "训练量",
    description: "用横向条形比较各肌群的周有效组数，快速识别容量缺口。",
    methodology: "仅统计目标肌群承受主要张力的正式组；热身组、递减组末段不单独计入。",
    unit: "组 / 周",
    axisLabel: "肌群",
    axis: ["胸", "背", "肩中束", "肩后束", "肱二头", "肱三头", "股四头", "腘绳", "臀", "小腿", "腹"],
    series: [{ name: "周有效组数", data: [12, 14, 10, 6, 6, 8, 12, 8, 8, 6, 4], color: C.teal, type: "bar" }],
    kind: "cartesian",
    emptyHint: "没有可比较的组数数据。",
    insight: "肩后束、小腿与腹部最常在计划里被漏掉；缺口小不等于必须立刻补满，先看恢复。",
  },
  {
    id: "volume-trend",
    title: "训练容量变化趋势",
    en: "WEEKLY VOLUME TREND",
    category: "训练量",
    description: "跟踪 8 周内周训练容量的变化，观察是否在合理范围内缓慢上升。",
    methodology: "容量 = Σ（组数 × 次数 × 该动作重量），仅在同一动作内跨周比较；不同动作的重量不可直接相加后称作肌肥大刺激。",
    unit: "kg·次（单动作口径）",
    axisLabel: "训练周",
    axis: WEEKS,
    series: [
      { name: "卧推容量", data: [2160, 2280, 2340, 2100, 2460, 2520, 2640, 2700], color: C.brand, type: "line", smooth: true, area: true },
      { name: "深蹲容量", data: [3200, 3360, 3400, 2900, 3520, 3600, 3680, 3800], color: C.teal, type: "line", smooth: true },
    ],
    kind: "cartesian",
    yAxisName: "kg·次",
    emptyHint: "还没有训练日志，容量趋势无从计算。",
    insight: "W4 的回落是示例减量周。容量不是越高越好，要看表现能否同步恢复。",
  },
  {
    id: "weight-progress",
    title: "训练重量进步曲线",
    en: "LOAD PROGRESSION",
    category: "进步",
    description: "以同一动作、同一次数区间的重量变化判断长期进步，比单次「破了纪录」更可靠。",
    methodology: "记录每个动作在固定次数（示例为 5 次）下可稳定完成的重量；换算口径为训练日志中的实际使用重量。",
    unit: "kg",
    axisLabel: "训练周",
    axis: WEEKS,
    series: [
      { name: "卧推 5 次", data: [60, 60, 62.5, 62.5, 65, 65, 67.5, 67.5], color: C.brand, type: "line", smooth: true },
      { name: "深蹲 5 次", data: [90, 92.5, 92.5, 95, 95, 97.5, 100, 100], color: C.teal, type: "line", smooth: true },
      { name: "硬拉 5 次", data: [110, 110, 112.5, 115, 115, 117.5, 117.5, 120], color: C.amber, type: "line", smooth: true },
    ],
    kind: "cartesian",
    yAxisName: "kg",
    emptyHint: "尚未记录任何动作的使用重量。",
    insight: "新手阶段的进步常是阶梯式：连续几周不动，然后上一个台阶。这属于正常波动。",
  },
  {
    id: "reps-trend",
    title: "同重量下训练次数趋势",
    en: "REPS AT FIXED LOAD",
    category: "进步",
    description: "固定重量时，次数增加本身就是渐进超负荷，不必每次都加片。",
    methodology: "取每个训练周该动作第一组的完成次数；重量保持 60 kg（示例）。",
    unit: "次",
    axisLabel: "训练周",
    axis: WEEKS,
    series: [
      { name: "第 1 组次数", data: [6, 7, 7, 8, 8, 9, 9, 10], color: C.blue, type: "bar" },
      { name: "同重量参考线", data: [8, 8, 8, 8, 8, 8, 8, 8], color: C.steel, type: "line", smooth: false },
    ],
    kind: "cartesian",
    yAxisName: "次",
    emptyHint: "没有次数记录。",
    insight: "当所有组都达到次数上限且 RIR 仍充足，才考虑加重量——这就是双重渐进。",
  },
  {
    id: "rir-rpe",
    title: "RIR 与 RPE 训练强度示意",
    en: "PROXIMITY TO FAILURE",
    category: "强度",
    description: "把主观强度量表放在同一张图上：RIR 越低，RPE 越高，越接近力竭。",
    methodology: "示例按组内 8 个连续组的假想记录绘制；RPE 采用抗阻训练专用 RPE 量表（RPE = 10 − RIR）。",
    unit: "RIR（次） / RPE（0–10）",
    axisLabel: "组内序号 / 组",
    axis: ["第1组", "第2组", "第3组", "第4组", "第5组", "第6组", "第7组", "第8组"],
    series: [
      { name: "RIR（剩余次数）", data: [4, 3, 3, 2, 2, 1, 1, 0], color: C.brand, type: "bar" },
      { name: "RPE（主观强度）", data: [6, 7, 7, 8, 8, 9, 9, 10], color: C.teal, type: "line", smooth: true },
    ],
    kind: "cartesian",
    yAxisName: "RIR / RPE",
    emptyHint: "没有强度记录。",
    insight: "RIR 是估计值，尤其新手在远离力竭时容易高估；把它当趋势用，不要当精确仪器。",
  },
  {
    id: "bodyweight-trend",
    title: "增肌体重变化趋势",
    en: "BODY WEIGHT TREND",
    category: "身体数据",
    description: "用日体重与 7 日均线观察增重速率，避免被单日水分波动带偏。",
    methodology: "每日晨起排空后称重；7 日均线为前后共 7 个测量值的算术平均。示例展示 14 天。",
    unit: "kg",
    axisLabel: "日期",
    axis: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14"],
    series: [
      { name: "日体重", data: [70.2, 70.6, 70.3, 70.8, 71.0, 70.7, 70.9, 71.2, 71.0, 71.4, 71.3, 71.6, 71.4, 71.7], color: C.steel, type: "line" },
      { name: "7 日均线", data: [70.2, 70.4, 70.5, 70.6, 70.7, 70.8, 70.7, 70.9, 71.0, 71.1, 71.1, 71.2, 71.3, 71.4], color: C.brand, type: "line", smooth: true },
    ],
    kind: "cartesian",
    yAxisName: "kg",
    emptyHint: "还没有体重记录，可在「增肌进度记录器」里添加。",
    insight: "单日上下 0.5 kg 常常只是水分与胃肠内容物；判断热量是否合适要看均线斜率。",
  },
  {
    id: "weight-girth",
    title: "体重与围度变化",
    en: "WEIGHT & GIRTH",
    category: "身体数据",
    description: "把体重与围度放在同一时间轴上，区分「长了什么」而不是只看总重。",
    methodology: "同一时段、同一体位、同一测量者条件下测围度；腰围上升过快通常提示热量盈余偏大。",
    unit: "kg / cm",
    axisLabel: "月份",
    axis: MONTHS.slice(0, 8),
    series: [
      { name: "体重 (kg)", data: [70.0, 70.6, 71.1, 71.7, 72.2, 72.6, 73.1, 73.5], color: C.brand, type: "line", smooth: true },
      { name: "臂围 (cm)", data: [32.0, 32.2, 32.4, 32.6, 32.9, 33.0, 33.2, 33.4], color: C.blue, type: "line", smooth: true, yAxisIndex: 1 },
      { name: "腰围 (cm)", data: [76.0, 76.2, 76.5, 76.8, 77.2, 77.4, 77.6, 78.0], color: C.teal, type: "line", smooth: true, yAxisIndex: 1 },
    ],
    kind: "cartesian",
    yAxisName: "kg",
    secondaryUnit: "cm",
    emptyHint: "体重或围度记录不足，至少各需要 2 个时间点。",
    insight: "腰围与体重同步快速上升时，先复核热量盈余，而不是急着加训练量。",
  },
  {
    id: "protein-meals",
    title: "每日蛋白质摄入分布",
    en: "DAILY PROTEIN DISTRIBUTION",
    category: "营养",
    description: "检查全天蛋白是否被合理分摊，而不是集中在一顿里。",
    methodology: "按各餐食物标签与生重估算蛋白质克数；加工熟重与生重差异会带来误差。",
    unit: "g 蛋白质",
    axisLabel: "餐次",
    axis: ["早餐", "午餐", "加餐", "晚餐", "睡前"],
    series: [
      { name: "蛋白质 (g)", data: [32, 45, 25, 42, 20], color: C.rose, type: "bar" },
      { name: "每餐参考 30 g", data: [30, 30, 30, 30, 30], color: C.steel, type: "line" },
    ],
    kind: "cartesian",
    yAxisName: "g",
    emptyHint: "没有饮食记录。",
    insight: "全天总量优先；均匀分配是「更容易达标」的策略，不是硬性生理上限。",
  },
  {
    id: "macro-ratio",
    title: "碳水 / 蛋白质 / 脂肪热量比例",
    en: "MACRONUTRIENT SPLIT",
    category: "营养",
    description: "用热量占比检查三大营养素结构是否合理。",
    methodology: "按蛋白质 4 kcal/g、碳水 4 kcal/g、脂肪 9 kcal/g 换算为热量后计算占比。",
    unit: "% 总热量",
    axisLabel: "营养素",
    axis: ["碳水化合物", "蛋白质", "脂肪"],
    series: [{ name: "热量占比", data: [48, 27, 25], color: C.amber, type: "bar" }],
    kind: "pie",
    emptyHint: "没有宏量营养素记录。",
    insight: "比例只是结果，不是目标；真正要守住的是按体重估算的蛋白与脂肪克数下限。",
  },
  {
    id: "frequency-volume",
    title: "训练频率与周训练容量",
    en: "FREQUENCY × VOLUME",
    category: "计划",
    description: "示意不同每周训练天数下可舒适完成的周总组数区间。",
    methodology: "以单个训练日的时长与恢复能力为约束的概念示意；非研究结论，非推荐处方。",
    unit: "组 / 周",
    axisLabel: "每周训练天数",
    axis: ["2 天", "3 天", "4 天", "5 天", "6 天"],
    series: [
      { name: "可完成周组数（示例下限）", data: [14, 20, 26, 30, 34], color: C.teal, type: "bar", stack: "v" },
      { name: "可完成周组数（示例上限）", data: [6, 8, 10, 12, 14], color: C.brand, type: "bar", stack: "v" },
    ],
    kind: "cartesian",
    yAxisName: "组 / 周",
    emptyHint: "没有频率与容量数据。",
    insight: "频率提高不等于容量必须同步提高；能恢复的容量才是有效容量。",
  },
  {
    id: "performance-recovery",
    title: "训练表现与恢复记录",
    en: "PERFORMANCE & RECOVERY",
    category: "恢复",
    description: "把表现、睡眠与主观疲劳放在一起，寻找「练不上去」的原因。",
    methodology: "表现以同重量下次数相对基线百分比表示；睡眠为小时数，疲劳为主观 1–10 评分。",
    unit: "% / 小时 / 分",
    axisLabel: "训练周",
    axis: WEEKS,
    series: [
      { name: "表现指数 (%)", data: [100, 102, 103, 96, 101, 104, 105, 107], color: C.brand, type: "line", smooth: true },
      { name: "睡眠 (小时)", data: [7.5, 7.2, 7.0, 5.8, 7.4, 7.6, 7.5, 7.8], color: C.blue, type: "bar", yAxisIndex: 1 },
      { name: "主观疲劳 (1–10)", data: [4, 5, 5, 8, 5, 4, 4, 3], color: C.steel, type: "line", smooth: true },
    ],
    kind: "cartesian",
    yAxisName: "% / 分",
    secondaryUnit: "小时",
    emptyHint: "表现、睡眠或疲劳记录不足。",
    insight: "示例中 W4 表现下滑与睡眠缩短同时出现；这只是提示线索，不能据此推断因果。",
  },
  {
    id: "plan-comparison",
    title: "不同训练计划的周训练量对比",
    en: "PROGRAM VOLUME COMPARISON",
    category: "计划",
    description: "比较几种常见分化在各肌群上的周有效组数差异。",
    methodology: "按本站计划库中的示例周表统计有效组；不同计划的动作归类口径可能略有差异。",
    unit: "组 / 周",
    axisLabel: "肌群",
    axis: ["胸", "背", "肩", "股四头", "臀腘", "手臂"],
    series: [
      { name: "一周三练全身", data: [9, 9, 6, 9, 9, 6], color: C.brand, type: "bar" },
      { name: "上下肢四练", data: [12, 12, 10, 12, 10, 10], color: C.teal, type: "bar" },
      { name: "推拉腿六练", data: [14, 14, 14, 12, 12, 12], color: C.amber, type: "bar" },
    ],
    kind: "cartesian",
    yAxisName: "组 / 周",
    emptyHint: "没有计划数据。",
    insight: "高天数计划的总容量更高，但也更需要恢复能力；不是所有人都该往高处选。",
  },
  {
    id: "exercise-muscle",
    title: "不同动作对各肌群的训练分布",
    en: "MOVEMENT × MUSCLE",
    category: "动作",
    description: "概念示意：不同动作对同一肌群的相对参与程度，用于理解动作搭配。",
    methodology: "以 0–5 的相对等级表达「主要 / 协同参与」的教学判断，非肌电实测值，不可当作量化刺激。",
    unit: "相对参与等级（0–5）",
    axisLabel: "动作",
    axis: ["卧推", "划船", "深蹲", "硬拉", "侧平举"],
    series: [
      { name: "胸", data: [5, 0, 0, 0, 0], color: C.brand, type: "bar", stack: "m" },
      { name: "背", data: [0, 5, 0, 3, 0], color: C.teal, type: "bar", stack: "m" },
      { name: "肩", data: [2, 2, 0, 0, 5], color: C.amber, type: "bar", stack: "m" },
      { name: "腿 / 臀", data: [0, 0, 5, 5, 0], color: C.blue, type: "bar", stack: "m" },
      { name: "手臂", data: [3, 3, 0, 1, 0], color: C.rose, type: "bar", stack: "m" },
    ],
    kind: "cartesian",
    yAxisName: "相对等级",
    emptyHint: "没有动作数据。",
    insight: "堆叠高度不代表「刺激总量」，只表示参与范围；比较训练量请用组数而不是这个等级。",
  },
  {
    id: "long-term-progress",
    title: "长期训练进步趋势",
    en: "12-MONTH PROGRESS",
    category: "进步",
    description: "以年为尺度看力量与体重的变化，理解「进步会变慢」是规律而非失败。",
    methodology: "示例为同一训练者假想的月度记录：力量取三大项 5 次重量之和，体重取当月均值。",
    unit: "kg / 指数",
    axisLabel: "月份",
    axis: MONTHS,
    series: [
      { name: "三大项 5 次重量之和 (kg)", data: [260, 272, 283, 290, 298, 305, 310, 316, 320, 325, 328, 332], color: C.brand, type: "line", smooth: true, area: true },
      { name: "体重 (kg)", data: [70.0, 70.6, 71.2, 71.8, 72.3, 72.7, 73.0, 73.4, 73.8, 74.1, 74.3, 74.6], color: C.teal, type: "line", smooth: true, yAxisIndex: 1 },
    ],
    kind: "cartesian",
    yAxisName: "kg",
    secondaryUnit: "kg",
    emptyHint: "需要至少两个月的记录才能看出趋势。",
    insight: "前 3 个月斜率最陡，之后逐渐放缓；用「半年后能否稳定举起更多」评价进步更公平。",
  },
];

export const chartById = Object.fromEntries(charts.map((c) => [c.id, c]));
export const chartCategories = ["全部", ...Array.from(new Set(charts.map((c) => c.category)))];

const baseTextStyle = {
  fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
  color: "#6c737a",
  fontSize: 11,
};

function cartesianOption(def: ChartDef, values: Record<string, number[]>): EChartsOption {
  const hasSecondary = def.series.some((s) => s.yAxisIndex === 1);
  return {
    textStyle: baseTextStyle,
    grid: { left: 12, right: hasSecondary ? 16 : 20, top: 46, bottom: 12, containLabel: true },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#14171a",
      borderWidth: 0,
      textStyle: { color: "#f7f5f0", fontSize: 12 },
      axisPointer: { type: "line", lineStyle: { color: "rgba(224,83,42,.5)" } },
      valueFormatter: (v) => `${v ?? "—"} ${def.unit}`,
    },
    legend: {
      top: 4,
      left: 0,
      itemWidth: 12,
      itemHeight: 8,
      itemGap: 14,
      textStyle: { ...baseTextStyle, color: "#343a3f" },
      data: def.series.map((s) => s.name),
    },
    xAxis: {
      type: "category",
      data: def.axis,
      name: def.axisLabel,
      nameLocation: "end",
      nameGap: 8,
      nameTextStyle: { color: "#8b959d", fontSize: 10, align: "right" },
      axisLine: { lineStyle: { color: "#d8d3c9" } },
      axisTick: { show: false },
      axisLabel: { color: "#6c737a", fontSize: 10.5, interval: 0, rotate: def.axis.length > 10 ? 32 : 0 },
    },
    yAxis: hasSecondary
      ? [
          { type: "value", name: def.yAxisName ?? def.unit, nameTextStyle: { color: "#8b959d", fontSize: 10 }, splitLine: { lineStyle: { color: "#eeeae2" } }, axisLabel: { color: "#6c737a", fontSize: 10.5 } },
          { type: "value", name: def.secondaryUnit ?? "", nameTextStyle: { color: "#8b959d", fontSize: 10 }, splitLine: { show: false }, axisLabel: { color: "#6c737a", fontSize: 10.5 } },
        ]
      : { type: "value", name: def.yAxisName ?? def.unit, nameTextStyle: { color: "#8b959d", fontSize: 10 }, splitLine: { lineStyle: { color: "#eeeae2" } }, axisLabel: { color: "#6c737a", fontSize: 10.5 } },
    series: def.series.map((s) => {
      const data = values[s.name] ?? s.data;
      const common = {
        name: s.name,
        data,
        itemStyle: { color: s.color, borderRadius: s.type === "bar" ? [3, 3, 0, 0] : 0 },
        yAxisIndex: s.yAxisIndex ?? 0,
        stack: s.stack,
      };
      if (s.type === "bar") {
        return { ...common, type: "bar" as const, barMaxWidth: 26, barGap: "18%" };
      }
      return {
        ...common,
        type: "line" as const,
        smooth: Boolean(s.smooth),
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 2.4, color: s.color },
        areaStyle: s.area ? { color: s.color, opacity: 0.1 } : undefined,
      };
    }),
  };
}

function pieOption(def: ChartDef, values: Record<string, number[]>): EChartsOption {
  const s = def.series[0];
  const data = values[s.name] ?? s.data;
  const palette = [C.brand, C.teal, C.amber, C.blue, C.rose, C.olive, "#9aa3aa", "#c3bcb0"];
  return {
    textStyle: baseTextStyle,
    tooltip: {
      trigger: "item",
      backgroundColor: "#14171a",
      borderWidth: 0,
      textStyle: { color: "#f7f5f0", fontSize: 12 },
      formatter: (p: unknown) => {
        const q = p as { name: string; value: number; percent: number };
        return `${q.name}<br/><b>${q.value} ${def.unit}</b> (${q.percent}%)`;
      },
    },
    legend: { bottom: 0, left: "center", itemWidth: 10, itemHeight: 8, textStyle: { ...baseTextStyle, color: "#343a3f" } },
    series: [
      {
        name: s.name,
        type: "pie",
        radius: ["42%", "68%"],
        center: ["50%", "46%"],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: "#fff", borderWidth: 2, borderRadius: 4 },
        label: { show: true, formatter: "{b}\n{d}%", fontSize: 11, color: "#343a3f", lineHeight: 16 },
        data: def.axis.map((label, i) => ({ name: label, value: data[i] ?? 0, itemStyle: { color: palette[i % palette.length] } })),
      },
    ],
  };
}

export function buildOption(def: ChartDef, values?: Record<string, number[]>): EChartsOption {
  const v = values ?? {};
  return def.kind === "pie" ? pieOption(def, v) : cartesianOption(def, v);
}

export function isChartEmpty(def: ChartDef, values?: Record<string, number[]>): boolean {
  return def.series.every((s) => {
    const d = values?.[s.name] ?? s.data;
    return !d || d.length === 0 || d.every((n) => !Number.isFinite(n) || n === 0);
  });
}

export function defaultValues(def: ChartDef): Record<string, number[]> {
  return Object.fromEntries(def.series.map((s) => [s.name, [...s.data]]));
}
