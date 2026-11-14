"use client";

import dynamic from "next/dynamic";
import type { EChartsOption } from "echarts";

/** 图表按需加载：ECharts 仅在渲染图表时进入客户端 bundle，且不做 SSR。 */
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-paper/60">
      <span className="font-display text-[12px] tracking-[0.2em] text-muted">LOADING CHART…</span>
    </div>
  ),
});

export function EChart({
  option,
  height = 320,
}: {
  option: EChartsOption;
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ReactECharts
        option={option}
        notMerge
        lazyUpdate
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
}
