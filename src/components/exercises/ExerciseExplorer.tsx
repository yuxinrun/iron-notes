"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { BodyMap } from "@/components/svg/body";
import { ExerciseCard } from "@/components/cards";
import { muscleGroups } from "@/data/muscle-groups";
import { exercises } from "@/data/exercises";
import { cn } from "@/lib/utils";

const highlighter: Record<string, { view: "front" | "back"; ids: string[]; color: string }> = {
  chest: { view: "front", ids: ["chest"], color: "#e0532a" },
  back: { view: "back", ids: ["back", "traps"], color: "#2f6f6b" },
  shoulders: { view: "front", ids: ["shoulders"], color: "#d98324" },
  biceps: { view: "front", ids: ["biceps"], color: "#a84a6a" },
  triceps: { view: "back", ids: ["triceps"], color: "#4c6ef5" },
  forearms: { view: "front", ids: ["forearms"], color: "#7c8a3c" },
  abs: { view: "front", ids: ["abs", "obliques"], color: "#8b959d" },
  glutes: { view: "back", ids: ["glutes"], color: "#e0532a" },
  quads: { view: "front", ids: ["quads"], color: "#2f6f6b" },
  hamstrings: { view: "back", ids: ["hamstrings"], color: "#d98324" },
  calves: { view: "back", ids: ["calves"], color: "#4c6ef5" },
  compound: { view: "front", ids: ["chest", "quads", "shoulders", "abs"], color: "#e0532a" },
};

export function ExerciseExplorer() {
  const [selected, setSelected] = useState("all");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((e) => {
      const byMuscle = selected === "all" || e.primary.includes(selected) || e.secondary.includes(selected);
      const byQuery = !q || `${e.name} ${e.en} ${e.pattern} ${e.equipment} ${e.cue}`.toLowerCase().includes(q);
      return byMuscle && byQuery;
    });
  }, [selected, query]);

  const active = selected !== "all" ? highlighter[selected] : undefined;
  const frontIds = active?.view === "front" ? active.ids : [];
  const backIds = active?.view === "back" ? active.ids : [];

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* 可交互肌群图 */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="eyebrow !text-[11px]">MUSCLE MAP / 肌群定位</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">点击右侧肌群，图中会以对应颜色标出主要训练区域。图形为分区教学示意，不代替医学解剖资料。</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(["front", "back"] as const).map((view) => (
              <div key={view} className="rounded-xl bg-paper-2/70 p-2">
                <div className="mx-auto max-w-[125px]">
                  <BodyMap
                    view={view}
                    highlight={view === "front" ? frontIds : backIds}
                    colors={Object.fromEntries((view === "front" ? frontIds : backIds).map((id) => [id, active?.color ?? "#e0532a"]))}
                  />
                </div>
                <div className="mt-1 text-center font-display text-[11px] tracking-[0.15em] text-muted">
                  {view === "front" ? "ANTERIOR / 正面" : "POSTERIOR / 背面"}
                </div>
              </div>
            ))}
          </div>
          {active && (
            <p className="mt-3 rounded-lg bg-paper px-3 py-2 text-[12px] text-ink-2">
              当前高亮：<span className="font-semibold" style={{ color: active.color }}>{muscleGroups.find((m) => m.id === selected)?.name}</span> · {muscleGroups.find((m) => m.id === selected)?.function}
            </p>
          )}
        </div>

        {/* 筛选器 */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="eyebrow !text-[11px]">FILTER / 按肌群筛选</div>
            <span className="text-[12px] text-muted">共 {exercises.length} 个动作 · 当前 {list.length} 个</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelected("all")}
              className={cn("tag transition hover:border-brand", selected === "all" && "tag-brand")}
            >
              全部动作
            </button>
            {muscleGroups.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m.id)}
                className={cn("tag transition hover:border-brand", selected === m.id && "tag-brand")}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-line bg-paper/50 px-3 py-2">
            <Search size={16} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索动作名称、英文名、器械或动作模式"
              className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted/70"
            />
            {query && <button type="button" onClick={() => setQuery("")} className="text-[12px] text-muted hover:text-ink">清除</button>}
          </div>
          {selected !== "all" && (
            <div className="mt-4 rounded-xl bg-paper/70 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-ink">{muscleGroups.find((m) => m.id === selected)?.name}</h3>
                <span className="font-display text-[12px] tracking-wider text-muted">{muscleGroups.find((m) => m.id === selected)?.en}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{muscleGroups.find((m) => m.id === selected)?.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 结果 */}
      <div className="mt-8">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white py-14 text-center">
            <p className="text-[15px] font-semibold text-ink">没有匹配的动作</p>
            <p className="mt-2 text-[13px] text-muted">换一个肌群或清空关键词试试。</p>
            <button type="button" onClick={() => { setSelected("all"); setQuery(""); }} className="btn btn-outline btn-sm mt-5">重置筛选</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((e) => <ExerciseCard key={e.slug} exercise={e} />)}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4">
        <p className="text-[12.5px] text-muted">动作详解包含起始姿势、步骤、呼吸、幅度、常见错误、代偿、调整建议与替代动作，全部配原创 SVG 图解。</p>
        <Link href="/plans" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-dark">
          把这些动作排进计划 <ArrowUpRight size={14} />
        </Link>
      </div>
    </>
  );
}
