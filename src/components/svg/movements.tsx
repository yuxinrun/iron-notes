import type { ReactNode } from "react";

/**
 * 原创 SVG 动作分解图与训练流程示意。
 * 统一侧面／正面简笔骨架 + 器械线条 + 轨迹箭头，按「起始 → 过程 → 顶点」三帧呈现。
 * 均为教学示意，用于表达关节运动方向与相对位置，不代替现场教练指导或生物力学分析。
 */

type Pt = [number, number];

interface Pose {
  head: Pt;
  neck: Pt;
  shoulder: Pt;
  hip: Pt;
  elbow: Pt;
  wrist: Pt;
  knee: Pt;
  ankle: Pt;
  toe: Pt;
}

const INK = "#22282c";
const LIMB = "#3b4348";
const FAINT = "#b9bfc2";
const BRAND = "#e0532a";
const TEAL = "#2f6f6b";

function line(a: Pt, b: Pt, width = 7, color = LIMB, key?: string) {
  return (
    <line
      key={key}
      x1={a[0]}
      y1={a[1]}
      x2={b[0]}
      y2={b[1]}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

function joint(p: Pt, color = INK, r = 3.4, key?: string) {
  return <circle key={key} cx={p[0]} cy={p[1]} r={r} fill={color} />;
}

function Stick({ pose, front = false }: { pose: Pose; front?: boolean }) {
  const mirror = (p: Pt): Pt => [196 - p[0], p[1]];
  const limbs = (p: Pose, color: string, faint = false) => (
    <g key={color} opacity={faint ? 0.42 : 1}>
      {line(p.shoulder, p.elbow, 6.5, color, "ua")}
      {line(p.elbow, p.wrist, 5.5, color, "fa")}
      {line(p.hip, p.knee, 8, color, "th")}
      {line(p.knee, p.ankle, 6.5, color, "sh")}
      {line(p.ankle, p.toe, 5, color, "ft")}
      {line(p.neck, p.hip, 11, color, "torso")}
      {joint(p.shoulder, color, 3.2, "js")}
      {joint(p.elbow, color, 3, "je")}
      {joint(p.hip, color, 3.4, "jh")}
      {joint(p.knee, color, 3.2, "jk")}
      <circle cx={p.head[0]} cy={p.head[1]} r={12} fill="#f2efe9" stroke={color} strokeWidth={3} />
    </g>
  );

  return (
    <g>
      {front && limbs({ ...pose, shoulder: mirror(pose.shoulder), elbow: mirror(pose.elbow), wrist: mirror(pose.wrist), knee: mirror(pose.knee), ankle: mirror(pose.ankle), toe: mirror(pose.toe) }, FAINT, true)}
      {limbs(pose, LIMB)}
    </g>
  );
}

function Ground({ y = 186 }: { y?: number }) {
  return (
    <g>
      <line x1={12} y1={y} x2={184} y2={y} stroke="#cfc9bf" strokeWidth={1.4} />
      <line x1={12} y1={y + 4} x2={184} y2={y + 4} stroke="#e8e3da" strokeWidth={1} />
    </g>
  );
}

function Plate({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#2b3135" />
      <circle cx={x} cy={y} r={r * 0.62} fill="none" stroke="#8b959d" strokeWidth={1.2} />
      <circle cx={x} cy={y} r={2.2} fill="#f7f5f0" />
    </g>
  );
}

function Dumbbell({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`rotate(${rotate} ${x} ${y})`}>
      <rect x={x - 9} y={y - 2} width={18} height={4} rx={1.5} fill="#505960" />
      <rect x={x - 13} y={y - 7} width={6} height={14} rx={2} fill="#2b3135" />
      <rect x={x + 7} y={y - 7} width={6} height={14} rx={2} fill="#2b3135" />
    </g>
  );
}

function Arrow({
  from,
  to,
  marker,
  color = BRAND,
}: {
  from: Pt;
  to: Pt;
  marker: string;
  color?: string;
}) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeDasharray="5 4"
      markerEnd={`url(#${marker})`}
    />
  );
}

function Frame({
  x,
  step,
  label,
  children,
  note,
}: {
  x: number;
  step: string;
  label: string;
  children: ReactNode;
  note?: string;
}) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={0} width={196} height={214} rx={10} fill="#faf8f4" stroke="#e2ded5" strokeWidth={1.2} />
      <g opacity={0.55}>
        <line x1={0} y1={54} x2={196} y2={54} stroke="#eeeae2" strokeWidth={1} />
        <line x1={0} y1={108} x2={196} y2={108} stroke="#eeeae2" strokeWidth={1} />
        <line x1={0} y1={162} x2={196} y2={162} stroke="#eeeae2" strokeWidth={1} />
        <line x1={98} y1={0} x2={98} y2={214} stroke="#eeeae2" strokeWidth={1} />
      </g>
      <rect x={9} y={9} width={26} height={19} rx={4} fill={BRAND} />
      <text x={22} y={22.5} textAnchor="middle" fill="#fff" fontSize={11} fontFamily="Arial" fontWeight={700}>
        {step}
      </text>
      <text x={184} y={22.5} textAnchor="end" fill="#8b959d" fontSize={9.5} fontFamily="Arial" letterSpacing={1.2}>
        IRON NOTES
      </text>
      {children}
      <text x={98} y={234} textAnchor="middle" fill="#22282c" fontSize={13} fontWeight={700}>
        {label}
      </text>
      {note && (
        <text x={98} y={248} textAnchor="middle" fill="#8b959d" fontSize={10}>
          {note}
        </text>
      )}
    </g>
  );
}

function Motion({ name, children }: { name: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 620 254"
      width="100%"
      role="img"
      aria-label={`${name}动作分解教学示意图`}
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id={`arw-${name}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill={BRAND} />
        </marker>
        <marker id="arw-t" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill={TEAL} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

const M = (n: string) => `arw-${n}`;

/* ------------------------------------------------------------------ */
/* 8 组动作分解                                                        */
/* ------------------------------------------------------------------ */
function Squat() {
  const p1: Pose = { head: [100, 26], neck: [98, 48], shoulder: [97, 54], hip: [96, 108], elbow: [110, 74], wrist: [116, 56], knee: [102, 146], ankle: [98, 184], toe: [124, 184] };
  const p2: Pose = { head: [105, 40], neck: [103, 62], shoulder: [102, 68], hip: [84, 122], elbow: [115, 88], wrist: [121, 70], knee: [126, 148], ankle: [98, 184], toe: [124, 184] };
  const p3: Pose = { head: [110, 52], neck: [108, 74], shoulder: [107, 80], hip: [76, 140], elbow: [120, 100], wrist: [126, 82], knee: [136, 154], ankle: [98, 184], toe: [124, 184] };
  return (
    <Motion name="squat">
      <Frame x={4} step="01" label="起始：站稳" note="杠铃置于斜方肌上，脚掌三点踩实">
        <Ground /><Stick pose={p1} /><Plate x={112} y={50} />
      </Frame>
      <Frame x={212} step="02" label="下蹲：髋膝同步" note="膝沿脚尖方向，脚跟不离地">
        <Ground /><Stick pose={p2} /><Plate x={117} y={64} />
        <Arrow from={[150, 60]} to={[150, 104]} marker={M("squat")} />
      </Frame>
      <Frame x={420} step="03" label="底部与起身" note="髋略低于膝，髋肩一起上升">
        <Ground /><Stick pose={p3} /><Plate x={122} y={76} />
        <Arrow from={[150, 108]} to={[150, 62]} marker={M("squat")} color={TEAL} />
        <path d="M84 140 Q98 152 136 154" fill="none" stroke={BRAND} strokeWidth={1.6} strokeDasharray="3 3" />
      </Frame>
    </Motion>
  );
}

function BenchPress() {
  const bench = (
    <g>
      <rect x={26} y={130} width={146} height={9} rx={3} fill="#394147" />
      <line x1={46} y1={139} x2={46} y2={186} stroke="#6b7378" strokeWidth={5} strokeLinecap="round" />
      <line x1={152} y1={139} x2={152} y2={186} stroke="#6b7378" strokeWidth={5} strokeLinecap="round" />
      <line x1={12} y1={186} x2={184} y2={186} stroke="#cfc9bf" strokeWidth={1.4} />
    </g>
  );
  const p1: Pose = { head: [43, 110], neck: [60, 114], shoulder: [74, 116], hip: [138, 118], elbow: [76, 84], wrist: [80, 58], knee: [146, 152], ankle: [142, 182], toe: [162, 184] };
  const p2: Pose = { ...p1, elbow: [64, 100], wrist: [84, 90] };
  const p3: Pose = { ...p1, elbow: [60, 112], wrist: [88, 108] };
  return (
    <Motion name="bench">
      <Frame x={4} step="01" label="顶部锁定" note="肩胛后缩下沉，臀部贴凳">
        {bench}<Stick pose={p1} /><Plate x={80} y={56} r={8} />
      </Frame>
      <Frame x={212} step="02" label="下放至下胸" note="前臂接近垂直，肘部不完全外展">
        {bench}<Stick pose={p2} /><Plate x={84} y={88} r={8} />
        <Arrow from={[120, 52]} to={[120, 100]} marker={M("bench")} />
      </Frame>
      <Frame x={420} step="03" label="推起" note="双脚蹬地，沿略向头侧弧线">
        {bench}<Stick pose={p3} /><Plate x={88} y={106} r={8} />
        <Arrow from={[120, 108]} to={[120, 54]} marker={M("bench")} color={TEAL} />
        <line x1={74} y1={116} x2={88} y2={108} stroke={BRAND} strokeWidth={1.5} strokeDasharray="3 3" />
      </Frame>
    </Motion>
  );
}

function Deadlift() {
  const p1: Pose = { head: [126, 60], neck: [118, 74], shoulder: [114, 78], hip: [84, 120], elbow: [120, 110], wrist: [122, 150], knee: [108, 148], ankle: [96, 184], toe: [124, 184] };
  const p2: Pose = { head: [118, 50], neck: [110, 64], shoulder: [106, 68], hip: [90, 112], elbow: [114, 100], wrist: [116, 140], knee: [106, 144], ankle: [97, 184], toe: [124, 184] };
  const p3: Pose = { head: [98, 34], neck: [98, 50], shoulder: [98, 54], hip: [98, 106], elbow: [108, 82], wrist: [114, 118], knee: [100, 144], ankle: [98, 184], toe: [124, 184] };
  return (
    <Motion name="deadlift">
      <Frame x={4} step="01" label="起始：贴腿" note="肩略前于杠，背部中立，先预拉">
        <Ground /><Stick pose={p1} /><Plate x={122} y={166} r={10} />
        <line x1={122} y1={150} x2={122} y2={164} stroke="#505960" strokeWidth={2} />
      </Frame>
      <Frame x={212} step="02" label="过膝：蹬地" note="杠铃始终贴腿垂直上升">
        <Ground /><Stick pose={p2} /><Plate x={116} y={148} r={10} />
        <Arrow from={[152, 158]} to={[152, 108]} marker={M("deadlift")} />
      </Frame>
      <Frame x={420} step="03" label="锁定：顶髋" note="完全伸髋，不后仰、不耸肩">
        <Ground /><Stick pose={p3} /><Plate x={114} y={124} r={10} />
        <Arrow from={[152, 158]} to={[152, 88]} marker={M("deadlift")} color={TEAL} />
        <line x1={114} y1={70} x2={114} y2={168} stroke={BRAND} strokeWidth={1.4} strokeDasharray="3 4" opacity={0.8} />
      </Frame>
    </Motion>
  );
}

function PullUp() {
  const bar = <g><line x1={22} y1={30} x2={174} y2={30} stroke="#394147" strokeWidth={5} strokeLinecap="round" /><line x1={30} y1={30} x2={30} y2={12} stroke="#8b959d" strokeWidth={2} /><line x1={166} y1={30} x2={166} y2={12} stroke="#8b959d" strokeWidth={2} /></g>;
  const p1: Pose = { head: [98, 64], neck: [98, 80], shoulder: [86, 84], hip: [98, 138], elbow: [74, 58], wrist: [72, 32], knee: [90, 166], ankle: [90, 190], toe: [96, 194] };
  const p2: Pose = { head: [98, 54], neck: [98, 70], shoulder: [86, 74], hip: [98, 128], elbow: [68, 50], wrist: [72, 32], knee: [90, 160], ankle: [90, 186], toe: [96, 190] };
  const p3: Pose = { head: [98, 44], neck: [98, 60], shoulder: [86, 62], hip: [98, 118], elbow: [62, 42], wrist: [72, 32], knee: [90, 154], ankle: [90, 182], toe: [96, 186] };
  return (
    <Motion name="pullup">
      <Frame x={4} step="01" label="悬垂：肩胛下沉" note="先压肩胛，再屈肘">
        {bar}<Stick pose={p1} front />
      </Frame>
      <Frame x={212} step="02" label="上拉：肘向肋骨" note="上胸靠近单杠，颈不前伸">
        {bar}<Stick pose={p2} front />
        <Arrow from={[150, 116]} to={[150, 76]} marker={M("pullup")} />
      </Frame>
      <Frame x={420} step="03" label="顶点与离心" note="慢速下放至手臂伸直">
        {bar}<Stick pose={p3} front />
        <Arrow from={[150, 62]} to={[150, 112]} marker={M("pullup")} color={TEAL} />
      </Frame>
    </Motion>
  );
}

function Row() {
  const p1: Pose = { head: [138, 62], neck: [130, 74], shoulder: [126, 80], hip: [84, 118], elbow: [132, 112], wrist: [134, 142], knee: [100, 148], ankle: [94, 184], toe: [122, 184] };
  const p2: Pose = { ...p1, elbow: [124, 100], wrist: [122, 116] };
  const p3: Pose = { ...p1, elbow: [106, 96], wrist: [116, 96] };
  return (
    <Motion name="row">
      <Frame x={4} step="01" label="起始：手臂伸直" note="躯干约 30–45°，背部中立">
        <Ground /><Stick pose={p1} /><Plate x={134} y={150} r={8} />
      </Frame>
      <Frame x={212} step="02" label="肘尖向后" note="躯干角度全程固定">
        <Ground /><Stick pose={p2} /><Plate x={122} y={122} r={8} />
        <Arrow from={[160, 146]} to={[160, 106]} marker={M("row")} />
      </Frame>
      <Frame x={420} step="03" label="顶端：拉向下胸" note="肩胛收紧，不用腰甩">
        <Ground /><Stick pose={p3} /><Plate x={116} y={100} r={8} />
        <Arrow from={[160, 146]} to={[160, 92]} marker={M("row")} color={TEAL} />
        <line x1={84} y1={118} x2={126} y2={80} stroke={BRAND} strokeWidth={1.4} strokeDasharray="3 4" />
      </Frame>
    </Motion>
  );
}

function LateralRaise() {
  const p1: Pose = { head: [98, 34], neck: [98, 50], shoulder: [84, 58], hip: [98, 122], elbow: [78, 88], wrist: [74, 118], knee: [92, 156], ankle: [92, 184], toe: [100, 186] };
  const p2: Pose = { ...p1, elbow: [62, 70], wrist: [44, 82] };
  const p3: Pose = { ...p1, elbow: [60, 60], wrist: [36, 60] };
  return (
    <Motion name="lateral">
      <Frame x={4} step="01" label="起始：哑铃在体侧" note="肘微屈，肩胛自然下沉">
        <Ground /><Stick pose={p1} front /><Dumbbell x={74} y={120} rotate={90} />
      </Frame>
      <Frame x={212} step="02" label="外展：肘尖先导" note="抬到与肩齐平即可">
        <Ground /><Stick pose={p2} front /><Dumbbell x={44} y={84} />
        <Arrow from={[150, 116]} to={[150, 70]} marker={M("lateral")} />
      </Frame>
      <Frame x={420} step="03" label="顶端与慢速离心" note="不耸肩，用 2–3 秒下放">
        <Ground /><Stick pose={p3} front /><Dumbbell x={36} y={60} />
        <line x1={36} y1={60} x2={160} y2={60} stroke={BRAND} strokeWidth={1.3} strokeDasharray="4 4" opacity={0.75} />
        <Arrow from={[148, 60]} to={[148, 112]} marker={M("lateral")} color={TEAL} />
      </Frame>
    </Motion>
  );
}

function Curl() {
  const p1: Pose = { head: [88, 30], neck: [88, 50], shoulder: [88, 56], hip: [88, 114], elbow: [92, 90], wrist: [94, 122], knee: [92, 150], ankle: [90, 184], toe: [114, 184] };
  const p2: Pose = { ...p1, wrist: [118, 94] };
  const p3: Pose = { ...p1, wrist: [106, 62] };
  return (
    <Motion name="curl">
      <Frame x={4} step="01" label="起始：上臂固定" note="肘贴近躯干，腕中立">
        <Ground /><Stick pose={p1} /><Dumbbell x={94} y={126} />
      </Frame>
      <Frame x={212} step="02" label="屈肘：前臂旋转" note="不要抬上臂借力">
        <Ground /><Stick pose={p2} /><Dumbbell x={118} y={92} rotate={-30} />
        <path d="M94 122 Q116 118 118 94" fill="none" stroke={BRAND} strokeWidth={1.6} strokeDasharray="4 3" />
      </Frame>
      <Frame x={420} step="03" label="顶端与离心" note="停顿 1 秒，慢速下放">
        <Ground /><Stick pose={p3} /><Dumbbell x={106} y={60} rotate={-80} />
        <Arrow from={[144, 66]} to={[144, 124]} marker={M("curl")} color={TEAL} />
      </Frame>
    </Motion>
  );
}

function Pushdown() {
  const rig = (
    <g>
      <line x1={118} y1={14} x2={118} y2={30} stroke="#6b7378" strokeWidth={2.5} />
      <circle cx={118} cy={32} r={5} fill="none" stroke="#6b7378" strokeWidth={2} />
      <rect x={142} y={12} width={6} height={174} fill="#e2ded5" />
      <Ground />
    </g>
  );
  const p1: Pose = { head: [86, 32], neck: [86, 52], shoulder: [86, 58], hip: [88, 114], elbow: [92, 86], wrist: [118, 88], knee: [92, 150], ankle: [90, 184], toe: [114, 184] };
  const p2: Pose = { ...p1, elbow: [92, 90], wrist: [112, 114] };
  const p3: Pose = { ...p1, elbow: [94, 96], wrist: [102, 124] };
  return (
    <Motion name="pushdown">
      <Frame x={4} step="01" label="起始：肘约 90°" note="上臂夹在体侧不动">
        {rig}<Stick pose={p1} /><line x1={118} y1={34} x2={118} y2={86} stroke="#8b959d" strokeWidth={1.5} /><rect x={108} y={86} width={20} height={4} rx={2} fill="#394147" />
      </Frame>
      <Frame x={212} step="02" label="伸肘下压" note="只让前臂移动">
        {rig}<Stick pose={p2} /><line x1={118} y1={34} x2={112} y2={112} stroke="#8b959d" strokeWidth={1.5} /><rect x={102} y={112} width={20} height={4} rx={2} fill="#394147" />
        <Arrow from={[150, 76]} to={[150, 122]} marker={M("pushdown")} />
      </Frame>
      <Frame x={420} step="03" label="底部收紧" note="停 1 秒，不锁死肘">
        {rig}<Stick pose={p3} /><line x1={118} y1={34} x2={102} y2={122} stroke="#8b959d" strokeWidth={1.5} /><rect x={92} y={122} width={20} height={4} rx={2} fill="#394147" />
        <Arrow from={[150, 76]} to={[150, 130]} marker={M("pushdown")} color={TEAL} />
      </Frame>
    </Motion>
  );
}

const MOVEMENTS: Record<string, () => ReactNode> = {
  squat: Squat,
  "bench-press": BenchPress,
  deadlift: Deadlift,
  "pull-up": PullUp,
  row: Row,
  "lateral-raise": LateralRaise,
  curl: Curl,
  pushdown: Pushdown,
};

export function MovementDiagram({ name }: { name: string }) {
  const Comp = MOVEMENTS[name];
  return Comp ? <>{Comp()}</> : null;
}

/* ------------------------------------------------------------------ */
/* 训练流程 / 原理示意图                                               */
/* ------------------------------------------------------------------ */
export function TrainingCycleDiagram() {
  return (
    <svg viewBox="0 0 620 250" width="100%" role="img" aria-label="训练刺激、疲劳与恢复的周期示意" className="h-auto w-full">
      <rect x={0} y={0} width={620} height={250} rx={12} fill="#faf8f4" stroke="#e2ded5" />
      <line x1={56} y1={196} x2={590} y2={196} stroke="#bdb6aa" strokeWidth={1.4} />
      <line x1={56} y1={32} x2={56} y2={196} stroke="#bdb6aa" strokeWidth={1.4} />
      <line x1={56} y1={128} x2={590} y2={128} stroke="#e2ded5" strokeDasharray="4 5" />
      <text x={20} y={40} fill="#8b959d" fontSize={10}>能力 / 表现</text>
      <text x={20} y={134} fill="#8b959d" fontSize={10}>基线</text>
      <path d="M56 128 C110 126 130 176 170 182 C220 190 250 154 300 138 C350 122 390 112 440 106 C500 99 540 100 590 100" fill="none" stroke={BRAND} strokeWidth={3} strokeLinecap="round" />
      <path d="M56 128 C110 126 130 176 170 182 C220 190 250 154 300 138 L300 196 L56 196 Z" fill="rgba(224,83,42,.08)" />
      <path d="M300 138 C350 122 390 112 440 106 C500 99 540 100 590 100 L590 196 L300 196 Z" fill="rgba(47,111,107,.08)" />
      <line x1={170} y1={40} x2={170} y2={196} stroke={BRAND} strokeWidth={1} strokeDasharray="3 4" opacity={0.55} />
      <circle cx={170} cy={182} r={4.5} fill={BRAND} />
      <circle cx={440} cy={106} r={4.5} fill={TEAL} />
      <g fontSize={11} fill="#22282c" fontWeight={600}>
        <text x={66} y={52}>训练刺激</text>
        <text x={126} y={216}>疲劳累积 + 表现下降</text>
        <text x={336} y={68}>恢复与适应</text>
        <text x={452} y={92} fill={TEAL}>新的表现基线</text>
      </g>
      <g fontSize={10} fill="#8b959d">
        <text x={66} y={232}>示意曲线：单次训练后表现暂时下降，随恢复回到并略高于基线；实际幅度因人而异</text>
      </g>
      <g>
        <rect x={452} y={150} width={138} height={34} rx={6} fill="#fff" stroke="#e2ded5" />
        <text x={462} y={171} fontSize={10.5} fill="#6c737a">下一次训练安排在这里</text>
      </g>
    </svg>
  );
}

export function OverloadLadderDiagram() {
  const steps = [
    { week: "W1", weight: "60 kg", reps: "8 / 8 / 8", note: "留 2–3 RIR" },
    { week: "W2", weight: "60 kg", reps: "9 / 8 / 8", note: "先加次数" },
    { week: "W3", weight: "60 kg", reps: "10 / 10 / 10", note: "到达上限" },
    { week: "W4", weight: "62.5 kg", reps: "8 / 8 / 8", note: "加重量后重新爬升" },
  ];
  return (
    <svg viewBox="0 0 620 250" width="100%" role="img" aria-label="双重渐进法：先增加次数再增加重量的阶梯示意" className="h-auto w-full">
      <rect x={0} y={0} width={620} height={250} rx={12} fill="#faf8f4" stroke="#e2ded5" />
      <text x={24} y={32} fill="#22282c" fontSize={15} fontWeight={700}>双重渐进法 · 同一个动作的四次训练</text>
      <text x={24} y={50} fill="#8b959d" fontSize={10.5}>示例数据，不代表任何人的真实训练记录</text>
      {steps.map((s, i) => {
        const x = 24 + i * 148;
        const h = 56 + i * 22;
        return (
          <g key={s.week}>
            <rect x={x} y={176 - h} width={128} height={h} rx={7} fill={i === 3 ? BRAND : i === 0 ? "#d9d4ca" : "#e9b9a8"} stroke={i === 3 ? BRAND : "#e2ded5"} />
            <text x={x + 12} y={196 - h} fill={i === 3 ? "#fff" : "#22282c"} fontSize={12} fontFamily="Arial" fontWeight={700}>{s.week}</text>
            <text x={x + 12} y={168} fill={i === 3 ? "#fff" : "#22282c"} fontSize={15} fontWeight={700}>{s.weight}</text>
            <text x={x + 12} y={212} fill="#22282c" fontSize={12} fontFamily="Arial">{s.reps}</text>
            <text x={x + 12} y={230} fill="#6c737a" fontSize={10}>{s.note}</text>
          </g>
        );
      })}
      <path d="M150 104 Q300 72 458 84" fill="none" stroke={TEAL} strokeWidth={2} strokeDasharray="5 4" />
      <text x={262} y={72} fill={TEAL} fontSize={10.5}>同一重量下先把次数做到上限</text>
    </svg>
  );
}

export function NutritionPlateDiagram() {
  return (
    <svg viewBox="0 0 620 250" width="100%" role="img" aria-label="增肌期一日餐盘结构教学示意" className="h-auto w-full">
      <rect x={0} y={0} width={620} height={250} rx={12} fill="#faf8f4" stroke="#e2ded5" />
      <g transform="translate(140 128)">
        <circle r={88} fill="#fff" stroke="#cfc9bf" strokeWidth={2} />
        <path d="M0 0 L0 -84 A84 84 0 0 1 72 42 Z" fill="rgba(224,83,42,.18)" stroke="#fff" strokeWidth={2} />
        <path d="M0 0 L72 42 A84 84 0 0 1 -60 60 Z" fill="rgba(217,131,36,.18)" stroke="#fff" strokeWidth={2} />
        <path d="M0 0 L-60 60 A84 84 0 0 1 -78 -30 Z" fill="rgba(47,111,107,.18)" stroke="#fff" strokeWidth={2} />
        <path d="M0 0 L-78 -30 A84 84 0 0 1 0 -84 Z" fill="rgba(124,138,60,.18)" stroke="#fff" strokeWidth={2} />
        <circle r={18} fill="#fff" stroke="#cfc9bf" />
        <text y={4} textAnchor="middle" fontSize={10} fill="#6c737a">餐盘</text>
      </g>
      <g fontSize={12}>
        <text x={272} y={52} fill="#e0532a" fontWeight={700}>蛋白质来源 · 约 1/4</text>
        <text x={272} y={70} fill="#6c737a" fontSize={10.5}>蛋、奶、鱼虾、禽肉、瘦肉、豆制品</text>
        <text x={272} y={100} fill="#d98324" fontWeight={700}>碳水来源 · 约 1/4–1/3</text>
        <text x={272} y={118} fill="#6c737a" fontSize={10.5}>米饭、面、燕麦、薯类；训练量越大需求越高</text>
        <text x={272} y={148} fill="#2f6f6b" fontWeight={700}>蔬菜水果 · 约 1/4</text>
        <text x={272} y={166} fill="#6c737a" fontSize={10.5}>提供微量营养素与膳食纤维</text>
        <text x={272} y={196} fill="#7c8a3c" fontWeight={700}>脂肪来源 · 适量</text>
        <text x={272} y={214} fill="#6c737a" fontSize={10.5}>坚果、橄榄油、鱼类、鸡蛋等</text>
      </g>
      <text x={24} y={238} fill="#8b959d" fontSize={10}>教学示意：分区仅用于说明搭配结构，具体克数应按体重、训练量与目标计算</text>
    </svg>
  );
}

export function HypertrophyMechanismDiagram() {
  return (
    <svg viewBox="0 0 620 250" width="100%" role="img" aria-label="肌肥大基本原理：刺激、营养与恢复的关系示意" className="h-auto w-full">
      <rect x={0} y={0} width={620} height={250} rx={12} fill="#faf8f4" stroke="#e2ded5" />
      <text x={24} y={32} fill="#22282c" fontSize={15} fontWeight={700}>肌肥大不是单一开关，而是三个条件同时成立</text>
      {[
        { x: 24, title: "训练刺激", sub: "机械张力 + 足够容量", color: BRAND, items: ["可重复的接近力竭", "渐进超负荷", "动作质量稳定"] },
        { x: 224, title: "营养供给", sub: "能量与蛋白质", color: "#d98324", items: ["温和热量盈余", "全天蛋白总量", "不必掐准分钟"] },
        { x: 424, title: "恢复能力", sub: "睡眠与疲劳管理", color: TEAL, items: ["训练间隔合理", "睡眠充足", "必要时减量"] },
      ].map((c, i) => (
        <g key={c.title}>
          <rect x={c.x} y={54} width={172} height={128} rx={10} fill="#fff" stroke="#e2ded5" />
          <rect x={c.x} y={54} width={172} height={5} rx={2} fill={c.color} />
          <text x={c.x + 16} y={86} fill={c.color} fontSize={15} fontWeight={700}>{c.title}</text>
          <text x={c.x + 16} y={104} fill="#6c737a" fontSize={10.5}>{c.sub}</text>
          {c.items.map((t, j) => (
            <g key={t}>
              <circle cx={c.x + 20} cy={122 + j * 18} r={2.6} fill={c.color} />
              <text x={c.x + 30} y={126 + j * 18} fill="#343a3f" fontSize={11}>{t}</text>
            </g>
          ))}
          {i < 2 && (
            <g>
              <line x1={c.x + 176} y1={118} x2={c.x + 196} y2={118} stroke="#bdb6aa" strokeWidth={1.6} />
              <text x={c.x + 184} y={110} textAnchor="middle" fill={BRAND} fontSize={14} fontWeight={700}>×</text>
            </g>
          )}
        </g>
      ))}
      <rect x={24} y={196} width={572} height={36} rx={8} fill="#14171a" />
      <text x={310} y={219} textAnchor="middle" fill="#fff" fontSize={12.5}>任一环节长期缺位，训练就会变成「很努力，但没有累积」</text>
    </svg>
  );
}

export function ProteinDistributionDiagram() {
  const meals = [
    { label: "早餐", g: 35 },
    { label: "午餐", g: 45 },
    { label: "训练后／晚餐", g: 45 },
    { label: "睡前加餐", g: 25 },
  ];
  return (
    <svg viewBox="0 0 620 230" width="100%" role="img" aria-label="每日蛋白质分配教学示意" className="h-auto w-full">
      <rect x={0} y={0} width={620} height={230} rx={12} fill="#faf8f4" stroke="#e2ded5" />
      <text x={24} y={32} fill="#22282c" fontSize={15} fontWeight={700}>示例：约 150 g / 日 的蛋白质分配到 4 餐</text>
      <text x={24} y={50} fill="#8b959d" fontSize={10.5}>示例数据，用于说明分配思路；具体总量请按体重与目标计算</text>
      {meals.map((m, i) => {
        const x = 40 + i * 145;
        const h = m.g * 2.1;
        return (
          <g key={m.label}>
            <rect x={x} y={176 - h} width={92} height={h} rx={6} fill={i === 2 ? BRAND : "#e9b9a8"} />
            <text x={x + 46} y={168 - h} textAnchor="middle" fill="#22282c" fontSize={13} fontWeight={700}>{m.g} g</text>
            <text x={x + 46} y={196} textAnchor="middle" fill="#343a3f" fontSize={11}>{m.label}</text>
          </g>
        );
      })}
      <line x1={24} y1={176} x2={596} y2={176} stroke="#bdb6aa" strokeWidth={1.2} />
      <text x={24} y={218} fill="#6c737a" fontSize={10.5}>全天总量比「训练后 30 分钟」更关键；每餐一份优质蛋白通常就够用</text>
    </svg>
  );
}
