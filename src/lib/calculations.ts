import { clamp } from "@/lib/utils";

/** Mifflin-St Jeor (1990)：健康成年人静息能量消耗预测式 */
export function basalMetabolicRate(
  sex: "male" | "female",
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(base + (sex === "male" ? 5 : -161));
}

export const ACTIVITY_FACTORS: Record<string, { label: string; factor: number; note: string }> = {
  sedentary: { label: "久坐（办公室，几乎不走动）", factor: 1.2, note: "几乎无结构化活动" },
  light: { label: "轻度活动（日常步行较多）", factor: 1.375, note: "每天约 6000–9000 步" },
  moderate: { label: "中度活动（体力工作 / 规律训练）", factor: 1.55, note: "每周 3–5 次训练" },
  high: { label: "高度活动（体力工作 + 高频训练）", factor: 1.725, note: "每周 6 次以上" },
};

export function totalDailyEnergy(bmr: number, factor: number): number {
  return Math.round(bmr * factor);
}

/** 增肌热量盈余：以体重为基准的温和区间，而非一刀切的固定千卡 */
export function surplusRange(weightKg: number): [number, number] {
  return [Math.round(weightKg * 3), Math.round(weightKg * 7)];
}

/** 蛋白质建议区间 g/kg，随目标与训练状态调整；来源见 ISSN 2017 / Morton 2018 */
export function proteinRange(
  weightKg: number,
  level: "beginner" | "intermediate" | "advanced",
  goal: "gain" | "maintain" | "cut",
): [number, number] {
  let low = 1.4;
  let high = 2.0;
  if (goal === "cut") {
    low += 0.2;
    high += 0.4;
  }
  if (level === "advanced") {
    low += 0.1;
    high += 0.1;
  }
  return [Math.round(weightKg * low), Math.round(weightKg * high)];
}

export function macroFromCalories(
  kcal: number,
  proteinG: number,
  carbG: number,
  fatG: number,
): { kcal: number; protein: number; carb: number; fat: number; total: number } {
  return {
    kcal,
    protein: proteinG,
    carb: carbG,
    fat: fatG,
    total: proteinG * 4 + carbG * 4 + fatG * 9,
  };
}

export function macroByRatio(
  kcal: number,
  pRatio: number,
  cRatio: number,
  fRatio: number,
): { protein: number; carb: number; fat: number; kcal: number } {
  const sum = pRatio + cRatio + fRatio || 1;
  return {
    protein: Math.round((kcal * pRatio) / sum / 4),
    carb: Math.round((kcal * cRatio) / sum / 4),
    fat: Math.round((kcal * fRatio) / sum / 9),
    kcal,
  };
}

/** Epley 与 Brzycki 两种常用 1RM 估算式，给出区间而非单点"真实最大力量" */
export function estimate1RM(weight: number, reps: number): { epley: number; brzycki: number } {
  const r = clamp(reps, 1, 30);
  const epley = weight * (1 + r / 30);
  const brzycki = r === 1 ? weight : weight * (36 / (37 - r));
  return { epley: Math.round(epley * 10) / 10, brzycki: Math.round(brzycki * 10) / 10 };
}

/** 训练容量：仅在本动作内可比较的"负荷×次数×组数"参考值 */
export function sessionLoad(sets: number, reps: number, weight: number): number {
  return Math.round(sets * reps * weight);
}

export function bmiValue(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

/** 周训练量对比，返回相对第一周的变化百分比 */
export function weekOverWeek(values: number[]): number[] {
  if (!values.length || !values[0]) return values.map(() => 0);
  return values.map((v) => Math.round(((v - values[0]) / values[0]) * 1000) / 10);
}
