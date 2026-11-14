"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  SegmentedField,
  ResultGrid,
  ResultItem,
  ResultLines,
  FormulaBox,
  ToolDisclaimer,
  MiniTable,
} from "@/components/tools/ToolShell";
import { estimate1RM, sessionLoad, bmiValue } from "@/lib/calculations";
import { formatNumber, uid } from "@/lib/utils";

/* ------------------------------------------------------------------ */
interface VolumeRow {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

const INITIAL_ROWS: VolumeRow[] = [
  { id: "r1", name: "杠铃卧推", sets: 4, reps: 8, weight: 60 },
  { id: "r2", name: "杠铃深蹲", sets: 4, reps: 6, weight: 90 },
  { id: "r3", name: "高位下拉", sets: 3, reps: 10, weight: 50 },
];

export function VolumeTool() {
  const [rows, setRows] = useState<VolumeRow[]>(INITIAL_ROWS);
  const [lastWeek, setLastWeek] = useState(0);

  const update = (id: string, patch: Partial<VolumeRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const totalSets = rows.reduce((s, r) => s + r.sets, 0);
  const totalReps = rows.reduce((s, r) => s + r.sets * r.reps, 0);
  const totalLoad = rows.reduce((s, r) => s + sessionLoad(r.sets, r.reps, r.weight), 0);
  const change = lastWeek > 0 ? Math.round(((totalSets - lastWeek) / lastWeek) * 1000) / 10 : null;
  const maxRow = rows.reduce((a, b) => (sessionLoad(a.sets, a.reps, a.weight) >= sessionLoad(b.sets, b.reps, b.weight) ? a : b), rows[0]);

  return (
    <ToolLayout
      inputs={
        <>
          <p className="text-[12px] leading-relaxed text-muted">按你自己的训练日志填动作。每一行独立计算，行数可以增加或删除。</p>
          {rows.map((r, i) => (
            <div key={r.id} className="rounded-xl border border-line bg-paper/40 p-3.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-display text-[12px] tracking-[0.14em] text-brand">EXERCISE {String(i + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.id !== r.id) : rs))}
                  className="text-[11.5px] text-muted hover:text-brand-dark"
                >
                  删除
                </button>
              </div>
              <input
                value={r.name}
                onChange={(e) => update(r.id, { name: e.target.value })}
                placeholder="动作名称"
                className="mb-2.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-brand"
              />
              <div className="grid grid-cols-3 gap-2">
                <NumberField label="组数" value={r.sets} onChange={(v) => update(r.id, { sets: v })} min={1} max={30} />
                <NumberField label="次数" value={r.reps} onChange={(v) => update(r.id, { reps: v })} min={1} max={50} />
                <NumberField label="重量" value={r.weight} onChange={(v) => update(r.id, { weight: v })} unit="kg" max={600} step={2.5} />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, { id: uid(), name: "新动作", sets: 3, reps: 10, weight: 20 }])}
            className="btn btn-outline btn-sm w-full"
          >
            增加一个动作
          </button>
          <NumberField
            label="上周总组数（用于对比）"
            value={lastWeek}
            onChange={setLastWeek}
            unit="组"
            max={200}
            hint="留 0 表示暂不对比。建议每周组数增幅控制在约 20–30% 以内。"
          />
        </>
      }
      outputs={
        <>
          <ResultGrid>
            <ResultItem label="本次总组数" value={totalSets} unit="组" accent="#f4a07a" note={`共 ${rows.length} 个动作`} />
            <ResultItem label="总重复次数" value={totalReps} unit="次" note="Σ 组数 × 次数" />
            <ResultItem label="单动作负荷参考" value={formatNumber(sessionLoad(maxRow.sets, maxRow.reps, maxRow.weight))} unit="kg·次" note={`${maxRow.name}（本行内口径）`} />
            <ResultItem label="相对上周组数" value={change === null ? "—" : `${change > 0 ? "+" : ""}${change}%`} unit={change === null ? "未录入" : "组数变化"} accent={change !== null && Math.abs(change) > 30 ? "#ffb08c" : undefined} note={change !== null && Math.abs(change) > 30 ? "变化偏大，先观察恢复" : "在合理范围内可继续观察"} />
          </ResultGrid>
          <ResultLines
            items={[
              { label: "总负荷参考值", value: `${formatNumber(totalLoad)} kg·次（不同动作相加仅作演示）` },
              { label: "平均每组次数", value: `${totalSets ? (totalReps / totalSets).toFixed(1) : "0"} 次` },
              { label: "建议观察周期", value: "连续 2 周表现与疲劳，而非单次数字" },
              { label: "统计口径", value: "仅正式组；热身组不计入有效组" },
            ]}
          />
        </>
      }
      notes={
        <>
          <FormulaBox title="容量怎么算，又为什么不能直接相加">
            <p>单动作负荷参考 = 组数 × 次数 × 重量（kg·次）。它能比较「同一个动作、同一次数区间」在不同周的变化，是渐进超负荷最朴素的记录方式之一。</p>
            <p>但把卧推、深蹲、下拉的 kg·次 直接相加，并没有清晰的生理学含义：不同动作的杠杆、幅度、参与的肌群都不同。上面的「总负荷参考值」只用来演示计算过程，不应被当作「今天练得够不够」的判定指标。</p>
            <p>更常用的周训练量指标是「每个肌群的周有效组数」。请配合数据实验室的组数分布图与训练文章一起看。</p>
          </FormulaBox>
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="eyebrow !text-[11px]">SESSION BREAKDOWN / 本次明细</div>
            <MiniTable
              head={["动作", "组数", "次数", "重量 (kg)", "负荷参考 (kg·次)"]}
              rows={rows.map((r) => [r.name || "未命名", r.sets, r.reps, r.weight, sessionLoad(r.sets, r.reps, r.weight)])}
            />
          </div>
          <ToolDisclaimer>周组数不是越高越好。若出现持续表现下滑、关节疼痛或睡眠变差，应先减量或安排减量周，而不是继续堆容量；有伤病史者请咨询医生与具备资质的专业人员。</ToolDisclaimer>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
const PERCENTS = [95, 90, 85, 80, 75, 70, 65, 60];

export function OneRMTool() {
  const [weight, setWeight] = useState(80);
  const [reps, setReps] = useState(5);
  const { epley, brzycki } = estimate1RM(weight, reps);
  const lo = Math.min(epley, brzycki);
  const hi = Math.max(epley, brzycki);
  const mid = (epley + brzycki) / 2;
  const round2p5 = (n: number) => Math.round(n / 2.5) * 2.5;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField label="实际举起重量" value={weight} onChange={setWeight} unit="kg" min={1} max={600} step={2.5} hint="填写能稳定完成、动作质量合格的重量。" />
          <NumberField label="完成次数" value={reps} onChange={setReps} unit="次" min={1} max={30} hint="次数越多，推算误差越大；超过 12 次时不建议再用来估算 1RM。" />
          <SegmentedField<number>
            label="快速填入常见次数"
            value={reps}
            onChange={setReps}
            options={[{ value: 3, label: "3 次" }, { value: 5, label: "5 次" }, { value: 8, label: "8 次" }, { value: 10, label: "10 次" }]}
          />
          <p className="rounded-xl border border-line bg-paper/50 px-3.5 py-3 text-[12px] leading-relaxed text-muted">
            两个公式给出的是区间，不是「真实极限」。实测 1RM 需要充分热身、规范保护与合适的测试条件，本站不建议自行突击测试。
          </p>
        </>
      }
      outputs={
        <>
          <ResultGrid>
            <ResultItem label="Epley 估算" value={formatNumber(epley, 1)} unit="kg" note="w × (1 + 次数 / 30)" />
            <ResultItem label="Brzycki 估算" value={formatNumber(brzycki, 1)} unit="kg" note="w × 36 / (37 − 次数)" />
            <ResultItem label="建议参考区间" value={`${formatNumber(lo, 1)}–${formatNumber(hi, 1)}`} unit="kg" accent="#f4a07a" note="用于设定训练百分比，不是极限证书" />
            <ResultItem label="区间中值" value={formatNumber(mid, 1)} unit="kg" note="下表按此值换算" />
          </ResultGrid>
          <ResultLines
            items={[
              { label: "输入条件", value: `${weight} kg × ${reps} 次` },
              { label: "两式差异", value: `${formatNumber(Math.abs(epley - brzycki), 1)} kg（${mid ? ((Math.abs(epley - brzycki) / mid) * 100).toFixed(1) : "0"}%）` },
              { label: "可靠性提示", value: reps > 10 ? "次数偏高，估算误差明显增大" : "次数区间较合适，仍属估算" },
              { label: "用途", value: "给训练负荷定百分比，或换算不同次数区间的目标重量" },
            ]}
          />
        </>
      }
      notes={
        <>
          <FormulaBox title="两种估算式与误差来源">
            <p>Epley：1RM = 重量 × (1 + 次数 / 30)。Brzycki：1RM = 重量 × 36 / (37 − 次数)。两者都是从群体数据拟合出的经验式，不做个体校正。</p>
            <p>误差来源包括：肌纤维组成、动作幅度、训练经验、是否接近力竭、疲劳与当时状态。次数越多，肌肉耐力对结果的影响越大，推算越不可靠。</p>
            <p>如果只是为了安排训练，用「同一动作、固定次数下能稳定完成的重量」追踪进步，比纠结 1RM 数字更实用。</p>
          </FormulaBox>
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="eyebrow !text-[11px]">PERCENTAGE CHART / 百分比负荷表（按区间中值换算）</div>
            <MiniTable
              head={["% 估算 1RM", "参考重量 (kg)", "常见用途"]}
              rows={PERCENTS.map((p) => [
                `${p}%`,
                round2p5(mid * p / 100),
                p >= 90 ? "低次数、高强度（需充分准备）" : p >= 80 ? "3–6 次区间" : p >= 70 ? "6–10 次区间" : "热身 / 技术组参考",
              ])}
            />
            <p className="mt-3 text-[11.5px] leading-relaxed text-muted">重量按 2.5 kg 取整，仅示意换算方法；表中数值为示例计算，不代表任何个体化负荷处方。</p>
          </div>
          <ToolDisclaimer>推算 1RM 不等于可以安全举起该重量。大重量训练请使用保护杆或保护者，避免在疲劳、疼痛或无人保护时尝试极限；有心血管、骨关节疾病者请先咨询医生。</ToolDisclaimer>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
export function BmiTool() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [waist, setWaist] = useState(78);
  const bmi = bmiValue(weight, height);
  const band = bmi < 18.5 ? "低于 18.5（偏低区间）" : bmi < 25 ? "18.5–24.9（成人参考区间）" : bmi < 30 ? "25–29.9（偏高区间）" : "30 及以上（更高区间）";
  const whtr = waist / height;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField label="体重" value={weight} onChange={setWeight} unit="kg" min={30} max={250} step={0.5} />
          <NumberField label="身高" value={height} onChange={setHeight} unit="cm" min={120} max={230} />
          <NumberField label="腰围（可选）" value={waist} onChange={setWaist} unit="cm" min={40} max={200} hint="晨起、平静呼气末、同一位置测量更可比。" />
          <p className="rounded-xl border border-line bg-paper/50 px-3.5 py-3 text-[12px] leading-relaxed text-muted">
            这个工具最大的价值不是算出数字，而是把「BMI 能说明什么、不能说明什么」讲清楚。
          </p>
        </>
      }
      outputs={
        <>
          <ResultGrid>
            <ResultItem label="BMI" value={formatNumber(bmi, 1)} unit="kg/m²" accent="#f4a07a" note="体重 ÷ 身高²" />
            <ResultItem label="成人参考区间" value={band} note="世界卫生组织常用界值" />
            <ResultItem label="腰围 / 身高" value={formatNumber(whtr, 2)} note="仅作趋势参考，非诊断指标" />
            <ResultItem label="更适合增肌者的指标" value="趋势" note="体重 7 日均线 + 围度 + 训练表现" />
          </ResultGrid>
          <ResultLines
            items={[
              { label: "计算式", value: `${weight} ÷ ${(height / 100).toFixed(2)}² = ${formatNumber(bmi, 1)}` },
              { label: "国内常用筛查界值", value: "与 WHO 界值不同，常用于 24 / 28 分界（不作诊断）" },
              { label: "不能回答的问题", value: "肌肉量、体脂率、脂肪分布、代谢健康" },
              { label: "更实用的做法", value: "固定条件记录趋势，与训练表现一起解读" },
            ]}
          />
        </>
      }
      notes={
        <>
          <FormulaBox title="BMI 的局限">
            <p>BMI 只用体重和身高两个变量，无法区分肌肉与脂肪。长期抗阻训练者肌肉量较高，BMI 可能落在「偏高区间」，但并不能据此判断体脂或健康风险；反过来，BMI 落在参考区间也不能说明肌肉量充足。</p>
            <p>对增肌者更有意义的是趋势：晨起体重的 7 日均线是否在缓慢上升、腰围是否同步快速增长、同动作同次数的重量有没有进步。三者一起看，比单看一个数更能判断热量盈余是否合适。</p>
            <p>如需评估体脂率或代谢指标，请由具备资质的专业人员使用合适方法测量，本站不提供医学判断。</p>
          </FormulaBox>
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="eyebrow !text-[11px]">REFERENCE BANDS / 成人 BMI 参考分档</div>
            <MiniTable
              head={["区间", "WHO 常用表述", "本站解读"]}
              rows={[
                ["< 18.5", "低于参考范围", "需结合饮食、训练与医学情况综合判断"],
                ["18.5–24.9", "参考范围", "不等于体脂率合适或肌肉量充足"],
                ["25–29.9", "高于参考范围", "肌肉量高者常见，不能单独作为风险结论"],
                ["≥ 30", "更高区间", "建议由专业人员做进一步评估"],
              ]}
            />
            <p className="mt-3 text-[11.5px] leading-relaxed text-muted">分档为世界卫生组织常用的成人参考界值；我国成人超重与肥胖筛查另有 24 / 28 的常用界值。此处仅作概念说明，不构成诊断或健康结论。</p>
          </div>
          <ToolDisclaimer>BMI 是人群层面的统计工具，不能替代体成分测量、血液指标或医生评估。若体重短期明显波动、出现水肿或不明原因不适，请及时就医。</ToolDisclaimer>
        </>
      }
    />
  );
}
