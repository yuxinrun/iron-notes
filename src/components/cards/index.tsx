import Link from "next/link";
import { ArrowUpRight, Clock, BookOpen, Dumbbell, CalendarDays, ExternalLink, Star } from "lucide-react";
import { Tag } from "@/components/ui";
import { channelLabel } from "@/data/categories";
import { muscleName } from "@/data/muscle-groups";
import { cn } from "@/lib/utils";
import type { ArticleMeta, Exercise, WorkoutPlan, Book, ResourceSite } from "@/types";

/* ------------------------------------------------------------------ */
export function ArticleCard({
  article,
  variant = "default",
  index,
}: {
  article: ArticleMeta;
  variant?: "default" | "compact" | "feature";
  index?: number;
}) {
  if (variant === "compact") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex items-start gap-3 border-b border-line py-3.5 last:border-0"
      >
        {index !== undefined && (
          <span className="font-display text-[15px] font-bold text-brand/70">{String(index).padStart(2, "0")}</span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14.5px] font-semibold text-ink transition group-hover:text-brand-dark">{article.title}</span>
          <span className="mt-1 flex items-center gap-2 text-[11.5px] text-muted">
            {channelLabel(article.channel)} · {article.readingTime} 分钟 · {article.tags.slice(0, 2).join(" / ")}
          </span>
        </span>
        <ArrowUpRight size={15} className="mt-1 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "card card-hover group flex flex-col overflow-hidden",
        variant === "feature" && "bg-white",
      )}
    >
      <div className="relative h-[132px] overflow-hidden border-b border-line bg-paper-2">
        <div className="grid-lines absolute inset-0 opacity-60" />
        <div className="absolute -right-4 -top-6 font-display text-[110px] font-extrabold leading-none text-ink/[0.055]">
          {String(article.number ?? 0).padStart(2, "0")}
        </div>
        <div className="absolute bottom-4 left-5">
          <div className="eyebrow !text-[10px]">{channelLabel(article.channel)} / ARTICLE</div>
          <div className="mt-1 font-display text-[13px] font-bold tracking-[0.16em] text-ink/45">IRON NOTES</div>
        </div>
        <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 bg-white/70 text-ink/60 transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
          <ArrowUpRight size={15} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="brand">{channelLabel(article.channel)}</Tag>
          <span className="inline-flex items-center gap-1 text-[11.5px] text-muted"><Clock size={12} /> {article.readingTime} 分钟</span>
        </div>
        <h3 className="mt-3 text-[17px] font-bold leading-[1.45] tracking-[-0.01em] text-ink transition group-hover:text-brand-dark">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.75] text-muted">{article.summary || article.subtitle}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          {article.tags.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Link href={`/exercises/${exercise.slug}`} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative flex h-[150px] items-center justify-center overflow-hidden border-b border-line bg-paper-2">
        <div className="grid-lines absolute inset-0 opacity-70" />
        <div className="relative flex h-[124px] w-[124px] items-center justify-center rounded-full border border-dashed border-brand/30 bg-white/70">
          <Dumbbell size={42} strokeWidth={1.1} className="text-brand/70" />
          <span className="absolute -bottom-1 font-display text-[10px] tracking-[0.2em] text-muted">{exercise.pattern.slice(0, 8)}</span>
        </div>
        <span className="absolute right-3 top-3"><Tag tone="brand">{exercise.difficulty}</Tag></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="eyebrow !text-[10px]">{exercise.en}</div>
        <h3 className="mt-1.5 text-[17px] font-bold text-ink transition group-hover:text-brand-dark">{exercise.name}</h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {exercise.primary.map((m) => <Tag key={m} tone="brand">{muscleName(m)}</Tag>)}
          {exercise.secondary.slice(0, 2).map((m) => <Tag key={m}>{muscleName(m)}</Tag>)}
        </div>
        <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{exercise.cue}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-[11.5px] text-muted">
          <span>{exercise.equipment}</span>
          <ArrowUpRight size={15} className="text-brand" />
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
export function PlanCard({ plan }: { plan: WorkoutPlan }) {
  return (
    <Link href={`/plans/${plan.slug}`} className="card card-hover group flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow !text-[10px]">{plan.en}</div>
          <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-ink transition group-hover:text-brand-dark">{plan.name}</h3>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">
          <CalendarDays size={17} />
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted">{plan.highlight}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Tag tone="brand">每周 {plan.daysPerWeek} 练</Tag>
        {plan.levels.slice(0, 2).map((l) => <Tag key={l}>{l}</Tag>)}
        <Tag>{plan.split}</Tag>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-[11.5px] text-muted">
        <span>{plan.duration} / 次 · {plan.schedule.length} 个训练日</span>
        <ArrowUpRight size={15} className="text-brand" />
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
export function BookCover({ book, className }: { book: Book; className?: string }) {
  return (
    <div
      className={cn("relative flex aspect-[3/4] flex-col overflow-hidden rounded-r-md rounded-l-sm p-3 shadow-[4px_4px_0_rgba(20,23,26,.12)]", className)}
      style={{ background: book.accent }}
    >
      <div className="absolute inset-y-0 left-0 w-[7px] bg-black/20" />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/20" />
      <div className="absolute -right-2 top-10 h-20 w-20 rounded-full border border-white/15" />
      <div className="relative flex h-full flex-col">
        <div className="font-display text-[9px] font-bold tracking-[0.22em] text-white/75">IRON NOTES / LIBRARY</div>
        <div className="mt-3 line-clamp-4 text-[13px] font-bold leading-[1.35] text-white">{book.title}</div>
        <div className="mt-auto">
          <div className="h-px w-8 bg-white/60" />
          <div className="mt-2 line-clamp-2 text-[9.5px] leading-snug text-white/80">{book.authors}</div>
          <div className="mt-1 font-display text-[9px] tracking-wider text-white/65">{book.region} · {book.year.slice(0, 14)}</div>
        </div>
      </div>
    </div>
  );
}

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/resources#book-${book.id}`} className="card card-hover group flex gap-4 p-4">
      <div className="w-[86px] shrink-0"><BookCover book={book} /></div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5 text-[11px] text-brand-dark">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} fill={i < book.rating ? "currentColor" : "none"} strokeWidth={1.5} />
          ))}
          <span className="ml-1 text-muted">{book.difficulty}</span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[14.5px] font-bold leading-snug text-ink transition group-hover:text-brand-dark">{book.title}</h3>
        <p className="mt-1 line-clamp-1 text-[11.5px] text-muted">{book.authors}</p>
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted">{book.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-muted">
          <span className="flex items-center gap-1"><BookOpen size={12} /> {book.category}</span>
          <ArrowUpRight size={14} className="text-brand" />
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
export function SiteCard({ site }: { site: ResourceSite }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`site-${site.id}`}
      className="card card-hover group flex flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow !text-[10px]">{site.kind}</div>
          <h3 className="mt-1.5 text-[15.5px] font-bold leading-snug text-ink transition group-hover:text-brand-dark">{site.name}</h3>
        </div>
        <ExternalLink size={16} className="shrink-0 text-muted transition group-hover:text-brand" />
      </div>
      <p className="mt-3 line-clamp-3 text-[12.5px] leading-relaxed text-muted">{site.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Tag tone="brand">{site.region}</Tag>
        <Tag>{site.paid.includes("免费") ? "有免费内容" : "付费内容"}</Tag>
      </div>
      <p className="mt-auto border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
        <span className="font-semibold text-ink-2">可信度：</span>{site.credibility}
      </p>
    </a>
  );
}
