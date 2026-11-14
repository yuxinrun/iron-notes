import { cn } from "@/lib/utils";

/**
 * 原创矢量人体肌群示意图。
 * 采用「分区示意」画法：以清晰的几何分区表达主要肌群位置与功能，
 * 不是医学解剖图，不代替解剖学教材或临床资料。
 * 所有图形支持任意缩放、响应式布局，并可按 id 指定高亮颜色。
 */

export interface MusclePath {
  id: string;
  label: string;
  d: string;
  mirror?: boolean;
  detail?: boolean;
}

export const FRONT: MusclePath[] = [
  { id: "traps", label: "斜方肌上束", d: "M108 68 Q120 77 132 68 L150 76 Q138 90 120 94 Q102 90 90 76 Z" },
  { id: "shoulders", label: "三角肌前束 / 中束", d: "M90 77 Q72 75 66 92 Q62 108 70 120 L88 114 L97 92 Z", mirror: true },
  { id: "chest", label: "胸大肌", d: "M118 84 Q100 80 90 88 Q78 98 78 116 Q78 132 96 136 L118 130 Z", mirror: true },
  { id: "biceps", label: "肱二头肌 / 肱肌", d: "M68 118 Q62 134 60 154 L62 172 Q68 179 76 175 L83 148 L85 122 Z", mirror: true },
  { id: "forearms", label: "前臂屈肌群", d: "M61 175 L59 216 Q59 227 68 229 Q76 229 77 218 L78 176 Z", mirror: true },
  { id: "abs", label: "腹直肌", d: "M105 138 L135 138 L137 202 L103 202 Z", detail: true },
  { id: "obliques", label: "腹外斜肌", d: "M103 140 Q91 149 91 173 L93 201 L103 202 Z", mirror: true },
  { id: "hip", label: "骨盆区", d: "M91 202 L149 202 L152 240 L88 240 Z" },
  { id: "quads", label: "股四头肌", d: "M92 241 Q86 271 90 306 L94 336 L115 336 L117 241 Z", mirror: true },
  { id: "calves", label: "胫骨前肌 / 小腿", d: "M95 338 Q92 370 96 404 L98 428 L113 428 L115 338 Z", mirror: true },
];

export const BACK: MusclePath[] = [
  { id: "traps", label: "斜方肌", d: "M108 68 L120 80 L132 68 L152 76 L138 110 L120 122 L102 110 L88 76 Z" },
  { id: "shoulders", label: "三角肌后束", d: "M90 77 Q72 75 66 92 Q62 108 70 120 L88 114 L97 92 Z", mirror: true },
  { id: "back", label: "背阔肌", d: "M101 110 Q84 113 82 138 L89 177 Q99 195 117 199 L119 122 Z", mirror: true },
  { id: "erectors", label: "竖脊肌", d: "M112 122 L128 122 L131 200 L109 200 Z", detail: true },
  { id: "triceps", label: "肱三头肌", d: "M68 118 Q62 134 60 154 L62 172 Q68 179 76 175 L83 148 L85 122 Z", mirror: true },
  { id: "forearms", label: "前臂伸肌群", d: "M61 175 L59 216 Q59 227 68 229 Q76 229 77 218 L78 176 Z", mirror: true },
  { id: "glutes", label: "臀大肌 / 臀中肌", d: "M91 202 Q85 216 90 237 L94 251 L118 249 L118 202 Z", mirror: true },
  { id: "hamstrings", label: "腘绳肌", d: "M90 251 Q86 281 92 310 L96 336 L116 336 L118 251 Z", mirror: true },
  { id: "calves", label: "腓肠肌 / 比目鱼肌", d: "M96 338 Q90 362 96 388 L98 424 L113 424 L115 338 Z", mirror: true },
];

const BASE_FILL = "#e7e3da";
const BASE_STROKE = "#bdb6aa";
const HIGHLIGHT = "#e0532a";

function PathShape({
  path,
  fill,
  opacity = 1,
}: {
  path: MusclePath;
  fill: string;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <path
        d={path.d}
        fill={fill}
        stroke={BASE_STROKE}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      {path.mirror && (
        <path
          d={path.d}
          fill={fill}
          stroke={BASE_STROKE}
          strokeWidth={1.1}
          strokeLinejoin="round"
          transform="translate(240 0) scale(-1 1)"
        />
      )}
    </g>
  );
}

function SkeletonDetails({ view }: { view: "front" | "back" }) {
  return (
    <g fill="none" stroke={BASE_STROKE} strokeWidth={1} opacity={0.85}>
      <ellipse cx="120" cy="34" rx="19" ry="23" fill="#e7e3da" />
      <path d="M110 55 L130 55 L131 71 L109 71 Z" fill="#e7e3da" />
      <path d="M120 58 L120 68" opacity={0.6} />
      {view === "front" ? (
        <>
          <path d="M120 96 L120 202" strokeDasharray="3 4" opacity={0.7} />
          <path d="M105 156 L135 156 M104 176 L136 176 M103 194 L137 194" opacity={0.75} />
          <path d="M96 138 Q104 146 118 140 M96 130 Q106 132 118 128" opacity={0.5} />
        </>
      ) : (
        <>
          <path d="M120 80 L120 200" strokeDasharray="3 4" opacity={0.7} />
          <path d="M104 130 L136 130 M106 150 L134 150 M108 170 L132 170 M110 190 L130 190" opacity={0.55} />
          <path d="M102 110 L120 122 L138 110" opacity={0.6} />
        </>
      )}
      <path d="M91 240 L88 240 M149 240 L152 240" />
      {/* hands */}
      <ellipse cx="66" cy="236" rx="8" ry="11" fill="#e7e3da" />
      <ellipse cx="174" cy="236" rx="8" ry="11" fill="#e7e3da" />
      {/* feet */}
      <ellipse cx="103" cy="438" rx="12" ry="8" fill="#e7e3da" />
      <ellipse cx="137" cy="438" rx="12" ry="8" fill="#e7e3da" />
      <path d="M92 240 L92 336 M148 240 L148 336" opacity={0.35} strokeDasharray="2 5" />
    </g>
  );
}

export function BodyMap({
  view = "front",
  highlight = [],
  colors,
  className,
  showLegend = false,
  crop,
}: {
  view?: "front" | "back";
  highlight?: string[];
  colors?: Record<string, string>;
  className?: string;
  showLegend?: boolean;
  crop?: string;
}) {
  const paths = view === "front" ? FRONT : BACK;
  const getFill = (id: string) => {
    if (!highlight.includes(id)) return BASE_FILL;
    return colors?.[id] ?? HIGHLIGHT;
  };
  const active = paths.filter((p) => highlight.includes(p.id));

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={crop ?? "0 0 240 470"}
        width="100%"
        role="img"
        aria-label={`人体${view === "front" ? "正面" : "背面"}主要肌群分区教学示意图`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
      >
        <SkeletonDetails view={view} />
        {paths.map((p) => (
          <PathShape key={p.id} path={p} fill={getFill(p.id)} />
        ))}
        {/* 高亮肌群的中心标记点 */}
        {highlight.includes("chest") && view === "front" && (
          <g fill="#fff" opacity={0.85}>
            <circle cx="98" cy="110" r="2.6" />
            <circle cx="142" cy="110" r="2.6" />
          </g>
        )}
        {highlight.includes("quads") && view === "front" && (
          <g fill="#fff" opacity={0.85}>
            <circle cx="103" cy="285" r="2.6" />
            <circle cx="137" cy="285" r="2.6" />
          </g>
        )}
        {highlight.includes("back") && view === "back" && (
          <g fill="#fff" opacity={0.85}>
            <circle cx="100" cy="150" r="2.6" />
            <circle cx="140" cy="150" r="2.6" />
          </g>
        )}
      </svg>
      {showLegend && active.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {active.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] text-ink-2"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: colors?.[p.id] ?? HIGHLIGHT }} />
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 局部解剖面板：放大区域 + 带引线的中文／英文标注                     */
/* ------------------------------------------------------------------ */
export interface AnatomyLabel {
  cn: string;
  en: string;
  note: string;
  color: string;
  y: number;
}

export const anatomyParts: Record<
  string,
  { title: string; view: "front" | "back"; crop: string; highlight: string[]; labels: AnatomyLabel[] }
> = {
  chest: {
    title: "胸部肌群分区",
    view: "front",
    crop: "60 60 120 100",
    highlight: ["chest", "shoulders"],
    labels: [
      { cn: "胸大肌 · 锁骨部（上胸）", en: "Pectoralis major, clavicular head", note: "肩屈曲、水平内收；上斜推类动作更偏重", color: "#e0532a", y: 30 },
      { cn: "胸大肌 · 胸肋部（中下胸）", en: "Pectoralis major, sternocostal head", note: "水平内收的主要动力来源", color: "#c9431d", y: 82 },
      { cn: "三角肌前束", en: "Anterior deltoid", note: "推类动作中大量协同，通常无需额外大量孤立", color: "#d98324", y: 134 },
    ],
  },
  back: {
    title: "背部肌群分区",
    view: "back",
    crop: "60 60 120 155",
    highlight: ["back", "traps", "erectors"],
    labels: [
      { cn: "背阔肌", en: "Latissimus dorsi", note: "肩内收与伸展；垂直拉与拉长位训练重点", color: "#e0532a", y: 30 },
      { cn: "斜方肌中下束 / 菱形肌", en: "Middle/lower trapezius, rhomboids", note: "肩胛后缩与下压，水平拉动作的协同肌", color: "#2f6f6b", y: 82 },
      { cn: "竖脊肌", en: "Erector spinae", note: "维持躯干中立；硬拉与深蹲中主要做等长工作", color: "#4c6ef5", y: 134 },
    ],
  },
  shoulder: {
    title: "肩部肌群分区",
    view: "front",
    crop: "52 62 136 76",
    highlight: ["shoulders", "traps", "chest"],
    labels: [
      { cn: "三角肌前束", en: "Anterior deltoid", note: "肩屈曲、水平内收；卧推已充分刺激", color: "#e0532a", y: 30 },
      { cn: "三角肌中束", en: "Lateral deltoid", note: "肩外展主力，侧平举的主要目标", color: "#d98324", y: 82 },
      { cn: "三角肌后束", en: "Posterior deltoid", note: "水平外展与外旋，面拉、反向飞鸟补足", color: "#2f6f6b", y: 134 },
    ],
  },
  arm: {
    title: "上肢肌群分区",
    view: "front",
    crop: "48 105 144 135",
    highlight: ["biceps", "forearms", "triceps"],
    labels: [
      { cn: "肱二头肌（长头 / 短头）", en: "Biceps brachii", note: "肘屈曲与前臂旋后；手臂位置会改变长度", color: "#e0532a", y: 30 },
      { cn: "肱三头肌", en: "Triceps brachii", note: "肘伸展，占上臂体积大部分；长头跨肩关节", color: "#4c6ef5", y: 82 },
      { cn: "前臂屈伸肌群", en: "Forearm flexors / extensors", note: "握力来源，握持类复合动作已提供大量刺激", color: "#7c8a3c", y: 134 },
    ],
  },
  leg: {
    title: "下肢肌群分区",
    view: "front",
    crop: "72 195 96 250",
    highlight: ["quads", "hamstrings", "calves", "glutes"],
    labels: [
      { cn: "股四头肌", en: "Quadriceps femoris", note: "膝伸展；深蹲、腿举在足够膝屈下重点刺激", color: "#e0532a", y: 30 },
      { cn: "臀大肌 / 腘绳肌", en: "Gluteus maximus / Hamstrings", note: "髋伸展；硬拉、臀推与腿弯举分别覆盖两种功能", color: "#2f6f6b", y: 82 },
      { cn: "腓肠肌 / 比目鱼肌", en: "Gastrocnemius / Soleus", note: "踝跖屈；屈膝与直腿提踵的侧重不同", color: "#4c6ef5", y: 134 },
    ],
  },
  core: {
    title: "核心肌群分区",
    view: "front",
    crop: "76 128 88 120",
    highlight: ["abs", "obliques"],
    labels: [
      { cn: "腹直肌", en: "Rectus abdominis", note: "躯干屈曲与抗伸展；不只是「卷腹」这一功能", color: "#e0532a", y: 30 },
      { cn: "腹外斜肌", en: "External obliques", note: "抗旋转、抗侧屈与躯干旋转", color: "#d98324", y: 82 },
      { cn: "腹横肌 / 腹内压", en: "Transversus abdominis / IAP", note: "深层稳定；大重量动作中通过呼吸与腹压发挥作用", color: "#2f6f6b", y: 134 },
    ],
  },
};

export function AnatomyPanel({ part }: { part: string }) {
  const cfg = anatomyParts[part] ?? anatomyParts.chest;
  return (
    <div className="grid gap-5 rounded-2xl border border-line bg-white p-5 md:grid-cols-[minmax(0,260px)_1fr] md:p-7">
      <div className="relative flex items-start justify-center rounded-xl bg-paper-2/70 p-3">
        <div className="w-[160px] md:w-[200px]">
          <BodyMap view={cfg.view} crop={cfg.crop} highlight={cfg.highlight} />
        </div>
        <span className="absolute bottom-2 left-3 font-display text-[10px] tracking-[0.18em] text-muted">
          TEACHING DIAGRAM
        </span>
      </div>
      <div>
        <div className="eyebrow">ANATOMY / {part.toUpperCase()}</div>
        <h4 className="mt-1.5 text-[19px] font-bold text-ink">{cfg.title}</h4>
        <div className="mt-4 space-y-3.5">
          {cfg.labels.map((l) => (
            <div key={l.cn} className="flex gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.color }} />
              <div>
                <div className="text-[14.5px] font-semibold text-ink">
                  {l.cn} <span className="ml-1 font-display text-[12px] font-medium tracking-wide text-muted">{l.en}</span>
                </div>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{l.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 border-t border-line pt-3 text-[11.5px] leading-relaxed text-muted">
          教学示意图：以分区方式表达主要肌群位置与功能，不代替医学解剖资料；个体差异与深层结构请以专业教材为准。
        </p>
      </div>
    </div>
  );
}
