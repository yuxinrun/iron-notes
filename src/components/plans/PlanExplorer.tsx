"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { PlanCard } from "@/components/cards";
import { plans, planLevels, planDays, planEquipment } from "@/data/plans";
import { cn } from "@/lib/utils";

export function PlanExplorer() {
  const [level, setLevel] = useState("全部");
  const [days, setDays] = useState<number | "全部">("全部");
  const [equipment, setEquipment] = useState("全部");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plans.filter((p) => {
      if (level !== "全部" && !p.levels.includes(level)) return false;
      if (days !== "全部" && p.daysPerWeek !== days) return false;
      if (equipment !== "全部" && !p.equipment.includes(equipment)) return false;
      if (q && !`${p.name} ${p.en} ${p.split} ${p.audience} ${p.equipment.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [level, days, equipment, query]);

  const reset = () => { setLevel("全部"); setDays("全部"); setEquipment("全部"); setQuery(""); };
  const hasFilter = level !== "全部" || days !== "全部" || equipment !== "全部" || query.trim() !== "";

  return (
    <>
      <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="eyebrow !text-[11px]">FILTER / 按条件筛选</div>
          <span className="text-[12.5px] text-muted">共 {plans.length} 套计划 · 当前 {list.length} 套</span>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 w-[72px] shrink-0 text-[12.5px] font-semibold text-muted">训练水平</span>
            {["全部", ...planLevels].map((l) => (
              <button key={l} type="button" onClick={() => setLevel(l)} className={cn("tag transition hover:border-brand", level === l && "tag-brand")}>{l}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 w-[72px] shrink-0 text-[12.5px] font-semibold text-muted">每周天数</span>
            {(["全部", ...planDays] as const).map((d) => (
              <button key={String(d)} type="button" onClick={() => setDays(d)} className={cn("tag transition hover:border-brand", days === d && "tag-brand")}>
                {d === "全部" ? "全部" : `${d} 天`}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 w-[72px] shrink-0 text-[12.5px] font-semibold text-muted">器械条件</span>
            {["全部", ...planEquipment].map((e) => (
              <button key={e} type="button" onClick={() => setEquipment(e)} className={cn("tag transition hover:border-brand", equipment === e && "tag-brand")}>{e}</button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-line bg-paper/50 px-3 py-2">
            <Search size={16} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索计划名称、分化方式或适合人群"
              className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted/70"
            />
          </div>
          {hasFilter && (
            <button type="button" onClick={reset} className="btn btn-outline btn-sm"><RotateCcw size={14} /> 重置筛选</button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white py-14 text-center">
            <p className="text-[15px] font-semibold text-ink">没有完全匹配的计划</p>
            <p className="mt-2 px-4 text-[13px] leading-relaxed text-muted">筛选条件过窄时，可以放宽天数或器械；也可以用训练计划生成器按自己的条件生成可编辑的周安排。</p>
            <button type="button" onClick={reset} className="btn btn-outline btn-sm mt-5">重置筛选</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <PlanCard key={p.slug} plan={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
