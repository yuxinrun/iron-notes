import type { Myth } from "@/types";

/** 首页「你以为的健身，可能并不科学」——每条都指向一篇完整深度文章 */
export const myths: Myth[] = [
  {
    id: "m1",
    claim: "不是每组都练到力竭，肌肉才会增长。",
    verdict: "力竭是工具，不是门票",
    slug: "failure-training",
    short: "非力竭训练在多数肥大指标上并不逊色，且疲劳成本更低。",
  },
  {
    id: "m2",
    claim: "出汗多，不等于减脂效果好。",
    verdict: "汗是散热，不是脂肪",
    slug: "calorie-surplus",
    short: "出汗量受环境温度、湿度与个体差影响，与能量平衡的因果关系很弱。",
  },
  {
    id: "m3",
    claim: "训练后的酸痛，不是增肌成绩单。",
    verdict: "DOMS 是反馈，不是分数",
    slug: "doms",
    short: "运动性肌肉损伤并非肥大的必要条件，过度酸痛反而压缩下一次训练质量。",
  },
  {
    id: "m4",
    claim: "每天练同一个部位，不代表进步更快。",
    verdict: "频率是分配工具",
    slug: "training-frequency",
    short: "总量相近时，高频并未显示明确的肥大优势；恢复能力决定上限。",
  },
  {
    id: "m5",
    claim: "蛋白质吃得多，不代表肌肉就长得快。",
    verdict: "先补缺口，再看边际",
    slug: "protein-intake",
    short: "总摄入达到一定水平后，追加蛋白的边际收益趋于平缓。",
  },
  {
    id: "m6",
    claim: "大重量很重要，但动作质量不能丢。",
    verdict: "负荷要可重复",
    slug: "choose-weight",
    short: "力量增益偏向较高负荷，但以牺牲动作幅度换来的加片不是渐进超负荷。",
  },
  {
    id: "m7",
    claim: "增肌不等于无节制地吃。",
    verdict: "盈余要可控",
    slug: "calorie-surplus",
    short: "过大的热量盈余主要增加脂肪，不会按比例加速肌肉合成。",
  },
];
