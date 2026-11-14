"use client";

import type { ReactNode } from "react";
import { Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToolLayout({
  inputs,
  outputs,
  notes,
}: {
  inputs: ReactNode;
  outputs: ReactNode;
  notes?: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
      <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
        <div className="eyebrow !text-[11px]">INPUT / 输入</div>
        <div className="mt-5 space-y-4">{inputs}</div>
      </div>
      <div className="min-w-0 space-y-5">
        <div className="rounded-2xl border border-line bg-carbon p-5 text-white md:p-7">
          <div className="eyebrow eyebrow-light">RESULT / 计算结果</div>
          <div className="mt-4">{outputs}</div>
        </div>
        {notes}
      </div>
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  unit,
  min = 0,
  max = 9999,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 text-[13px] font-semibold text-ink-2">
        {label}
        {unit && <span className="text-[11.5px] font-normal text-muted">{unit}</span>}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min);
        }}
        className="mt-1.5 w-full rounded-lg border border-line bg-paper/40 px-3 py-2.5 text-[15px] font-medium text-ink outline-none transition focus:border-brand focus:bg-white"
      />
      {hint && <span className="mt-1 block text-[11.5px] leading-relaxed text-muted">{hint}</span>}
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink-2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1.5 w-full rounded-lg border border-line bg-paper/40 px-3 py-2.5 text-[14px] text-ink outline-none transition focus:border-brand focus:bg-white"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <span className="mt-1 block text-[11.5px] leading-relaxed text-muted">{hint}</span>}
    </label>
  );
}

export function SegmentedField<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <span className="text-[13px] font-semibold text-ink-2">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-lg border px-3 py-2 text-[12.5px] transition",
              value === o.value ? "border-brand bg-brand-soft font-semibold text-brand-dark" : "border-line bg-paper/40 text-muted hover:border-brand",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ResultGrid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return <div className={cn("grid gap-3", cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>{children}</div>;
}

export function ResultItem({
  label,
  value,
  unit,
  note,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  note?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/[0.06] p-4">
      <div className="text-[11.5px] text-white/55">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="font-display text-[30px] font-bold leading-none" style={{ color: accent ?? "#fff" }}>{value}</span>
        {unit && <span className="text-[12px] text-white/55">{unit}</span>}
      </div>
      {note && <div className="mt-2 text-[11.5px] leading-relaxed text-white/45">{note}</div>}
    </div>
  );
}

export function ResultLines({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="mt-5 space-y-2 border-t border-white/12 pt-4">
      {items.map((x) => (
        <div key={x.label} className="flex flex-wrap items-start justify-between gap-2 text-[12.5px]">
          <dt className="text-white/55">{x.label}</dt>
          <dd className="text-right font-medium text-white/90">{x.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FormulaBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <div className="flex items-center gap-2 text-[14px] font-bold text-ink"><Info size={16} className="text-data1" />{title}</div>
      <div className="mt-3 text-[13px] leading-[1.85] text-ink-2">{children}</div>
    </div>
  );
}

export function ToolDisclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-brand/25 bg-brand-soft/50 px-4 py-3 text-[12.5px] leading-[1.8] text-ink-2">
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-brand-dark" />
      <div>{children}</div>
    </div>
  );
}

export function MiniTable({
  head,
  rows,
}: {
  head: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[420px] text-left text-[12.5px]">
        <thead className="bg-paper-2 text-ink"><tr>{head.map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i} className="border-t border-line bg-white">
            {r.map((c, j) => <td key={j} className={cn("px-3 py-2.5", j === 0 ? "font-medium text-ink" : "text-ink-2")}>{c}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
