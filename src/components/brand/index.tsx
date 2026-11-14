import Link from "next/link";
import { FRONT } from "@/components/svg/body";
import { cn } from "@/lib/utils";
import type { Quote } from "@/types";

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */
export function LogoMark({ size = 34, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="0" y="0" width="40" height="40" rx="7" fill={light ? "rgba(255,255,255,.1)" : "#14171a"} />
      <path d="M9 9 L15 9 L15 31 L9 31 Z" fill="#e0532a" />
      <path d="M19 31 L19 9 L25 9 L31 22 L31 9 L36 9 L36 31 L30 31 L25 18 L25 31 Z" fill={light ? "#fff" : "#f7f5f0"} />
    </svg>
  );
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="IRON NOTES 铁与笔记 首页">
      <LogoMark size={compact ? 30 : 34} light={light} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[21px] font-bold tracking-[0.055em]",
            light ? "text-white" : "text-ink",
          )}
        >
          IRON NOTES
        </span>
        {!compact && (
          <span className={cn("mt-1 text-[10.5px] tracking-[0.35em]", light ? "text-white/55" : "text-muted")}>
            铁 与 笔 记
          </span>
        )}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Hero 主视觉：原创解剖线稿 + 训练轨迹 + 实验室数据层                  */
/* ------------------------------------------------------------------ */
function HeroAnatomy() {
  const highlight = new Set(["chest", "shoulders", "quads"]);
  return (
    <svg viewBox="0 0 440 560" width="100%" className="h-auto w-full" role="img" aria-label="原创人体肌群解剖线稿与训练数据标注主视觉">
      <defs>
        <linearGradient id="hero-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0532a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#e0532a" stopOpacity="0.02" />
        </linearGradient>
        <radialGradient id="hero-vignette" cx="50%" cy="45%" r="62%">
          <stop offset="0%" stopColor="#2a3136" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#14171a" stopOpacity="0" />
        </radialGradient>
        <pattern id="hero-grid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0 L0 0 0 34" fill="none" stroke="rgba(255,255,255,.055)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="440" height="560" fill="url(#hero-grid)" />
      <ellipse cx="220" cy="260" rx="190" ry="240" fill="url(#hero-vignette)" />
      <circle cx="220" cy="270" r="176" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
      <circle cx="220" cy="270" r="132" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" strokeDasharray="4 7" />

      {/* 背景大号水印 */}
      <text x="220" y="300" textAnchor="middle" fill="rgba(255,255,255,.035)" fontSize="92" fontFamily="Arial Narrow, Impact, sans-serif" fontWeight="800" letterSpacing="6">
        IRON
      </text>

      {/* 坐标刻度 */}
      <g stroke="rgba(255,255,255,.18)" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={24} y1={56 + i * 40} x2={i % 3 === 0 ? 40 : 32} y2={56 + i * 40} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`r${i}`} x1={416} y1={56 + i * 40} x2={i % 3 === 0 ? 400 : 408} y2={56 + i * 40} />
        ))}
      </g>
      <text x="24" y="44" fill="rgba(255,255,255,.4)" fontSize="9" fontFamily="Arial" letterSpacing="2">LOAD / RIR</text>
      <text x="416" y="44" textAnchor="end" fill="rgba(255,255,255,.4)" fontSize="9" fontFamily="Arial" letterSpacing="2">VOLUME</text>

      {/* 训练轨迹曲线 */}
      <path d="M30 452 C90 448 110 408 158 396 C212 382 232 340 286 322 C340 304 372 268 410 246" fill="none" stroke="#e0532a" strokeWidth="2" strokeDasharray="6 5" opacity="0.8" />
      <circle cx="158" cy="396" r="3.5" fill="#e0532a" />
      <circle cx="286" cy="322" r="3.5" fill="#e0532a" />
      <circle cx="410" cy="246" r="3.5" fill="#e0532a" />

      {/* 人体解剖线稿 */}
      <g transform="translate(100 46)">
        <ellipse cx="120" cy="34" rx="19" ry="23" fill="none" stroke="rgba(255,255,255,.62)" strokeWidth="1.6" />
        <path d="M110 55 L130 55 L131 71 L109 71 Z" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.4" />
        <ellipse cx="66" cy="236" rx="8" ry="11" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1.3" />
        <ellipse cx="174" cy="236" rx="8" ry="11" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1.3" />
        <ellipse cx="103" cy="438" rx="12" ry="8" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1.3" />
        <ellipse cx="137" cy="438" rx="12" ry="8" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1.3" />
        {FRONT.map((p) => {
          const active = highlight.has(p.id);
          const fill = active ? "url(#hero-glow)" : "rgba(255,255,255,.025)";
          const stroke = active ? "#e0532a" : "rgba(255,255,255,.46)";
          return (
            <g key={p.id}>
              <path d={p.d} fill={fill} stroke={stroke} strokeWidth={active ? 1.8 : 1.3} strokeLinejoin="round" />
              {p.mirror && (
                <path d={p.d} fill={fill} stroke={stroke} strokeWidth={active ? 1.8 : 1.3} strokeLinejoin="round" transform="translate(240 0) scale(-1 1)" />
              )}
            </g>
          );
        })}
        <path d="M120 96 L120 202" stroke="rgba(255,255,255,.28)" strokeWidth="1" strokeDasharray="3 5" />
        <path d="M105 156 L135 156 M104 176 L136 176 M103 194 L137 194" stroke="rgba(255,255,255,.26)" strokeWidth="1" />
      </g>

      {/* 标注引线 */}
      <g fontFamily="Arial, sans-serif">
        <line x1="46" y1="176" x2="166" y2="176" stroke="rgba(224,83,42,.75)" strokeWidth="1" />
        <circle cx="166" cy="176" r="2.5" fill="#e0532a" />
        <text x="44" y="166" fill="#e0532a" fontSize="9.5" letterSpacing="1.6">01 / MECHANICAL TENSION</text>

        <line x1="276" y1="128" x2="394" y2="128" stroke="rgba(255,255,255,.45)" strokeWidth="1" />
        <circle cx="276" cy="128" r="2.5" fill="#fff" />
        <text x="394" y="122" textAnchor="end" fill="rgba(255,255,255,.72)" fontSize="9.5" letterSpacing="1.6">02 / TARGET MUSCLE</text>

        <line x1="46" y1="356" x2="182" y2="356" stroke="rgba(47,111,107,.85)" strokeWidth="1" />
        <circle cx="182" cy="356" r="2.5" fill="#2f6f6b" />
        <text x="44" y="374" fill="rgba(255,255,255,.6)" fontSize="9.5" letterSpacing="1.6">03 / RECOVERY CAPACITY</text>
      </g>

      {/* 角落信息 */}
      <text x="24" y="530" fill="rgba(255,255,255,.36)" fontSize="9" fontFamily="Arial" letterSpacing="1.8">ANATOMICAL TEACHING DIAGRAM · NOT MEDICAL REFERENCE</text>
      <text x="416" y="530" textAnchor="end" fill="rgba(255,255,255,.36)" fontSize="9" fontFamily="Arial" letterSpacing="1.8">FIG. 01 / TRAIN SMART</text>
    </svg>
  );
}

export function HeroVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-carbon">
      <div className="grid-lines absolute inset-0 opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(224,83,42,.12),transparent_60%)]" />
      <div className="relative flex h-full items-center justify-center p-2">
        <div className="w-full max-w-[520px]">
          <HeroAnatomy />
        </div>
      </div>
      {/* 浮动数据卡 */}
      <div className="absolute bottom-4 left-4 hidden rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 backdrop-blur-sm sm:block">
        <div className="font-display text-[10px] tracking-[0.2em] text-white/55">WEEKLY SETS · EXAMPLE</div>
        <div className="mt-2 flex items-end gap-1.5">
          {[8, 12, 10, 14, 12, 16, 14].map((h, i) => (
            <div key={i} className="w-3 rounded-sm bg-brand/80" style={{ height: h * 2.2 }} />
          ))}
          <span className="ml-2 font-display text-[19px] font-bold text-white">+18%</span>
        </div>
        <div className="mt-1 text-[10px] text-white/45">示例数据 · 非用户真实记录</div>
      </div>
      <div className="absolute right-4 top-4 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 font-display text-[10px] tracking-[0.2em] text-white/60 backdrop-blur-sm">
        PERFORMANCE LAB / 001
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 金句卡片                                                            */
/* ------------------------------------------------------------------ */
export function QuoteCard({ quote, dark = false }: { quote: Quote; dark?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl px-6 py-7 md:px-8",
        dark ? "bg-carbon text-white" : "border border-line bg-white",
      )}
    >
      {dark && <div className="grid-lines absolute inset-0 opacity-60" />}
      <div className="relative">
        <div className={cn("eyebrow", dark && "eyebrow-light")}>IRON NOTES · 今日训练哲学</div>
        <span className={cn("mt-3 block font-display text-[56px] leading-[0.7]", dark ? "text-brand" : "text-brand/25")}>“</span>
        <p className={cn("mt-2 text-[19px] font-semibold leading-[1.65] md:text-[22px]", dark ? "text-white" : "text-ink")}>
          {quote.text}
        </p>
        <div className={cn("mt-5 flex items-center gap-3 text-[12px]", dark ? "text-white/50" : "text-muted")}>
          <span className="h-px w-8 bg-brand" />
          原创观点 · 非研究结论 · #{quote.tag}
        </div>
      </div>
    </div>
  );
}
