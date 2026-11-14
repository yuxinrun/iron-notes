export type ChannelKey =
  | "getting-started"
  | "science"
  | "exercises"
  | "plans"
  | "nutrition"
  | "recovery"
  | "lab"
  | "resources";

export interface Channel {
  key: ChannelKey;
  label: string;
  en: string;
  href: string;
  description: string;
  detail: string;
  order: number;
}

export type EvidenceLevel =
  | "充分研究支持"
  | "有一定证据，仍有争议"
  | "主要来自实践经验"
  | "证据尚不充分";

export interface ArticleMeta {
  slug: string;
  title: string;
  subtitle: string;
  channel: ChannelKey;
  tags: string[];
  author: string;
  updated: string;
  readingTime: number;
  summary: string;
  conclusions: string[];
  evidence: EvidenceLevel;
  figure?: string;
  chart?: string;
  related: string[];
  refs?: string[];
  featured?: boolean;
  number?: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Article extends ArticleMeta {
  content: string;
  toc: TocItem[];
}

export interface Reference {
  id: string;
  title: string;
  authors: string;
  year: number | string;
  source: string;
  doi?: string;
  url?: string;
  type: string;
  population: string;
  finding: string;
  limitation: string;
  practical: string;
}

export interface MuscleGroup {
  id: string;
  name: string;
  en: string;
  side: "front" | "back" | "both";
  function: string;
  description: string;
}

export interface Exercise {
  slug: string;
  name: string;
  en: string;
  primary: string[];
  secondary: string[];
  equipment: string;
  difficulty: "入门" | "初级" | "中级" | "高级";
  pattern: string;
  figure: string;
  startPosition: string;
  steps: string[];
  breathing: string;
  rom: string;
  mistakes: string[];
  compensations: string[];
  adjustments: string[];
  phases: string[];
  alternatives: string[];
  cue: string;
}

export interface PlanExercise {
  name: string;
  slug?: string;
  sets: number;
  reps: string;
  rest: string;
  rir: string;
  note?: string;
}

export interface PlanDay {
  label: string;
  focus: string;
  exercises: PlanExercise[];
}

export interface WorkoutPlan {
  slug: string;
  name: string;
  en: string;
  levels: string[];
  daysPerWeek: number;
  split: string;
  equipment: string[];
  duration: string;
  audience: string;
  cautions: string;
  warmup: string;
  schedule: PlanDay[];
  progression: string[];
  deload: string;
  substitutes: string[];
  highlight: string;
}

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  titleCn?: string;
  authors: string;
  publisher: string;
  year: string;
  region: "国外" | "国内";
  category: string;
  difficulty: string;
  rating: number;
  audience: string;
  summary: string;
  topics: string[];
  viewpoints: string[];
  chapters: string;
  verifyNote?: string;
  link?: string;
  accent: string;
}

export interface ResourceSite {
  id: string;
  name: string;
  url: string;
  region: string;
  category: string;
  kind: "学术数据库" | "专业机构" | "研究综述平台" | "专业科普" | "教练教育" | "个人创作者平台";
  description: string;
  credibility: string;
  audience: string;
  entry: string;
  paid: string;
  note?: string;
}

export interface Quote {
  id: string;
  text: string;
  tag: string;
}

export interface Myth {
  id: string;
  claim: string;
  verdict: string;
  slug: string;
  short: string;
}

export type ToolKey =
  | "calorie"
  | "protein"
  | "macros"
  | "volume"
  | "onerm"
  | "bmi"
  | "progress"
  | "generator";

export interface ToolDef {
  key: ToolKey;
  name: string;
  en: string;
  description: string;
  icon: string;
  outputs: string[];
}

/* ---------- User data (local-first, cloud-ready) ---------- */
export interface FavoriteItem {
  kind: "article" | "exercise" | "plan";
  id: string;
  createdAt: string;
}

export interface BodyRecord {
  id: string;
  date: string;
  weight?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  thigh?: number;
  performance?: string;
  photoNote?: string;
}

export interface SetRecord {
  exercise: string;
  weight: number;
  reps: number;
  rir?: number;
}

export interface TrainingLog {
  id: string;
  date: string;
  planSlug?: string;
  planDay?: string;
  duration?: number;
  note?: string;
  sets: SetRecord[];
}

export interface CheckIn {
  planSlug: string;
  dayIndex: number;
  date: string;
}

/** 未来接入 Supabase / PostgreSQL 时只需实现同一接口 */
export interface StorageAdapter {
  read<T>(key: string, fallback: T): T;
  write<T>(key: string, value: T): void;
  remove(key: string): void;
}
