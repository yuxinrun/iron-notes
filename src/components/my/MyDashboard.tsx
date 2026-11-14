"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Bookmark, CalendarCheck, Ruler, NotebookPen, SlidersHorizontal, Download, Trash2, ArrowUpRight } from "lucide-react";
import { EmptyState, Tag } from "@/components/ui";
import { charts } from "@/components/charts/registry";
import { ADAPTER, KEYS, readFavorites, readCheckIns, readBodyRecords, readTrainingLogs, toggleFavorite, subscribeStorage } from "@/lib/storage";
import { cn, downloadJSON } from "@/lib/utils";
import type { FavoriteItem, CheckIn, BodyRecord, TrainingLog } from "@/types";

export interface MyIndexEntry {
  title: string;
  href: string;
  channel: string;
}

type Tab = "favorites" | "checkins" | "body" | "logs" | "plan";

const TABS: { key: Tab; label: string; icon: ReactNode }[] = [
  { key: "favorites", label: "收藏", icon: <Bookmark size={15} /> },
  { key: "checkins", label: "计划打卡", icon: <CalendarCheck size={15} /> },
  { key: "body", label: "身体记录", icon: <Ruler size={15} /> },
  { key: "logs", label: "训练日志", icon: <NotebookPen size={15} /> },
  { key: "plan", label: "生成的计划", icon: <SlidersHorizontal size={15} /> },
];

const KIND_LABEL: Record<FavoriteItem["kind"], string> = {
  article: "文章",
  exercise: "动作",
  plan: "训练计划",
};

interface GeneratedPlan {
  params?: Record<string, string | number>;
  schedule?: { label: string; moves: { name: string }[] }[];
  createdAt?: string;
}

export function MyDashboard({ index }: { index: Record<string, MyIndexEntry> }) {
  const [tab, setTab] = useState<Tab>("favorites");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [body, setBody] = useState<BodyRecord[]>([]);
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [generated, setGenerated] = useState<GeneratedPlan | null>(null);

  useEffect(() => {
    const sync = () => {
      setFavorites(readFavorites());
      setCheckins(readCheckIns());
      setBody(readBodyRecords());
      setLogs(readTrainingLogs());
      setGenerated(ADAPTER.read<GeneratedPlan | null>("generator-plan", null));
    };
    sync();
    return subscribeStorage(sync);
  }, []);

  const sortedFavorites = useMemo(
    () => [...favorites].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [favorites],
  );
  const sortedBody = useMemo(() => [...body].sort((a, b) => b.date.localeCompare(a.date)), [body]);
  const sortedLogs = useMemo(() => [...logs].sort((a, b) => b.date.localeCompare(a.date)), [logs]);
  const sortedCheckins = useMemo(() => [...checkins].sort((a, b) => b.date.localeCompare(a.date)), [checkins]);

  const stats = [
    { label: "收藏", value: favorites.length, icon: <Bookmark size={16} /> },
    { label: "打卡", value: checkins.length, icon: <CalendarCheck size={16} /> },
    { label: "身体记录", value: body.length, icon: <Ruler size={16} /> },
    { label: "训练日志", value: logs.length, icon: <NotebookPen size={16} /> },
  ];

  const exportAll = () =>
    downloadJSON("iron-notes-my-data.json", {
      exportedAt: new Date().toISOString(),
      note: "IRON NOTES 本地数据备份，仅包含这台设备浏览器里保存的内容。",
      favorites,
      checkIns: checkins,
      bodyRecords: body,
      trainingLogs: logs,
      generatedPlan: generated,
    });

  const clearAll = () => {
    if (!window.confirm("确定清空这台设备上的全部收藏、打卡与记录吗？此操作不可撤销，建议先导出备份。")) return;
    for (const k of Object.values(KEYS)) ADAPTER.remove(k);
    ADAPTER.remove("generator-plan");
    for (const c of charts) ADAPTER.remove(`chart:${c.id}`);
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">{s.icon}</span>
            <div>
              <div className="font-display text-[28px] font-bold leading-none text-ink">{s.value}</div>
              <div className="mt-1 text-[12px] text-muted">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
        <div className="text-[12.5px] leading-relaxed text-muted">
          所有数据只保存在这台设备的浏览器里，不会上传服务器。清除浏览器数据或更换设备前，请先导出备份。
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={exportAll} className="btn btn-outline btn-sm"><Download size={14} /> 导出全部数据</button>
          <button type="button" onClick={clearAll} className="btn btn-outline btn-sm text-brand-dark"><Trash2 size={14} /> 清空</button>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-1.5 border-b border-line pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] transition",
              tab === t.key ? "bg-carbon font-semibold text-white" : "bg-white text-ink-2 hover:bg-paper-2",
            )}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "favorites" && (
          sortedFavorites.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {sortedFavorites.map((f) => {
                const entry = index[`${f.kind}:${f.id}`];
                return (
                  <div key={`${f.kind}:${f.id}`} className="card flex items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2"><Tag tone="brand">{KIND_LABEL[f.kind]}</Tag><span className="text-[11px] text-muted">{f.createdAt.slice(0, 10)}</span></div>
                      {entry ? (
                        <Link href={entry.href} className="mt-2 block truncate text-[14.5px] font-semibold text-ink hover:text-brand-dark">{entry.title}</Link>
                      ) : (
                        <p className="mt-2 truncate text-[14.5px] text-muted">该内容已不存在（{f.id}）</p>
                      )}
                      {entry && <p className="mt-0.5 text-[11.5px] text-muted">{entry.channel}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {entry && <Link href={entry.href} aria-label="打开" className="text-muted hover:text-brand-dark"><ArrowUpRight size={16} /></Link>}
                      <button
                        type="button"
                        onClick={() => toggleFavorite(f.kind, f.id)}
                        className="text-[11.5px] text-muted hover:text-brand-dark"
                      >
                        移除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="还没有收藏任何内容"
              desc="在文章、动作详情页或训练计划页点击「收藏」，这里就会列出入口，方便下次接着读。"
              icon={<Bookmark size={22} />}
              action={<Link href="/articles" className="btn btn-primary btn-sm">去浏览文章</Link>}
            />
          )
        )}

        {tab === "checkins" && (
          sortedCheckins.length ? (
            <div className="card overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-paper-2 text-ink"><tr><th className="px-4 py-3 font-semibold">日期</th><th className="px-4 py-3 font-semibold">计划</th><th className="px-4 py-3 font-semibold">训练日</th></tr></thead>
                <tbody>
                  {sortedCheckins.map((c, i) => (
                    <tr key={`${c.planSlug}-${c.dayIndex}-${c.date}-${i}`} className="border-t border-line bg-white">
                      <td className="px-4 py-3 text-ink-2">{c.date}</td>
                      <td className="px-4 py-3 text-ink">{index[`plan:${c.planSlug}`]?.title ?? c.planSlug}</td>
                      <td className="px-4 py-3 text-ink-2">第 {c.dayIndex + 1} 个训练日</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="还没有训练打卡" desc="打开任一训练计划详情页，在周训练表里勾选今天完成的训练日。" icon={<CalendarCheck size={22} />} action={<Link href="/plans" className="btn btn-primary btn-sm">查看训练计划</Link>} />
          )
        )}

        {tab === "body" && (
          sortedBody.length ? (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[12.5px]">
                <thead className="bg-paper-2 text-ink"><tr>{["日期", "体重 (kg)", "腰围 (cm)", "胸围 (cm)", "臂围 (cm)", "腿围 (cm)", "表现备注"].map((h) => <th key={h} className="px-3.5 py-3 font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {sortedBody.map((r) => (
                    <tr key={r.id} className="border-t border-line bg-white">
                      <td className="px-3.5 py-2.5 font-medium text-ink">{r.date}</td>
                      {(["weight", "waist", "chest", "arm", "thigh"] as const).map((k) => (
                        <td key={k} className="px-3.5 py-2.5 text-ink-2">{r[k] ?? "—"}</td>
                      ))}
                      <td className="px-3.5 py-2.5 text-muted">{r.performance || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="还没有身体记录" desc="用「增肌进度记录器」保存体重、围度与训练表现，趋势图会使用你自己的数据。" icon={<Ruler size={22} />} action={<Link href="/tools/progress" className="btn btn-primary btn-sm">打开进度记录器</Link>} />
          )
        )}

        {tab === "logs" && (
          sortedLogs.length ? (
            <div className="space-y-3">
              {sortedLogs.map((l) => (
                <div key={l.id} className="card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[14px] font-bold text-ink">{l.date}</p>
                    <div className="flex gap-1.5"><Tag>{index[`plan:${l.planSlug ?? ""}`]?.title ?? "自由训练"}</Tag>{l.duration && <Tag>{l.duration} 分钟</Tag>}</div>
                  </div>
                  {l.note && <p className="mt-2 text-[12.5px] text-muted">{l.note}</p>}
                  {l.sets.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {l.sets.map((s, i) => <Tag key={i}>{s.exercise} {s.weight} kg × {s.reps}{s.rir !== undefined ? ` · RIR ${s.rir}` : ""}</Tag>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="还没有训练日志" desc="训练日志用于记录实际完成的组次与表现，配合数据实验室读趋势。" icon={<NotebookPen size={22} />} action={<Link href="/lab" className="btn btn-primary btn-sm">去数据实验室</Link>} />
          )
        )}

        {tab === "plan" && (
          generated?.schedule?.length ? (
            <div className="card p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="eyebrow !text-[11px]">SAVED PLAN / 本地保存的生成计划</div>
                  <h3 className="mt-2 text-[18px] font-bold text-ink">每周 {generated.schedule.length} 练 · 共 {generated.schedule.reduce((s, d) => s + d.moves.length, 0)} 个动作条目</h3>
                  <p className="mt-1 text-[12px] text-muted">保存于 {generated.createdAt?.slice(0, 10) ?? "本机"}</p>
                </div>
                <Link href="/tools/generator" className="btn btn-outline btn-sm">重新生成</Link>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {generated.schedule.map((d) => (
                  <div key={d.label} className="rounded-xl border border-line bg-paper/40 p-4">
                    <p className="text-[13.5px] font-bold text-ink">{d.label}</p>
                    <ul className="mt-2 space-y-1">
                      {d.moves.map((m, i) => <li key={i} className="text-[12px] text-ink-2">· {m.name}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState title="还没有保存生成的计划" desc="在「训练计划生成器」里配置好条件后点击「保存到本地」，这里就能随时查看。" icon={<SlidersHorizontal size={22} />} action={<Link href="/tools/generator" className="btn btn-primary btn-sm">打开生成器</Link>} />
          )
        )}
      </div>
    </>
  );
}
