"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChartBlock } from "@/components/charts/ChartBlock";
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
import { ADAPTER, readBodyRecords, writeBodyRecords, subscribeStorage } from "@/lib/storage";
import { downloadJSON, formatNumber, todayISO, uid } from "@/lib/utils";
import type { BodyRecord } from "@/types";

/* ------------------------------------------------------------------ */
export function ProgressTool() {
  const [records, setRecords] = useState<BodyRecord[]>([]);
  const [date, setDate] = useState(todayISO);
  const [weight, setWeight] = useState(70);
  const [waist, setWaist] = useState(78);
  const [arm, setArm] = useState(33);
  const [performance, setPerformance] = useState("");

  useEffect(() => {
    const sync = () => setRecords(readBodyRecords());
    sync();
    return subscribeStorage(sync);
  }, []);

  const sorted = useMemo(() => [...records].sort((a, b) => a.date.localeCompare(b.date)), [records]);
  const withWeight = sorted.filter((r) => typeof r.weight === "number");
  const latest = withWeight[withWeight.length - 1];
  const first = withWeight[0];
  const delta = latest && first ? (latest.weight as number) - (first.weight as number) : 0;

  const chartValues = useMemo(() => {
    const w = withWeight.slice(-14).map((r) => r.weight as number);
    const ma = w.map((_, i) => {
      const window = w.slice(Math.max(0, i - 6), i + 1);
      return Math.round((window.reduce((a, b) => a + b, 0) / window.length) * 10) / 10;
    });
    return { 日体重: w, "7 日均线": ma };
  }, [withWeight]);

  const add = () => {
    const record: BodyRecord = {
      id: uid(),
      date: date || todayISO(),
      weight,
      waist,
      arm,
      performance: performance.trim() || undefined,
    };
    writeBodyRecords([...records, record]);
    setPerformance("");
  };

  const remove = (id: string) => writeBodyRecords(records.filter((r) => r.id !== id));

  return (
    <ToolLayout
      inputs={
        <>
          <label className="block">
            <span className="text-[13px] font-semibold text-ink-2">记录日期</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-paper/40 px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand focus:bg-white"
            />
          </label>
          <NumberField label="晨起体重" value={weight} onChange={setWeight} unit="kg" min={30} max={250} step={0.1} hint="排空后、进食前，条件尽量一致。" />
          <NumberField label="腰围" value={waist} onChange={setWaist} unit="cm" min={40} max={200} step={0.5} />
          <NumberField label="上臂围" value={arm} onChange={setArm} unit="cm" min={15} max={70} step={0.5} />
          <label className="block">
            <span className="text-[13px] font-semibold text-ink-2">训练表现备注</span>
            <textarea
              value={performance}
              onChange={(e) => setPerformance(e.target.value)}
              rows={3}
              placeholder="例如：卧推 60 kg × 8 次，RIR 2；睡眠 7 小时"
              className="mt-1.5 w-full resize-y rounded-lg border border-line bg-paper/40 px-3 py-2.5 text-[13px] text-ink outline-none focus:border-brand focus:bg-white"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={add} className="btn btn-primary btn-sm">保存这条记录</button>
            <button
              type="button"
              onClick={() => downloadJSON("iron-notes-body-records.json", records)}
              disabled={records.length === 0}
              className="btn btn-outline btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              导出 JSON
            </button>
          </div>
          <p className="text-[11.5px] leading-relaxed text-muted">数据只保存在这台设备的浏览器里，不会上传。清除浏览器数据前请先导出备份。</p>
        </>
      }
      outputs={
        <>
          <ResultGrid>
            <ResultItem label="已保存记录" value={records.length} unit="条" accent="#f4a07a" note="本地存储，随时可导出" />
            <ResultItem label="最近一次体重" value={latest ? formatNumber(latest.weight as number, 1) : "—"} unit="kg" note={latest?.date ?? "暂无记录"} />
            <ResultItem label="首末体重变化" value={withWeight.length >= 2 ? `${delta > 0 ? "+" : ""}${formatNumber(delta, 1)}` : "—"} unit="kg" note="需要至少 2 条体重记录" />
            <ResultItem label="趋势判断依据" value="7 日均线" note="单日波动多为水分与胃肠内容物" />
          </ResultGrid>
          <ResultLines
            items={[
              { label: "推荐记录频率", value: "体重每日、围度每 2–4 周、表现每次训练" },
              { label: "推荐观察窗口", value: "至少 2–3 周，不看单日数值" },
              { label: "配合指标", value: "腰围、围度、同动作同次数的重量、睡眠" },
              { label: "数据归属", value: "仅本机浏览器 · 可在「我的记录」统一管理" },
            ]}
          />
        </>
      }
      notes={
        <>
          <div>
            {withWeight.length >= 2 ? (
              <ChartBlock id="bodyweight-trend" values={chartValues} height={300} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
                <p className="text-[15px] font-semibold text-ink">保存至少 2 条体重记录后显示趋势图</p>
                <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-muted">
                  图表默认展示近 14 条记录与对应的滚动均线。没有真实记录时，本站不会用示例数据冒充你的数据。
                </p>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="eyebrow !text-[11px]">MY RECORDS / 我的记录</div>
              <Link href="/my" className="text-[12px] text-brand-dark hover:underline">在「我的记录」中统一管理 →</Link>
            </div>
            {sorted.length ? (
              <MiniTable
                head={["日期", "体重 (kg)", "腰围 (cm)", "臂围 (cm)", "表现备注"]}
                rows={sorted.slice().reverse().map((r) => [
                  r.date,
                  r.weight ?? "—",
                  r.waist ?? "—",
                  r.arm ?? "—",
                  r.performance || "—",
                ])}
              />
            ) : (
              <p className="mt-3 text-[12.5px] text-muted">暂无记录，先在左侧保存一条。</p>
            )}
            {sorted.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sorted.slice().reverse().slice(0, 12).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => remove(r.id)}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-muted hover:border-brand hover:text-brand-dark"
                  >
                    删除 {r.date}
                  </button>
                ))}
              </div>
            )}
          </div>
          <FormulaBox title="怎么读这些数字">
            <p>体重在一天内上下 0.5 kg 很常见，多半来自水分、盐分与胃肠内容物。用 7 日均线看斜率，比盯单日数字可靠得多。</p>
            <p>体重上升不代表全是肌肉：若腰围与体重同步快速上升，先复核热量盈余；若体重不动但同动作重量稳定上升、围度缓慢增加，也可能是正常的身体重组阶段。</p>
          </FormulaBox>
          <ToolDisclaimer>本工具仅用于自我记录，不做医学评估。若出现不明原因的体重骤变、水肿、持续疼痛或进食困扰，请及时就医或咨询具备资质的专业人员。</ToolDisclaimer>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
type Equipment = "gym" | "dumbbell" | "bodyweight";
type Level = "zero" | "beginner" | "intermediate";
type Goal = "hypertrophy" | "strength" | "maintain";
type Slot = "push" | "pull" | "legs" | "core";

const POOLS: Record<Equipment, Record<Slot, string[]>> = {
  gym: {
    push: ["杠铃平板卧推", "坐姿器械推胸", "哑铃上斜卧推", "坐姿肩推", "绳索下压", "双杠臂屈伸（辅助）"],
    pull: ["高位下拉", "坐姿划船", "引体向上（辅助）", "单臂绳索下拉", "杠铃划船", "面拉"],
    legs: ["杠铃深蹲", "罗马尼亚硬拉", "坐姿腿举", "坐姿腿弯举", "坐姿腿屈伸", "站姿提踵"],
    core: ["平板支撑", "悬垂举腿（屈膝）", "绳索卷腹", "死虫式"],
  },
  dumbbell: {
    push: ["哑铃平板卧推", "哑铃上斜卧推", "哑铃肩推", "哑铃地板卧推", "哑铃侧平举", "哑铃俯卧撑"],
    pull: ["单臂哑铃划船", "哑铃俯身划船", "哑铃直臂下压", "哑铃弯举", "哑铃农夫行走", "反向飞鸟"],
    legs: ["哑铃高脚杯深蹲", "哑铃罗马尼亚硬拉", "哑铃箭步蹲", "哑铃臀桥", "哑铃台阶上步", "哑铃提踵"],
    core: ["平板支撑", "死虫式", "哑铃俄罗斯转体", "侧桥"],
  },
  bodyweight: {
    push: ["俯卧撑", "上斜俯卧撑", "下斜俯卧撑", "双杠臂屈伸（若有器械）", "派克俯卧撑", "窄距俯卧撑"],
    pull: ["引体向上（若有单杠）", "反向划船（桌沿 / 低杠）", "毛巾划船", "超人式", "俯卧 Y 字举起", "宽握反向划船"],
    legs: ["自重深蹲", "保加利亚分腿蹲", "臀桥", "反向挺身", "单腿罗马尼亚硬拉", "提踵"],
    core: ["平板支撑", "死虫式", "侧桥", "登山者"],
  },
};

interface DayPattern {
  label: string;
  focus: string;
  slots: Slot[];
}

const DAY_PATTERNS: Record<number, DayPattern[]> = {
  2: [
    { label: "第 1 天 · 全身 A", focus: "蹲 + 水平推 + 水平拉", slots: ["legs", "push", "pull", "legs", "core"] },
    { label: "第 2 天 · 全身 B", focus: "髋主导 + 垂直推 + 垂直拉", slots: ["legs", "push", "pull", "legs", "core"] },
  ],
  3: [
    { label: "第 1 天 · 全身 A", focus: "基础动作模式", slots: ["legs", "push", "pull", "legs", "core"] },
    { label: "第 2 天 · 全身 B", focus: "髋主导与上肢补充", slots: ["legs", "push", "pull", "push", "core"] },
    { label: "第 3 天 · 全身 C", focus: "单侧与后链", slots: ["legs", "pull", "push", "legs", "core"] },
  ],
  4: [
    { label: "第 1 天 · 上肢 A", focus: "推为主，拉等量", slots: ["push", "pull", "push", "pull", "push"] },
    { label: "第 2 天 · 下肢 A", focus: "膝主导为主", slots: ["legs", "legs", "legs", "legs", "core"] },
    { label: "第 3 天 · 上肢 B", focus: "拉为主，推等量", slots: ["pull", "push", "pull", "push", "pull"] },
    { label: "第 4 天 · 下肢 B", focus: "髋主导为主", slots: ["legs", "legs", "legs", "legs", "core"] },
  ],
  5: [
    { label: "第 1 天 · 推", focus: "胸 / 肩 / 肱三头", slots: ["push", "push", "push", "push", "push"] },
    { label: "第 2 天 · 拉", focus: "背 / 肩后束 / 肱二头", slots: ["pull", "pull", "pull", "pull", "pull"] },
    { label: "第 3 天 · 腿", focus: "股四头 / 臀腘 / 小腿", slots: ["legs", "legs", "legs", "legs", "core"] },
    { label: "第 4 天 · 上肢补充", focus: "均衡补量", slots: ["push", "pull", "push", "pull", "core"] },
    { label: "第 5 天 · 下肢补充", focus: "单侧与后链", slots: ["legs", "legs", "legs", "legs", "core"] },
  ],
  6: [
    { label: "第 1 天 · 推 A", focus: "水平推为主", slots: ["push", "push", "push", "push", "push"] },
    { label: "第 2 天 · 拉 A", focus: "垂直拉为主", slots: ["pull", "pull", "pull", "pull", "pull"] },
    { label: "第 3 天 · 腿 A", focus: "膝主导为主", slots: ["legs", "legs", "legs", "legs", "core"] },
    { label: "第 4 天 · 推 B", focus: "垂直推为主", slots: ["push", "push", "push", "push", "push"] },
    { label: "第 5 天 · 拉 B", focus: "水平拉为主", slots: ["pull", "pull", "pull", "pull", "pull"] },
    { label: "第 6 天 · 腿 B", focus: "髋主导为主", slots: ["legs", "legs", "legs", "legs", "core"] },
  ],
};

const SUGGESTED: Record<number, string> = {
  2: "周二 / 周六",
  3: "周一 / 周三 / 周五",
  4: "周一 / 周二 / 周四 / 周五",
  5: "周一 / 周二 / 周三 / 周五 / 周六",
  6: "周一至周六（周日休息）",
};

export function GeneratorTool() {
  const [level, setLevel] = useState<Level>("beginner");
  const [days, setDays] = useState(3);
  const [equipment, setEquipment] = useState<Equipment>("gym");
  const [minutes, setMinutes] = useState(60);
  const [goal, setGoal] = useState<Goal>("hypertrophy");
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const baseSets = level === "zero" ? 2 : level === "beginner" ? 3 : 4;
  const adjusted = Math.max(2, Math.min(6, baseSets + (goal === "strength" ? 1 : 0) - (minutes <= 30 ? 1 : 0)));
  const reps = goal === "strength" ? "4–6" : goal === "maintain" ? "8–10" : "8–12";
  const rest = goal === "strength" ? "2–3 分钟" : "90 秒";
  const rir = level === "zero" ? "3–4" : level === "beginner" ? "2–3" : "1–2";

  const planDays = useMemo(() => {
    return (DAY_PATTERNS[days] ?? DAY_PATTERNS[3]).map((pattern, di) => {
      const used: Record<Slot, number> = { push: 0, pull: 0, legs: 0, core: 0 };
      const moves = pattern.slots.map((slot, mi) => {
        const pool = POOLS[equipment][slot];
        const name = pool[used[slot] % pool.length];
        used[slot] += 1;
        const key = `${di}-${mi}`;
        return { key, name, sets: overrides[key] ?? adjusted, reps, rest, rir };
      });
      return { label: pattern.label, focus: pattern.focus, moves };
    });
  }, [days, equipment, overrides, adjusted, reps, rest, rir]);

  const totalSets = planDays.reduce((s, d) => s + d.moves.reduce((x, m) => x + m.sets, 0), 0);
  const totalMoves = planDays.reduce((s, d) => s + d.moves.length, 0);

  const payload = () => ({
    generatedBy: "IRON NOTES 训练计划生成器",
    note: "模板示例，非个体化处方；所有组数次数为起点，请按动作质量与恢复情况调整。",
    createdAt: new Date().toISOString(),
    params: { level, days, equipment, minutes, goal },
    schedule: planDays,
  });

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField<Level>
            label="训练经验"
            value={level}
            onChange={(v) => { setLevel(v); setOverrides({}); }}
            options={[
              { value: "zero", label: "零基础 / 刚开始系统训练" },
              { value: "beginner", label: "初级 / 稳定训练不到 1 年" },
              { value: "intermediate", label: "中级 / 1 年以上，动作稳定" },
            ]}
          />
          <SegmentedField<number>
            label="每周训练天数"
            value={days}
            onChange={(v) => { setDays(v); setOverrides({}); }}
            options={[2, 3, 4, 5, 6].map((d) => ({ value: d, label: `${d} 天` }))}
          />
          <SelectField<Equipment>
            label="器械条件"
            value={equipment}
            onChange={setEquipment}
            options={[
              { value: "gym", label: "商业健身房（杠铃 + 固定器械）" },
              { value: "dumbbell", label: "仅一对可调哑铃 + 凳" },
              { value: "bodyweight", label: "基本徒手（可选单杠）" },
            ]}
            hint="徒手条件下，拉类动作需要单杠、桌沿或低杠等替代条件。"
          />
          <SegmentedField<number>
            label="单次可用时长"
            value={minutes}
            onChange={setMinutes}
            options={[{ value: 30, label: "30 分钟" }, { value: 45, label: "45 分钟" }, { value: 60, label: "60 分钟" }, { value: 75, label: "75 分钟" }]}
          />
          <SelectField<Goal>
            label="主要目标"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "hypertrophy", label: "增肌（默认）" },
              { value: "strength", label: "兼顾力量" },
              { value: "maintain", label: "维持 / 时间有限" },
            ]}
          />
        </>
      }
      outputs={
        <>
          <ResultGrid>
            <ResultItem label="每周训练日" value={days} unit="天" accent="#f4a07a" note={`示例排布：${SUGGESTED[days]}`} />
            <ResultItem label="周总组数" value={totalSets} unit="组" note={`共 ${totalMoves} 个动作条目`} />
            <ResultItem label="每次动作数" value={planDays[0]?.moves.length ?? 0} unit="个" note={`按 ${minutes} 分钟安排`} />
            <ResultItem label="建议强度" value={rir} unit="RIR" note="留有余力，不追求每组力竭" />
          </ResultGrid>
          <ResultLines
            items={[
              { label: "组数 / 次数", value: `${adjusted} 组 × ${reps} 次（可在下方逐项修改）` },
              { label: "组间休息", value: rest },
              { label: "分化方式", value: days <= 3 ? "全身训练" : days === 4 ? "上下肢分化" : "推 / 拉 / 腿及其变体" },
              { label: "进阶规则", value: "全部组达到次数上限且 RIR 仍充足，再小幅加重量" },
            ]}
          />
        </>
      }
      notes={
        <>
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="eyebrow !text-[11px]">GENERATED WEEK / 周训练表</div>
                <h3 className="mt-2 text-[18px] font-bold text-ink">可编辑的模板安排</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">组数可以逐项修改；动作名称是示例搭配，可在动作图鉴里替换为等价动作。</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => { ADAPTER.write("generator-plan", payload()); setSaved(true); }}
                  className="btn btn-primary btn-sm"
                >
                  {saved ? "已保存到本地" : "保存到本地"}
                </button>
                <button type="button" onClick={() => downloadJSON("iron-notes-generated-plan.json", payload())} className="btn btn-outline btn-sm">导出 JSON</button>
                <button type="button" onClick={() => { setOverrides({}); setSaved(false); }} className="btn btn-outline btn-sm">恢复默认组数</button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {planDays.map((d) => (
                <div key={d.label} className="rounded-xl border border-line bg-paper/30 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-[14.5px] font-bold text-ink">{d.label}</h4>
                    <span className="text-[11.5px] text-muted">{d.moves.reduce((s, m) => s + m.sets, 0)} 组</span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-brand-dark">{d.focus}</p>
                  <ul className="mt-3 space-y-2">
                    {d.moves.map((m) => (
                      <li key={m.key} className="flex items-center gap-2 border-t border-line pt-2">
                        <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-2" title={m.name}>{m.name}</span>
                        <input
                          type="number"
                          min={1}
                          max={8}
                          value={m.sets}
                          onChange={(e) => {
                            const v = Math.max(1, Math.min(8, Number(e.target.value) || 1));
                            setOverrides((o) => ({ ...o, [m.key]: v }));
                          }}
                          aria-label={`${m.name} 组数`}
                          className="w-12 rounded-md border border-line bg-white px-1.5 py-1 text-center font-mono text-[12px] text-ink outline-none focus:border-brand"
                        />
                        <span className="w-14 shrink-0 text-right text-[11px] text-muted">{m.reps} 次</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[11px] text-muted">组间 {rest} · RIR {rir}</p>
                </div>
              ))}
            </div>
          </div>
          <FormulaBox title="生成逻辑与调整顺序">
            <p>先按每周天数决定分化方式（2–3 天用全身、4 天用上下肢、5–6 天用推拉腿变体），再按器械条件从动作池里取等价动作，最后按经验、时长与目标给出组数、次数和 RIR 起点。</p>
            <p>这只是起点。调整顺序建议是：先保证执行率 → 再看动作质量与疼痛 → 再看两周以上的表现趋势 → 最后才改组数。一次只改一个变量，否则很难判断是什么起了作用。</p>
            <p>热身、减量与替代动作没有写进表格，请参照<Link href="/plans" className="text-brand-dark underline">训练计划库</Link>中对应计划的说明。</p>
          </FormulaBox>
          <ToolDisclaimer>生成的安排是教学模板，不是个体化训练或医学处方。存在疼痛、伤病、慢性疾病或特殊生理状态时，请先咨询医生与具备资质的专业人员；本站不提供任何非法药物方案，也不承诺固定时间内必然增长多少肌肉。</ToolDisclaimer>
        </>
      }
    />
  );
}
