"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, PencilLine, RotateCcw, Database, Check, X } from "lucide-react";
import { EChart } from "@/components/charts/EChart";
import { chartById, buildOption, isChartEmpty, defaultValues } from "@/components/charts/registry";
import { ADAPTER } from "@/lib/storage";
import { cn } from "@/lib/utils";

/**
 * 可复用图表卡片：标题、说明、统计口径、单位、图例、Tooltip、
 * 响应式、示例数据标识、空状态，并支持用户录入自己的数据后动态重绘。
 */
export function ChartBlock({
  id,
  editable = false,
  compact = false,
  height = 320,
  values: externalValues,
  className,
}: {
  id: string;
  editable?: boolean;
  compact?: boolean;
  height?: number;
  values?: Record<string, number[]>;
  className?: string;
}) {
  const def = chartById[id];
  const [custom, setCustom] = useState<Record<string, number[]> | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!def || !editable) return;
    const saved = ADAPTER.read<Record<string, number[]> | null>(`chart:${id}`, null);
    if (saved) setCustom(saved);
  }, [def, editable, id]);

  const values = useMemo(() => externalValues ?? custom ?? undefined, [externalValues, custom]);
  const empty = def ? isChartEmpty(def, values) : true;
  const option = useMemo(() => (def ? buildOption(def, values) : {}), [def, values]);
  const isCustom = Boolean(custom || externalValues);

  if (!def) return null;

  const openEditor = () => {
    const base = values ?? defaultValues(def);
    setDraft(Object.fromEntries(def.series.map((s) => [s.name, (base[s.name] ?? s.data).join(", ")])));
    setEditing(true);
  };

  const apply = () => {
    const next: Record<string, number[]> = {};
    for (const s of def.series) {
      next[s.name] = draft[s.name]
        .split(/[,，\s]+/)
        .map((x) => Number(x.trim()))
        .filter((n) => Number.isFinite(n));
    }
    setCustom(next);
    ADAPTER.write(`chart:${id}`, next);
    setEditing(false);
  };

  const reset = () => {
    setCustom(null);
    ADAPTER.remove(`chart:${id}`);
    setEditing(false);
  };

  return (
    <section className={cn("overflow-hidden rounded-2xl border border-line bg-white", className)}>
      <div className="border-b border-line px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow !text-[11px]">{def.en}</span>
              <span className="inline-flex items-center gap-1 rounded-md border border-line bg-paper px-2 py-0.5 font-mono text-[10.5px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {isCustom ? (externalValues ? "我的记录数据" : "用户录入数据") : "示例数据 · SAMPLE"}
              </span>
            </div>
            <h3 className="mt-2 text-[18px] font-bold tracking-[-0.01em] text-ink">{def.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="tag">{def.category}</span>
            {editable && (
              <button
                type="button"
                onClick={editing ? () => setEditing(false) : openEditor}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[12px] text-ink-2 transition hover:border-brand hover:text-brand-dark"
              >
                {editing ? <X size={13} /> : <PencilLine size={13} />}
                {editing ? "取消" : "录入我的数据"}
              </button>
            )}
          </div>
        </div>
        {!compact && <p className="mt-2 text-[13px] leading-relaxed text-muted">{def.description}</p>}
      </div>

      {editing && (
        <div className="border-b border-line bg-paper/70 px-5 py-4 md:px-6">
          <p className="mb-3 text-[12.5px] text-muted">
            按下方顺序输入数值，用逗号分隔；数据只会保存在这台设备的浏览器里。
          </p>
          <div className="space-y-2.5">
            {def.series.map((s) => (
              <label key={s.name} className="block">
                <span className="mb-1 flex items-center gap-2 text-[12px] font-medium text-ink-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                  {s.name} <span className="font-normal text-muted">（{def.axis.length} 个值）</span>
                </span>
                <input
                  value={draft[s.name] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [s.name]: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 font-mono text-[12.5px] text-ink outline-none focus:border-brand"
                  placeholder="例如 10, 12, 14, 16"
                />
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={apply} className="btn btn-primary btn-sm">
              <Check size={14} /> 应用并保存到本地
            </button>
            <button type="button" onClick={reset} className="btn btn-outline btn-sm">
              <RotateCcw size={14} /> 恢复示例数据
            </button>
          </div>
        </div>
      )}

      <div className="px-2 py-4 md:px-4">
        {empty ? (
          <div
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-paper/60 text-center"
            style={{ height }}
          >
            <Database size={26} className="mb-3 text-muted/70" />
            <p className="text-[14px] font-semibold text-ink-2">暂无可绘制的数据</p>
            <p className="mt-1.5 max-w-sm px-4 text-[12.5px] leading-relaxed text-muted">{def.emptyHint}</p>
          </div>
        ) : (
          <EChart option={option} height={height} />
        )}
      </div>

      <div className="border-t border-line bg-paper/50 px-5 py-3.5 md:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11.5px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <BarChart3 size={13} /> 单位：{def.unit}
          </span>
          <span>图例：{def.series.map((s) => s.name).join(" / ")}</span>
          <span>Tooltip：悬停查看数值</span>
        </div>
        {!compact && (
          <>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              <span className="font-semibold text-ink-2">统计口径：</span>
              {def.methodology}
            </p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
              <span className="font-semibold text-ink-2">读图提示：</span>
              {def.insight}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
