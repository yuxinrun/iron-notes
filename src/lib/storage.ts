"use client";

import type { StorageAdapter, FavoriteItem, BodyRecord, TrainingLog, CheckIn } from "@/types";

/**
 * 本地优先的数据层。
 * 数据结构与 UI 解耦：未来接入 Supabase / PostgreSQL 时，
 * 只需实现同名的 StorageAdapter 并替换 ADAPTER 实例。
 */
class LocalStorageAdapter implements StorageAdapter {
  read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(`iron-notes:v1:${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(`iron-notes:v1:${key}`, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent("iron-notes:change", { detail: { key } }));
    } catch {
      /* 存储配额或隐私模式，静默降级 */
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(`iron-notes:v1:${key}`);
    window.dispatchEvent(new CustomEvent("iron-notes:change", { detail: { key } }));
  }
}

export const ADAPTER: StorageAdapter = new LocalStorageAdapter();

export const KEYS = {
  favorites: "favorites",
  body: "body-records",
  logs: "training-logs",
  checkins: "check-ins",
  chartData: "lab-data",
} as const;

export function readFavorites(): FavoriteItem[] {
  return ADAPTER.read<FavoriteItem[]>(KEYS.favorites, []);
}
export function writeFavorites(items: FavoriteItem[]) {
  ADAPTER.write(KEYS.favorites, items);
}
export function readBodyRecords(): BodyRecord[] {
  return ADAPTER.read<BodyRecord[]>(KEYS.body, []);
}
export function writeBodyRecords(items: BodyRecord[]) {
  ADAPTER.write(KEYS.body, items);
}
export function readTrainingLogs(): TrainingLog[] {
  return ADAPTER.read<TrainingLog[]>(KEYS.logs, []);
}
export function writeTrainingLogs(items: TrainingLog[]) {
  ADAPTER.write(KEYS.logs, items);
}
export function readCheckIns(): CheckIn[] {
  return ADAPTER.read<CheckIn[]>(KEYS.checkins, []);
}
export function writeCheckIns(items: CheckIn[]) {
  ADAPTER.write(KEYS.checkins, items);
}

export function isFavorite(kind: FavoriteItem["kind"], id: string): boolean {
  return readFavorites().some((f) => f.kind === kind && f.id === id);
}

export function toggleFavorite(kind: FavoriteItem["kind"], id: string): boolean {
  const items = readFavorites();
  const idx = items.findIndex((f) => f.kind === kind && f.id === id);
  if (idx >= 0) {
    items.splice(idx, 1);
    writeFavorites(items);
    return false;
  }
  items.push({ kind, id, createdAt: new Date().toISOString() });
  writeFavorites(items);
  return true;
}

export function useStorageEvent(handler: () => void): void {
  if (typeof window === "undefined") return;
  window.addEventListener("iron-notes:change", handler);
  window.addEventListener("storage", handler);
}

/** 返回清理函数，供 useEffect 使用 */
export function subscribeStorage(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const h = () => handler();
  window.addEventListener("iron-notes:change", h);
  window.addEventListener("storage", h);
  return () => {
    window.removeEventListener("iron-notes:change", h);
    window.removeEventListener("storage", h);
  };
}
