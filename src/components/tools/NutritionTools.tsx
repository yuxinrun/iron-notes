"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  SelectField,
  SegmentedField,
  ResultGrid,
  ResultItem,
  ResultLines,
  FormulaBox,
  ToolDisclaimer,
  MiniTable,
} from "@/components/tools/ToolShell";
import {
  ACTIVITY_FACTORS,
  basalMetabolicRate,
  totalDailyEnergy,
  surplusRange,
  proteinRange,
  macroByRatio,
  macroFromCalories,
} from "@/lib/calculations";
import { formatNumber } from "@/lib/utils";

type Sex = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "high";
type Level = "beginner" | "intermediate" | "advanced";
type Goal = "gain" | "maintain" | "cut";

/* ------------------------------------------------------------------ */
export function CalorieTool() {
  const [sex, setSex] = useState<Sex>("male");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(28);
  const [activity, setActivity] = useState<Activity>("moderate");

  const bmr = basalMetabolicRate(sex, weight, height, age);
  const factor = ACTIVITY_FACTORS[activity].factor;
  const tdee = totalDailyEnergy(bmr, factor);
  const [low, high] = surplusRange(weight);

  return (
    <ToolLayout
      inputs={
        <>
          <SegmentedField<Sex>
            label="生理性别"
            value={sex}
            onChange={setSex}
            options={[{ value: "male", label: "男" }, { value: "female", label: "女" }]}
          />
          <NumberField label="体重" value={weight} onChange={setWeight} unit="kg" min={30} max={250} step={0.5} />
          <NumberField label="身高" value={height} onChange={setHeight} unit="cm" min={120} max={230} />
          <NumberField label="年龄" value={age} onChange={setAge} unit="岁" min={16} max={90} />
          <SelectField<Activity>
            label="日常活动水平"
            value={activity}
            onChange={setActivity}
            options={(Object.keys(ACTIVITY_FACTORS) as Activity[]).map((k) => ({ value: k, label: ACTIVITY_FACTORS[k].label }))}
            hint="训练消耗已包含在活动系数里，不要重复叠加。"
          />
        </>
      }
      outputs={
        <>
          <ResultGrid>
            <ResultItem label="基础代谢 BMR" value={formatNumber(bmr)} unit="kcal / 天" note="静息状态下的群体预测值" />
            <ResultItem label="每日总消耗 TDEE" value={formatNumber(tdee)} unit="kcal / 天" accent="#f4a07a" note={`BMR × ${factor}`} />
            <ResultItem label="建议增肌盈余" value={`${low}–${high}`} unit="kcal / 天" note="按体重给出的温和区间" />
            <ResultItem label="起步摄入区间" value={`${tdee + low}–${tdee + high}`} unit="kcal / 天" accent="#f4a07a" note="用 2–3 周体重均线验证" />
          </ResultGrid>
          <ResultLines
            items={[
              { label: "采用公式", value: "Mifflin-St Jeor (1990)" },
              { label: "活动系数", value: `${factor} · ${ACTIVITY_FACTORS[activity].note}` },
              { label: "盈余口径", value: `体重 × 3–7 kcal/kg = ${low}–${high} kcal` },
              { label: "调整依据", value: "晨起体重 7 日均线 + 训练表现，而非单日数值" },
            ]}
          />
        </>
      }
      notes={
        <>
          <FormulaBox title="公式与误差说明">
            <p>男：BMR = 10 × 体重(kg) + 6.25 × 身高(cm) − 5 × 年龄 + 5；女：同式 − 161。TDEE = BMR × 活动系数。</p>
            <p>该预测式来自健康成年人的群体数据，对个体可能明显偏差；肌肉量、体脂、疾病、药物与代谢适应都会改变真实消耗。活动系数是粗略分档，同一档内差异同样很大。</p>
            <p>请把结果当成「起始猜测」，再用 2–3 周体重均线与训练表现调整，而不是当成精确处方。盈余过大带来的主要是脂肪增长，不会让肌肉长得更快。</p>
          </FormulaBox>
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="eyebrow !text-[11px]">ACTIVITY FACTORS / 活动系数分档</div>
            <MiniTable
              head={["活动水平", "系数", "说明"]}
              rows={Object.entries(ACTIVITY_FACTORS).map(([, v]) => [v.label, v.factor, v.note])}
            />
          </div>
          <ToolDisclaimer>
            本工具为教育用途估算，不构成医学营养建议。未成年人、孕期或哺乳期、慢性疾病患者以及有进食障碍史者，请咨询医生与注册营养师，不要自行套用热量盈余。
          </ToolDisclaimer>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
const FOOD_PROTEIN: (string | number)[][] = [
  ["鸡蛋（1 个，约 50 g）", "约 6–7 g", "熟重不影响蛋白总量"],
  ["鸡胸肉（熟 100 g）", "约 28–31 g", "生熟称重差异较大"],
  ["牛奶（250 ml）", "约 8 g", "以包装营养成分表为准"],
  ["北豆腐（100 g）", "约 8–12 g", "不同凝固剂与品牌差异明显"],
  ["无糖酸奶（150 g）", "约 5–10 g", "过滤型产品更高"],
  ["熟米饭（100 g）", "约 2–3 g", "不是主要蛋白来源"],
];

export function ProteinTool() {
  const [weight, setWeight] = useState(70);
  const [level, setLevel] = useState<Level>("beginner");
  const [goal, setGoal] = useState<Goal>("gain");
  const [meals, setMeals] = useState(4);

  const [low, high] = proteinRange(weight, level, goal);
  const perMeal = [Math.round(low / meals), Math.round(high / meals)];
  const lowPerKg = (low / weight).toFixed(1);
  const highPerKg = (high / weight).toFixed(1);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField label="体重" value={weight} onChange={setWeight} unit="kg" min={30} max={250} step={0.5} />
          <SelectField<Level>
            label="训练水平"
            value={level}
            onChange={setLevel}
            options={[
              { value: "beginner", label: "零基础 / 训练不足 1 年" },
              { value: "intermediate", label: "中级 / 稳定训练 1–3 年" },
              { value: "advanced", label: "高级 / 系统训练 3 年以上" },
            ]}
          />
          <SelectField<Goal>
            label="当前目标"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "gain", label: "增肌（温和热量盈余）" },
              { value: "maintain", label: "维持 / 重组" },
              { value: "cut", label: "减脂（热量缺口）" },
            ]}
            hint="减脂期蛋白下限上调，是为了在能量不足时尽量保住瘦体重。"
          />
          <SegmentedField<number>
            label="每天进餐次数"
            value={meals}
            onChange={setMeals}
            options={[{ value: 3, label: "3 餐" }, { value: 4, label: "4 餐" }, { value: 5, label: "5 餐" }]}
          />
        </>
      }
      outputs={
        <>
          <ResultGrid>
            <ResultItem label="每日蛋白质目标" value={`${low}–${high}`} unit="g / 天" accent="#f4a07a" note="全日总量优先于进食时机" />
            <ResultItem label="折合每公斤体重" value={`${lowPerKg}–${highPerKg}`} unit="g / kg" note="随目标与训练状态调整" />
            <ResultItem label={`每餐分配（${meals} 餐）`} value={`${perMeal[0]}–${perMeal[1]}`} unit="g / 餐" note="均匀分配，方便达标" />
            <ResultItem label="对应热量" value={`${low * 4}–${high * 4}`} unit="kcal" note="按 4 kcal/g 换算" />
          </ResultGrid>
          <ResultLines
            items={[
              { label: "主要依据", value: "ISSN 立场声明 (2017) / Morton 等 (2018) 的概括区间" },
              { label: "证据等级", value: "充分研究支持（总量）；分配时机证据较弱" },
              { label: "优先顺序", value: "先守住全日总量，再考虑每餐分配与食物选择" },
              { label: "不适用情形", value: "肾功能疾病等需医嘱限制蛋白摄入者" },
            ]}
          />
        </>
      }
      notes={
        <>
          <FormulaBox title="区间是怎么来的">
            <p>以 1.4–2.0 g/kg 为基础区间：处于热量缺口时上下限各上调，训练年限较高者再小幅上调。这里的数字是便于执行的概括，不是「超过就浪费、低于就完全无效」的生理硬阈值。</p>
            <p>把蛋白均匀分到几餐，主要是让全天总量更容易达标、也让每餐有饱腹感；研究对「每餐必须达到某个克数」的支持并不强。真正需要复核的是全天总量是否稳定达标。</p>
          </FormulaBox>
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="eyebrow !text-[11px]">FOOD REFERENCE / 常见食物蛋白量级</div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
              以下为便于心算的约值，不同品牌、部位与烹调方式差异明显；请以包装营养成分表或权威食物成分表为准，本站不把它当作精确数据库。
            </p>
            <MiniTable head={["食物 / 份量", "蛋白质（约）", "备注"]} rows={FOOD_PROTEIN} />
          </div>
          <ToolDisclaimer>
            已有肾脏疾病、肝性脑病或其他需要限制蛋白摄入的医学情况者，请先咨询医生。补剂不是必需条件，食物优先；本站不推荐、也不提供任何非法药物方案。
          </ToolDisclaimer>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
export function MacrosTool() {
  const [kcal, setKcal] = useState(2600);
  const [pRatio, setPRatio] = useState(25);
  const [fRatio, setFRatio] = useState(25);
  const [manual, setManual] = useState<{ protein: number; carb: number; fat: number } | null>(null);

  const cRatio = Math.max(0, 100 - pRatio - fRatio);
  const base = macroByRatio(kcal, pRatio, cRatio, fRatio);
  const cur = manual ?? { protein: base.protein, carb: base.carb, fat: base.fat };
  const check = macroFromCalories(kcal, cur.protein, cur.carb, cur.fat);
  const diff = check.total - kcal;
  const ratios = [
    { label: "蛋白质", gram: cur.protein, kcal: cur.protein * 4 },
    { label: "碳水化合物", gram: cur.carb, kcal: cur.carb * 4 },
    { label: "脂肪", gram: cur.fat, kcal: cur.fat * 9 },
  ];

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField label="每日总热量" value={kcal} onChange={(v) => { setKcal(v); setManual(null); }} unit="kcal" min={800} max={8000} step={50} hint="可先用「每日热量估算器」得到一个起步值。" />
          <SegmentedField<number>
            label="蛋白质热量占比"
            value={pRatio}
            onChange={(v) => { setPRatio(v); setManual(null); }}
            options={[{ value: 20, label: "20%" }, { value: 25, label: "25%" }, { value: 30, label: "30%" }, { value: 35, label: "35%" }]}
          />
          <SegmentedField<number>
            label="脂肪热量占比"
            value={fRatio}
            onChange={(v) => { setFRatio(v); setManual(null); }}
            options={[{ value: 20, label: "20%" }, { value: 25, label: "25%" }, { value: 30, label: "30%" }, { value: 35, label: "35%" }]}
          />
          <div className="rounded-xl border border-line bg-paper/50 px-3.5 py-3 text-[12.5px] text-ink-2">
            碳水占比自动补足：<span className="font-semibold text-brand-dark">{cRatio}%</span>
            {cRatio < 20 && <span className="mt-1 block text-[11.5px] text-muted">碳水占比偏低时，先复核蛋白与脂肪比例是否设得过高。</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setManual(manual ? null : { ...cur })}
              className="btn btn-outline btn-sm"
            >
              {manual ? "恢复按比例计算" : "手动微调克数"}
            </button>
            {manual && (
              <button type="button" onClick={() => setManual({ ...base })} className="btn btn-outline btn-sm">用比例覆盖</button>
            )}
          </div>
          {manual && (
            <div className="space-y-3 rounded-xl border border-line bg-white p-3.5">
              <NumberField label="蛋白质" value={manual.protein} onChange={(v) => setManual({ ...manual, protein: v })} unit="g" max={600} />
              <NumberField label="碳水化合物" value={manual.carb} onChange={(v) => setManual({ ...manual, carb: v })} unit="g" max={1200} />
              <NumberField label="脂肪" value={manual.fat} onChange={(v) => setManual({ ...manual, fat: v })} unit="g" max={400} />
            </div>
          )}
        </>
      }
      outputs={
        <>
          <ResultGrid cols={3}>
            {ratios.map((r, i) => (
              <ResultItem
                key={r.label}
                label={r.label}
                value={r.gram}
                unit="g"
                accent={i === 2 ? "#f4a07a" : undefined}
                note={`约 ${r.kcal} kcal · ${kcal ? Math.round((r.kcal / check.total) * 100) : 0}%`}
              />
            ))}
          </ResultGrid>
          <ResultLines
            items={[
              { label: "设定总热量", value: `${kcal} kcal` },
              { label: "按克数回算热量", value: `${check.total} kcal` },
              { label: "热量校验", value: diff === 0 ? "守恒 ✓" : `${diff > 0 ? "超出" : "缺口"} ${Math.abs(diff)} kcal（${kcal ? ((Math.abs(diff) / kcal) * 100).toFixed(1) : "0"}%）` },
              { label: "换算系数", value: "蛋白 4 / 碳水 4 / 脂肪 9 kcal per g" },
            ]}
          />
        </>
      }
      notes={
        <>
          <FormulaBox title="换算与校验">
            <p>某营养素克数 = 总热量 × 该营养素热量占比 ÷ 每克热量（蛋白 4、碳水 4、脂肪 9 kcal/g）。反向校验：总热量 = 蛋白 g × 4 + 碳水 g × 4 + 脂肪 g × 9。</p>
            <p>手动微调后两项不相等是正常的：这说明你改了结构，需要决定是接受新总热量，还是把其他营养素补回来。四舍五入也会带来几十千卡的误差。</p>
            <p>比例是结果，不是目标。更值得守住的是按体重估算的蛋白克数下限、基本的脂肪摄入，以及训练前后足够的碳水可用性。</p>
          </FormulaBox>
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="eyebrow !text-[11px]">MACRO BREAKDOWN / 当前结构</div>
            <MiniTable
              head={["营养素", "克数", "热量 (kcal)", "实际占比"]}
              rows={ratios.map((r) => [r.label, `${r.gram} g`, r.kcal, `${check.total ? Math.round((r.kcal / check.total) * 100) : 0}%`])}
            />
          </div>
          <ToolDisclaimer>本工具用于理解热量换算关系，不生成个体化饮食处方。食物标签、烹调损耗与消化吸收差异都会让实际摄入偏离计算值；如有代谢疾病或特殊医学需求，请咨询医生与注册营养师。</ToolDisclaimer>
        </>
      }
    />
  );
}
