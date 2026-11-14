import { getArticle } from "@/lib/content";
import type { ArticleMeta } from "@/types";

const map: Record<string, string[]> = {
  "zero-to-three": ["start-from-zero", "choose-weight", "three-day-plan"],
  "full-body-3": ["three-day-plan", "training-variables", "full-body-vs-upper-lower"],
  "upper-lower-4": ["four-day-plan", "full-body-vs-upper-lower", "weekly-sets"],
  "ppl-3": ["ppl-explained", "training-frequency", "weekly-sets"],
  "ppl-6": ["ppl-explained", "plateau", "failure-training"],
  "two-day-minimal": ["training-frequency", "start-from-zero", "ten-habits"],
  "home-dumbbell-4": ["four-day-plan", "rep-ranges", "progressive-overload"],
  "machine-3": ["start-from-zero", "choose-weight", "three-day-plan"],
  "five-day-split": ["training-frequency", "weekly-sets", "shoulder-training"],
  "strength-hypertrophy-4": ["rep-ranges", "progressive-overload", "plateau"],
  "time-efficient-3": ["training-frequency", "failure-training", "rir-rpe"],
};

const fallback = ["start-from-zero", "training-variables", "weekly-sets"];

export function planArticles(slug: string): ArticleMeta[] {
  return (map[slug] ?? fallback)
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map(({ content: _content, toc: _toc, ...meta }) => meta)
    .slice(0, 3);
}
