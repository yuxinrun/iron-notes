import Link from "next/link";
import { ChevronRight, ArrowUpRight, Info, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */
type ButtonVariant = "primary" | "dark" | "outline" | "light";
type ButtonSize = "md" | "sm";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: ReactNode;
}) {
  const variantClass: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    dark: "btn-dark",
    outline: "btn-outline",
    light: "btn-ghost-light",
  };
  return (
    <Link
      href={href}
      className={cn("btn", variantClass[variant], size === "sm" && "btn-sm", className)}
    >
      {children}
      {icon ?? <ArrowUpRight size={16} strokeWidth={2.2} />}
    </Link>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  title?: string;
}) {
  const variantClass: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    dark: "btn-dark",
    outline: "btn-outline",
    light: "btn-ghost-light",
  };
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "btn",
        variantClass[variant],
        size === "sm" && "btn-sm",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tags / Badges                                                       */
/* ------------------------------------------------------------------ */
export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "brand" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tag",
        tone === "brand" && "tag-brand",
        tone === "dark" && "tag-dark",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EvidenceBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    充分研究支持: "var(--data1)",
    "有一定证据，仍有争议": "var(--data2)",
    主要来自实践经验: "var(--data3)",
    证据尚不充分: "var(--steel)",
  };
  const color = map[level] ?? "var(--steel)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, white)`, border: `1px solid color-mix(in srgb, ${color} 28%, white)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      证据等级：{level}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  desc,
  action,
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  action?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("section-head", className)}>
      <div>
        {eyebrow && <div className={cn("eyebrow", light && "eyebrow-light")}>{eyebrow}</div>}
        <h2 className={cn("section-title", light && "text-white")}>{title}</h2>
        {desc && <p className={cn("section-desc", light && "text-white/60")}>{desc}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Breadcrumb                                                          */
/* ------------------------------------------------------------------ */
export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  return (
    <nav aria-label="面包屑导航" className={cn("flex flex-wrap items-center gap-1.5 text-[13px]", light ? "text-white/55" : "text-muted")}>
      <Link href="/" className={cn("hover:underline", light && "hover:text-white")}>首页</Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
          <ChevronRight size={13} />
          {item.href ? (
            <Link href={item.href} className={cn("hover:underline", light ? "hover:text-white" : "hover:text-brand-dark")}>
              {item.label}
            </Link>
          ) : (
            <span className={light ? "text-white/85" : "text-ink"}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Callouts                                                            */
/* ------------------------------------------------------------------ */
export function Note({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "tip" | "action";
  title?: string;
  children: ReactNode;
}) {
  const styles = {
    info: { bg: "#f1f5f5", border: "var(--data1)", icon: <Info size={17} />, color: "var(--data1)" },
    warning: { bg: "#fdf3ec", border: "var(--brand)", icon: <AlertTriangle size={17} />, color: "var(--brand-dark)" },
    tip: { bg: "#f0f3fc", border: "var(--data3)", icon: <Lightbulb size={17} />, color: "var(--data3)" },
    action: { bg: "#f3f6ea", border: "var(--data5)", icon: <CheckCircle2 size={17} />, color: "var(--data5)" },
  }[type];
  return (
    <div
      className="my-7 rounded-xl px-5 py-4"
      style={{ background: styles.bg, borderLeft: `3px solid ${styles.border}` }}
    >
      {title && (
        <div className="mb-1.5 flex items-center gap-2 text-[14px] font-bold" style={{ color: styles.color }}>
          {styles.icon}
          {title}
        </div>
      )}
      <div className="text-[15px] leading-[1.85] text-ink-2">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */
export function EmptyState({
  title,
  desc,
  icon,
  action,
}: {
  title: string;
  desc?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper-2 text-muted">
        {icon ?? <Info size={22} />}
      </div>
      <p className="text-[16px] font-semibold text-ink">{title}</p>
      {desc && <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function DataLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-2 py-1 font-mono text-[11px] tracking-wide text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {children}
    </span>
  );
}

export function PageIntro({
  eyebrow,
  title,
  desc,
  crumbs,
  meta,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  crumbs: Crumb[];
  meta?: ReactNode;
  dark?: boolean;
}) {
  return (
    <header className={cn("relative overflow-hidden", dark ? "bg-carbon text-white" : "bg-paper-2")}>
      {dark && <div className="grid-lines absolute inset-0 opacity-70" />}
      <div className="shell relative py-9 md:py-12">
        <Breadcrumb items={crumbs} light={dark} />
        <div className="mt-8 max-w-3xl">
          <div className={cn("eyebrow", dark && "eyebrow-light")}>{eyebrow}</div>
          <h1 className={cn("mt-3 text-[34px] font-bold leading-[1.2] tracking-[-0.025em] md:text-[48px]", dark && "text-white")}>
            {title}
          </h1>
          <p className={cn("mt-4 text-[15px] leading-[1.9] md:text-[16px]", dark ? "text-white/65" : "text-muted")}>
            {desc}
          </p>
          {meta && <div className="mt-6 flex flex-wrap items-center gap-3">{meta}</div>}
        </div>
      </div>
    </header>
  );
}
