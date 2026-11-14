"use client";

import { useEffect, useMemo, useState } from "react";
import { ChartBlock } from "@/components/charts/ChartBlock";
import { charts, chartCategories } from "@/components/charts/registry";
import { Database, PencilLine, RotateCcw } from "lucide-react";
import { ADAPTER, subscribeStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function LabExplorer() {
  const [category, setCategory] = useState("全部");
  const [customCount, setCustomCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      const count = charts.filter((c) => ADAPTER.read<number[] | null>(`chart:${c.id}`, null) !== null).length;
      setCustomCount(count);
    };
    sync();
    return subscribeStorage(sync);
  }, []);

  const list = useMemo(
    () => (category === "全部" ? charts : charts.filter((c) => c.category === category)),
    [category],
  );

  const resetAll = () => {
    for (const c of charts) ADAPTER.remove(`chart:${c.id}`);
    setCustomCount(0);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {chartCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[12.5px] transition",
              category === c
                ? "border-brand bg-brand-soft font-semibold text-brand-dark"
                : "border-line bg-white text-ink-2 hover:border-brand hover:text-brand-dark",
            )}
          >
            {c}
            <span className="ml-1.5 font-mono text-[10.5px] opacity-60">
              {c === "全部" ? charts.length : charts.filter((x) => x.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1.5"><Database size={14} /> 当前显示 {list.length} 组图表</span>
          <span className="inline-flex items-center gap-1.5"><PencilLine size={14} /> 已录入自有数据：{customCount} 组</span>
          <span>所有默认数值均为示例数据</span>
        </div>
        {customCount > 0 && (
          <button type="button" onClick={resetAll} className="inline-flex items-center gap-1.5 text-[12px] text-brand-dark hover:underline">
            <RotateCcw size={13} /> 清除全部录入数据
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {list.map((c) => (
          <ChartBlock key={c.id} id={c.id} editable height={300} />
        ))}
      </div>
    </>
  );
}
