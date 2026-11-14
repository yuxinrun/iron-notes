import { getArticle } from "@/lib/content";
import type { ArticleMeta } from "@/types";

/** 动作 → 相关文章映射；未显式配置时回退到动作技术类文章。 */
const map: Record<string, string[]> = {
  "barbell-bench-press": ["bench-press", "chest-training", "choose-weight"],
  "incline-dumbbell-press": ["chest-training", "bench-press", "rep-ranges"],
  "cable-fly": ["chest-training", "rep-ranges", "weekly-sets"],
  "pull-up": ["back-training", "failure-training", "rir-rpe"],
  "barbell-row": ["back-training", "deadlift", "ten-habits"],
  "lat-pulldown": ["back-training", "training-variables", "rir-rpe"],
  "back-squat": ["squat", "leg-training", "choose-weight"],
  deadlift: ["deadlift", "leg-training", "four-day-plan"],
  "romanian-deadlift": ["leg-training", "squat", "failure-training"],
  "leg-press": ["leg-training", "rep-ranges", "start-from-zero"],
  "bulgarian-split-squat": ["leg-training", "three-day-plan", "weekly-sets"],
  "leg-curl": ["leg-training", "rep-ranges", "doms"],
  "hip-thrust": ["leg-training", "four-day-plan", "progressive-overload"],
  "standing-calf-raise": ["leg-training", "rep-ranges", "ten-habits"],
  "lateral-raise": ["shoulder-training", "failure-training", "rir-rpe"],
  "overhead-press": ["shoulder-training", "chest-training", "choose-weight"],
  "face-pull": ["shoulder-training", "back-training", "ten-habits"],
  "dumbbell-curl": ["rep-ranges", "failure-training", "rir-rpe"],
  "hammer-curl": ["rep-ranges", "training-variables", "ten-habits"],
  "triceps-pushdown": ["failure-training", "rep-ranges", "rir-rpe"],
  "close-grip-bench-press": ["bench-press", "chest-training", "weekly-sets"],
  "farmer-carry": ["ten-habits", "back-training", "plateau"],
  "hanging-leg-raise": ["leg-training", "start-from-zero", "ten-habits"],
  plank: ["start-from-zero", "ten-habits", "doms"],
};

const fallback = ["start-from-zero", "training-variables", "ten-habits"];

export function articlesByExercise(slug: string): ArticleMeta[] {
  const slugs = map[slug] ?? fallback;
  return slugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map(({ content: _content, toc: _toc, ...meta }) => meta)
    .slice(0, 3);
}
