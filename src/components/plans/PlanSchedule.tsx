"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, CircleCheck, CalendarCheck2, ArrowUpRight } from "lucide-react";
import { readCheckIns, writeCheckIns, subscribeStorage } from "@/lib/storage";
import { todayISO } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { WorkoutPlan, CheckIn } from "@/types";

const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export function suggestedDays(count: number): number[] {
  const map: Record<number, number[]> = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 3, 4, 5],
  };
  return map[count] ?? [0, 2, 4];
}

export function PlanSchedule({ plan }: { plan: WorkoutPlan }) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const days = useMemo(() => suggestedDays(plan.daysPerWeek), [plan.daysPerWeek]);

  useEffect(() => {
    const sync = () => setCheckIns(readCheckIns().filter((c) => c.planSlug === plan.slug));
    sync();
    return subscribeStorage(sync);
  }, [plan.slug]);

  const toggle = (dayIndex: number) => {
    const all = readCheckIns();
    const today = todayISO();
    const idx = all.findIndex((c) => c.planSlug === plan.slug && c.dayIndex === dayIndex && c.date === today);
    if (idx >= 0) all.splice(idx, 1);
    else all.push({ planSlug: plan.slug, dayIndex, date: today });
    writeCheckIns(all);
  };

  const isDone = (dayIndex: number) => checkIns.some((c) => c.dayIndex === dayIndex && c.date === todayISO());
  const doneToday = days.filter((d, i) => isDone(i)).length;

  const dayToScheduleIndex = new Map<number, number>();
  days.forEach((d, i) => dayToScheduleIndex.set(d, i));

  return (
    <>
      {/* 可视化周训练表 */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/60 px-5 py-4">
          <div>
            <div className="eyebrow !text-[10px]">WEEKLY SCHEDULE / 周训练表（建议日程）</div>
            <h3 className="mt-1 text-[17px] font-bold text-ink">每周 {plan.daysPerWeek} 练 · {plan.split}</h3>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-[12.5px] text-ink-2">
            <CalendarCheck2 size={15} className="text-brand" />
            今日已打卡 <span className="font-bold text-brand-dark">{doneToday}/{plan.daysPerWeek}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-7 lg:divide-x">
          {WEEKDAYS.map((label, di) => {
            const si = dayToScheduleIndex.get(di);
            const day = si === undefined ? undefined : plan.schedule[si];
            const done = si !== undefined && isDone(si);
            return (
              <div key={label} className={cn("min-h-[150px] p-3", day ? "bg-white" : "bg-paper/50")}>
                <div className="flex items-center justify-between">
                  <span className="font-display text-[12px] font-bold tracking-wider text-muted">{label}</span>
                  {day && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                </div>
                {day ? (
                  <>
                    <div className="mt-2 text-[13px] font-bold leading-snug text-ink">{day.label}</div>
                    <div className="mt-1 text-[11.5px] leading-snug text-muted">{day.focus}</div>
                    <div className="mt-2 space-y-1">
                      {day.exercises.slice(0, 3).map((ex, i) => (
                        <div key={i} className="truncate text-[11px] text-ink-2">· {ex.name}</div>
                      ))}
                      {day.exercises.length > 3 && <div className="text-[11px] text-muted">+{day.exercises.length - 3} 个动作</div>}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(si as number)}
                      className={cn(
                        "mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border py-1.5 text-[11.5px] font-medium transition",
                        done ? "border-data1 bg-data1/10 text-data1" : "border-line text-muted hover:border-brand hover:text-brand-dark",
                      )}
                    >
                      {done ? <><Check size={12} /> 今日已完成</> : "标记完成"}
                    </button>
                  </>
                ) : (
                  <div className="mt-4 text-[12px] text-muted">休息 / 恢复</div>
                )}
              </div>
            );
          })}
        </div>
        <div className="border-t border-line px-5 py-3 text-[11.5px] leading-relaxed text-muted">
          日程仅为建议，可按自己的工作与恢复情况调整；打卡记录保存在本机浏览器，可在「我的收藏与记录」中查看与导出。
        </div>
      </div>

      {/* 每日动作明细 */}
      <div className="mt-6 space-y-5">
        {plan.schedule.map((day, di) => (
          <div key={di} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper/60 px-5 py-3.5">
              <div>
                <span className="font-display text-[12px] font-bold tracking-wider text-brand">DAY {String(di + 1).padStart(2, "0")}</span>
                <span className="ml-2 text-[15px] font-bold text-ink">{day.label}</span>
                <span className="ml-2 text-[12.5px] text-muted">{day.focus}</span>
              </div>
              <button
                type="button"
                onClick={() => toggle(di)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition",
                  isDone(di) ? "border-data1 bg-data1/10 text-data1" : "border-line text-muted hover:border-brand hover:text-brand-dark",
                )}
              >
                {isDone(di) ? <><CircleCheck size={14} /> 已完成</> : <><CalendarCheck2 size={14} /> 完成打卡</>}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[13px]">
                <thead className="bg-carbon text-white">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">动作</th>
                    <th className="px-4 py-2.5 font-medium">组数</th>
                    <th className="px-4 py-2.5 font-medium">次数</th>
                    <th className="px-4 py-2.5 font-medium">休息</th>
                    <th className="px-4 py-2.5 font-medium">RIR</th>
                    <th className="px-4 py-2.5 font-medium">要点 / 备注</th>
                  </tr>
                </thead>
                <tbody>
                  {day.exercises.map((ex, i) => (
                    <tr key={i} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-medium text-ink">
                        {ex.slug ? (
                          <Link href={`/exercises/${ex.slug}`} className="inline-flex items-center gap-1 hover:text-brand-dark">{ex.name} <ArrowUpRight size={12} className="text-muted" /></Link>
                        ) : ex.name}
                      </td>
                      <td className="px-4 py-3 text-ink-2">{ex.sets}</td>
                      <td className="px-4 py-3 text-ink-2">{ex.reps}</td>
                      <td className="px-4 py-3 text-ink-2">{ex.rest}</td>
                      <td className="px-4 py-3 text-ink-2">{ex.rir}</td>
                      <td className="px-4 py-3 text-[12px] text-muted">{ex.note ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
