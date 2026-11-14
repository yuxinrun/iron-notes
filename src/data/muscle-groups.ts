import type { MuscleGroup } from "@/types";

export const muscleGroups: MuscleGroup[] = [
  {
    id: "chest",
    name: "胸部",
    en: "CHEST",
    side: "front",
    function: "肩关节水平内收、肩屈曲、上臂内旋",
    description: "以胸大肌为主，分为锁骨部（上胸）与胸肋部（中下胸）。卧推与飞鸟类动作主要训练水平内收功能。",
  },
  {
    id: "back",
    name: "背部",
    en: "BACK",
    side: "back",
    function: "肩关节内收、伸展、肩胛后缩与下压",
    description: "包含背阔肌、斜方肌中下束、菱形肌与竖脊肌。垂直拉与水平拉对背部的刺激区域并不相同。",
  },
  {
    id: "shoulders",
    name: "肩部",
    en: "SHOULDERS",
    side: "both",
    function: "肩外展、肩屈曲、上举与肩胛稳定",
    description: "三角肌分前束、中束、后束；推类动作常已充分刺激前束，侧平举与反向飞鸟用于补足中后束。",
  },
  {
    id: "biceps",
    name: "肱二头肌",
    en: "BICEPS",
    side: "front",
    function: "肘屈曲、前臂旋后、辅助肩屈曲",
    description: "长头与短头跨肩肘两关节，手臂位置会改变其长度与发力感；肱肌、肱桡肌也参与肘屈曲。",
  },
  {
    id: "triceps",
    name: "肱三头肌",
    en: "TRICEPS",
    side: "back",
    function: "肘伸展，长头辅助肩伸展",
    description: "占上臂体积的大部分。推类动作与肘伸展孤立动作共同构成完整刺激，长头在过头位被拉长。",
  },
  {
    id: "forearms",
    name: "前臂",
    en: "FOREARMS",
    side: "both",
    function: "握力、腕屈伸、前臂旋前旋后",
    description: "由多组屈肌/伸肌群构成。握持类复合动作通常已提供大量刺激，孤立训练用于补足握力短板。",
  },
  {
    id: "abs",
    name: "腹部与核心",
    en: "CORE",
    side: "front",
    function: "躯干屈曲、抗伸展、抗旋转与腹内压维持",
    description: "腹直肌、腹外斜肌、腹横肌等。核心训练不只是卷腹，抗伸展与抗旋转对大重量动作的稳定更有迁移价值。",
  },
  {
    id: "glutes",
    name: "臀部",
    en: "GLUTES",
    side: "back",
    function: "髋伸展、髋外展与骨盆稳定",
    description: "臀大肌是主要髋伸肌，臀中肌负责额状面稳定。髋伸类动作在接近完全伸髋位对臀部刺激更集中。",
  },
  {
    id: "quads",
    name: "股四头肌",
    en: "QUADRICEPS",
    side: "front",
    function: "膝伸展，股直肌兼有髋屈曲功能",
    description: "四块肌肉组成，深蹲、腿举与分腿蹲在足够膝屈曲幅度下可有效刺激；脚位与躯干角度改变力矩分布。",
  },
  {
    id: "hamstrings",
    name: "腘绳肌",
    en: "HAMSTRINGS",
    side: "back",
    function: "膝屈曲、髋伸展",
    description: "跨髋膝双关节。髋主导动作（罗马尼亚硬拉）与膝主导动作（腿弯举）分别偏重其髋伸与膝屈功能。",
  },
  {
    id: "calves",
    name: "小腿",
    en: "CALVES",
    side: "back",
    function: "踝跖屈、维持站立与步态稳定",
    description: "腓肠肌跨膝踝，比目鱼肌只跨踝；直腿提踵偏重腓肠肌，屈膝提踵偏重比目鱼肌。",
  },
  {
    id: "compound",
    name: "全身复合动作",
    en: "COMPOUND",
    side: "both",
    function: "多关节协同，涉及髋、膝、肩、肘与躯干稳定",
    description: "深蹲、硬拉、推举、引体等需要多个肌群协同，动作技术与疲劳管理比单纯「堆重量」更关键。",
  },
];

export const muscleById = Object.fromEntries(muscleGroups.map((m) => [m.id, m]));

export function muscleName(id: string): string {
  return muscleById[id]?.name ?? id;
}
