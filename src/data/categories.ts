import type { Channel, ChannelKey } from "@/types";

export const channels: Channel[] = [
  {
    key: "getting-started",
    label: "增肌入门",
    en: "START HERE",
    href: "/getting-started",
    description: "从零建立正确认知，先把变量和术语弄明白。",
    detail: "给完全没有训练经验的人：什么是肌肥大、容量、强度、频率、RIR、渐进超负荷，以及第一次进健身房该怎么做。",
    order: 1,
  },
  {
    key: "science",
    label: "科学训练",
    en: "TRAINING SCIENCE",
    href: "/science",
    description: "理解刺激、疲劳与适应之间的因果关系。",
    detail: "本站最核心的专业频道：肌肥大机制、训练变量之间的取舍、接近力竭、渐进超负荷与计划制定。",
    order: 2,
  },
  {
    key: "exercises",
    label: "动作图鉴",
    en: "MOVEMENT ATLAS",
    href: "/exercises",
    description: "按肌群检索动作，看懂每一步该做什么。",
    detail: "原创 SVG 动作分解与肌群示意，包含起始姿势、动作步骤、呼吸、幅度、常见错误与代偿、替代动作。",
    order: 3,
  },
  {
    key: "plans",
    label: "训练计划",
    en: "PROGRAM LIBRARY",
    href: "/plans",
    description: "按水平、天数、器械筛选可执行的周安排。",
    detail: "每个计划给出训练日分配、组数次数、休息、RIR、热身、时长、进阶规则与减量建议，支持打卡与收藏。",
    order: 4,
  },
  {
    key: "nutrition",
    label: "营养饮食",
    en: "NUTRITION",
    href: "/nutrition",
    description: "让热量、蛋白质和餐盘为训练服务。",
    detail: "能量平衡、蛋白质区间、碳水与脂肪、增肌饮食实战，以及补剂证据分级。",
    order: 5,
  },
  {
    key: "recovery",
    label: "恢复与进步",
    en: "RECOVERY & PROGRESS",
    href: "/recovery",
    description: "管理疲劳，读懂数据，把训练变成长期系统。",
    detail: "睡眠、DOMS、减量周、平台期、体重围度监测与训练依从性。",
    order: 6,
  },
  {
    key: "lab",
    label: "数据实验室",
    en: "DATA LAB",
    href: "/lab",
    description: "用 ECharts 看清训练与身体变化。",
    detail: "15 组有实际意义的示例图表，支持录入自己的数据后重绘，全部标注统计口径与示例数据。",
    order: 7,
  },
  {
    key: "resources",
    label: "书籍与资源",
    en: "LIBRARY & LINKS",
    href: "/resources",
    description: "经过核实的书单、专业网站与研究入口。",
    detail: "国内外经典著作、专业机构与学术数据库，区分研究机构、专业科普与个人创作者平台。",
    order: 8,
  },
];

export const channelByKey = Object.fromEntries(channels.map((c) => [c.key, c])) as Record<ChannelKey, Channel>;

export const navItems = [
  { label: "首页", href: "/" },
  ...channels.map((c) => ({ label: c.label, href: c.href })),
];

export function channelLabel(key: ChannelKey): string {
  return channelByKey[key]?.label ?? "知识库";
}
