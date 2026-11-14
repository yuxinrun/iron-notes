/**
 * 频道知识地图：把用户要求覆盖的主题逐项落到「实质讲解 + 可跳转内容」。
 * 每条讲解都给出可检验的判断或操作，不用占位文字填充。
 */
export interface KnowledgeTopic {
  name: string;
  desc: string;
  href: string;
}

export interface KnowledgeSection {
  id: string;
  title: string;
  en: string;
  intro: string;
  topics: KnowledgeTopic[];
}

const A = (slug: string) => `/articles/${slug}`;

export const knowledgeMap: Record<string, KnowledgeSection[]> = {
  "getting-started": [
    {
      id: "basics",
      title: "先建立正确认知",
      en: "01 / FOUNDATIONS",
      intro: "增肌是肌肉在足够机械张力、营养与恢复长期同时成立时发生的适应。前两周的目标不是练到力竭，而是弄清自己到底在练什么、每次训练该记录什么。",
      topics: [
        { name: "什么是肌肥大", desc: "肌纤维横截面积增加，与力量提升、体重上升是三件不同的事。", href: A("how-muscle-grows") },
        { name: "肌肉为什么会增长", desc: "机械张力是核心驱动，蛋白质合成升高是信号，不是成绩单。", href: A("how-muscle-grows") },
        { name: "抗阻训练的基本原理", desc: "用可重复的负荷让身体适应，再用渐进超负荷继续提供略高的刺激。", href: A("training-variables") },
        { name: "肌肉增长需要哪些条件", desc: "训练刺激、营养供给、恢复能力三者缺一，努力就难以累积。", href: "/articles/start-from-zero" },
        { name: "新手应该从哪里开始", desc: "先确认健康、时间与器械，再学 4 个基础动作模式。", href: A("start-from-zero") },
        { name: "增肌多久能看见变化", desc: "前 4–8 周主要是神经适应，围度变化要以月为单位观察。", href: A("how-muscle-grows") },
      ],
    },
    {
      id: "variables",
      title: "把术语弄明白",
      en: "02 / KEY VARIABLES",
      intro: "变量不是要背下来的名词，而是你之后每次调整计划时要动的旋钮。先记牢「组数、次数、重量、RIR」这四个能写进日志的量。",
      topics: [
        { name: "什么是训练容量", desc: "周有效组数是主要口径；只统计目标肌群承受主要张力的正式组。", href: A("weekly-sets") },
        { name: "什么是训练强度", desc: "本频道指接近力竭程度与相对负荷，不是「练得有多累」。", href: A("rir-rpe") },
        { name: "什么是训练频率", desc: "每周训练次数，更像分配容量的工具，不是增益按钮。", href: A("training-frequency") },
        { name: "什么是 RIR", desc: "这组结束时估计还能再做的次数，RIR 2 约等于 RPE 8。", href: A("rir-rpe") },
        { name: "什么是 RPE", desc: "抗阻训练专用 0–10 量表，RPE ≈ 10 − RIR。", href: A("rir-rpe") },
        { name: "什么是渐进超负荷", desc: "在动作质量不变的前提下，让刺激随时间缓慢上升。", href: A("progressive-overload") },
        { name: "什么是力竭训练", desc: "技术力竭指无法再以标准动作完成一次，是可选工具而非义务。", href: A("failure-training") },
      ],
    },
    {
      id: "practice",
      title: "第一次进健身房",
      en: "03 / FIRST SESSION",
      intro: "把「不知道该练什么」变成一张能照做的表：固定训练日、固定动作、固定记录格式。第一次宁可偏轻，先建立可比较的基线。",
      topics: [
        { name: "健身房常见器械介绍", desc: "固定器械、哑铃、杠铃与龙门架各适合什么阶段，按轨迹稳定性区分。", href: "/tools/generator" },
        { name: "如何选择训练重量", desc: "先定次数区间与 RIR，再反推重量；第一次用递增强度试探。", href: A("choose-weight") },
        { name: "新手最容易犯的 20 个错误", desc: "集中在：每周换计划、每组力竭、只记重量、靠补剂补饮食、忽略动作质量。", href: A("ten-habits") },
        { name: "一套完整的新手行动指南", desc: "从健康确认到 8 周复盘的完整路径，本站重点文章。", href: A("start-from-zero") },
      ],
    },
  ],

  science: [
    {
      id: "mechanism",
      title: "A · 肌肥大原理",
      en: "HYPERTROPHY MECHANISM",
      intro: "机械张力是目前证据最支持的核心驱动；肌肉蛋白质合成升高是信号，不是长期结果；肌肉损伤与代谢应激更可能是伴随或调节因素。理解这条因果链，才知道该优化什么。",
      topics: [
        { name: "机械张力", desc: "张力要落在目标肌群上，并且接近足够高的募集阈值。", href: A("how-muscle-grows") },
        { name: "肌肉增长与训练刺激", desc: "刺激需略高于已适应水平，且能重复、能记录。", href: A("progressive-overload") },
        { name: "肌肉蛋白质合成", desc: "急性升高不等于长期肥大，净增长看合成与降解的长期差值。", href: A("how-muscle-grows") },
        { name: "训练后的适应", desc: "表现先降后升，下一次训练应安排在恢复之后。", href: A("doms") },
        { name: "渐进超负荷", desc: "四条合法路径：加次数、加重量、加组数、改善质量。", href: A("progressive-overload") },
        { name: "训练容量 / 频率 / 强度", desc: "三者联动，单独调高一个往往让另一个下降。", href: A("training-variables") },
        { name: "接近力竭程度", desc: "非力竭在多数肥大指标上不劣于力竭。", href: A("failure-training") },
        { name: "不同动作的刺激差异", desc: "角度、力臂与稳定要求会改变参与比例。", href: A("chest-training") },
        { name: "肌肉长度与训练刺激", desc: "拉长位训练是新兴方向，结论尚不完全一致，本站不写成确定结论。", href: A("chest-training") },
        { name: "全程幅度与部分幅度", desc: "默认以无痛前提下的完整可控幅度为准，保证跨周可比。", href: A("how-muscle-grows") },
        { name: "不同训练经验者的差异", desc: "新手增益快、以神经适应为主；高阶者斜率平缓，进阶速度需调整。", href: A("rep-ranges") },
      ],
    },
    {
      id: "variables",
      title: "B · 训练变量",
      en: "TRAINING VARIABLES",
      intro: "没有一套适合所有人的固定标准。下表每个变量都给出「改变的是什么」与「适用边界」，请按自己的训练年限、时间与恢复能力取舍。",
      topics: [
        { name: "组数", desc: "周有效组数是核心旋钮，高容量区间证据稀疏。", href: A("weekly-sets") },
        { name: "次数", desc: "区间由目标、动作复杂度与关节状况决定。", href: A("rep-ranges") },
        { name: "重量", desc: "力量增益偏向高负荷，但低负荷接近力竭也能带来相近肥大。", href: A("choose-weight") },
        { name: "休息时间", desc: "复合动作 2–3 分钟，孤立动作 60–90 秒。", href: A("training-variables") },
        { name: "动作顺序", desc: "技术复杂、想进步的动作靠前，避免疲劳污染。", href: A("training-variables") },
        { name: "训练频率", desc: "总量相近时高频并无明确肥大优势。", href: A("training-frequency") },
        { name: "RIR / RPE", desc: "把当天状态写进处方，用于组间自动调节。", href: A("rir-rpe") },
        { name: "训练节奏", desc: "慢离心增加张力时间，代价是疲劳与酸痛上升。", href: A("training-variables") },
        { name: "动作幅度", desc: "以无痛、完整、可控为准，不追逐半程大重量。", href: A("bench-press") },
      ],
    },
    {
      id: "overload",
      title: "C · 渐进超负荷",
      en: "PROGRESSIVE OVERLOAD",
      intro: "加重量只是最容易被看见的一条路径。真正要求的是：在动作质量与幅度可比的前提下，让刺激随时间缓慢上升。",
      topics: [
        { name: "如何增加训练重量", desc: "所有组达次数上限、动作稳定、RIR 充足后加 2.5–5%。", href: A("progressive-overload") },
        { name: "如何增加重复次数", desc: "同重量下先补次数，这是双重渐进的第一步。", href: A("progressive-overload") },
        { name: "如何增加训练组数", desc: "恢复良好且表现稳定时，一次只给 1–2 个肌群各加 1–2 组。", href: A("weekly-sets") },
        { name: "双重渐进法", desc: "先加次数到上限，再加重量重新爬升。", href: A("progressive-overload") },
        { name: "判断是否该加重量", desc: "三个条件同时满足才加，缺一个再等一周。", href: A("choose-weight") },
        { name: "如何记录训练表现", desc: "记录全部组的重量 × 次数 × RIR，而不是只记最重一组。", href: A("ten-habits") },
        { name: "连续几周没进步", desc: "按记录 → 恢复 → 摄入 → 容量 → 减量顺序排查。", href: A("plateau") },
        { name: "避免牺牲动作质量", desc: "缩短幅度、借力、耸肩换来的加片都不是进步。", href: A("progressive-overload") },
      ],
    },
    {
      id: "intensity",
      title: "D · 训练强度与力竭",
      en: "INTENSITY & FAILURE",
      intro: "力竭是工具，不是门票。真正该问的是：这一组的疲劳成本，换回了多少有效刺激，会不会拖垮后续组与下一次训练。",
      topics: [
        { name: "什么是接近力竭", desc: "以 RIR 1–3 描述，比「练到很累」更可记录。", href: A("rir-rpe") },
        { name: "如何使用 RIR", desc: "复合动作 2–3，孤立动作 1–2，减量周 4–5。", href: A("rir-rpe") },
        { name: "如何理解 RPE", desc: "抗阻专用量表，与 Borg 跑步量表不是一回事。", href: A("rir-rpe") },
        { name: "什么情况适合力竭", desc: "安全的孤立动作最后一组、阶段性测试、时间极短的训练。", href: A("failure-training") },
        { name: "什么情况不建议力竭", desc: "复合动作、睡眠不足、关节不适、后续还有多组时。", href: A("failure-training") },
        { name: "新手如何判断动作质量", desc: "查幅度、路径、代偿、速度四条。", href: A("failure-training") },
        { name: "不同动作的疲劳影响", desc: "深蹲硬拉成本远高于侧平举与下压。", href: A("failure-training") },
      ],
    },
    {
      id: "programming",
      title: "E · 训练计划制定",
      en: "PROGRAM DESIGN",
      intro: "分化方式本身不是决定增肌效果的因素，关键在于训练总量、训练质量、恢复和长期执行。下面各类型都能在计划库里找到可打卡的模板。",
      topics: [
        { name: "全身训练", desc: "每次覆盖全部动作模式，适合新手与每周 2–3 练。", href: A("three-day-plan") },
        { name: "上下肢分化", desc: "每周 4 练，单次能给每个肌群更多组数。", href: A("four-day-plan") },
        { name: "推拉腿", desc: "按动作模式归堆，三练与六练版本容量差别明显。", href: A("ppl-explained") },
        { name: "四分化 / 五分化", desc: "适合明确薄弱部位补强，但大肌群每周只集中一次。", href: "/plans" },
        { name: "高低强度安排", desc: "重日看力量、容量日补组数，避免每天力竭。", href: A("ppl-explained") },
        { name: "训练日与休息日", desc: "两个大强度下肢日至少隔一天。", href: A("training-frequency") },
        { name: "不同肌群的训练安排", desc: "胸背肩腿各自需要覆盖不同动作线。", href: A("leg-training") },
        { name: "周训练量合理分配", desc: "把周组数拆到 2 个训练日通常比一天堆完质量更高。", href: A("weekly-sets") },
        { name: "计划调整周期", desc: "连续执行 6–8 周再复盘，一次只改一个变量。", href: A("plateau") },
      ],
    },
  ],

  nutrition: [
    {
      id: "energy",
      title: "1 · 能量摄入",
      en: "ENERGY BALANCE",
      intro: "热量公式是群体预测式，正确用法是给起点，再用 2–3 周体重 7 日均线校准。增肌需要温和盈余，过大盈余主要增加脂肪。",
      topics: [
        { name: "基础代谢 BMR", desc: "本站用 Mifflin-St Jeor 公式估算，个体实测可有明显偏差。", href: A("calorie-surplus") },
        { name: "日常总能量消耗 TDEE", desc: "BMR × 活动系数，还要算日常步数与工作性质。", href: "/tools/calorie" },
        { name: "增肌热量盈余", desc: "从约 3 kcal/kg/日 起步，不要一次加到上限。", href: A("calorie-surplus") },
        { name: "体重增长速度", desc: "看周均线的斜率，别用越快越好当目标。", href: A("calorie-surplus") },
        { name: "体重变化与水分波动", desc: "单日 0.5 kg 常只是水分、盐分与胃肠内容物。", href: A("calorie-surplus") },
        { name: "如何估算每日热量", desc: "公式 → 活动系数 → 温和盈余 → 两周校准四步。", href: "/tools/calorie" },
        { name: "如何调整热量摄入", desc: "一次只改 100–150 kcal，观察两周再决定。", href: A("calorie-surplus") },
      ],
    },
    {
      id: "protein",
      title: "2 · 蛋白质",
      en: "PROTEIN",
      intro: "蛋白质补充在抗阻训练基础上带来小幅额外增益；约 1.6 g/kg/日 是研究中观察到的平均拐点，不是人人必须达到的硬指标。",
      topics: [
        { name: "蛋白质为什么重要", desc: "提供必需氨基酸，支持训练后的净蛋白累积。", href: A("protein-intake") },
        { name: "每日摄入量", desc: "按体重算区间，从区间中下部起步再校准。", href: "/tools/protein" },
        { name: "不同体重下的估算", desc: "70 kg 示例约 98–140 g/日，减脂期区间上移。", href: A("protein-intake") },
        { name: "优质蛋白来源", desc: "蛋、奶、鱼虾、禽肉、瘦肉、豆制品。", href: A("protein-intake") },
        { name: "动植物蛋白区别", desc: "植物蛋白可通过多样化与略高总量达到类似效果。", href: A("protein-intake") },
        { name: "蛋白质分配", desc: "3–4 餐、每餐一份优质蛋白，比掐分钟更实用。", href: A("protein-intake") },
        { name: "训练前后营养", desc: "空腹训练或间隔过久时更有意义，其余情况窗口宽松。", href: A("carbs-fats") },
        { name: "乳清蛋白", desc: "方便的高蛋白食物，不是药物也不是必需品。", href: A("protein-intake") },
        { name: "普通饮食如何达标", desc: "三份掌心大小的优质蛋白通常已接近区间中下部。", href: A("protein-intake") },
      ],
    },
    {
      id: "carbs",
      title: "3 · 碳水化合物",
      en: "CARBOHYDRATE",
      intro: "碳水以糖原形式储存，是中高强度抗阻训练的重要燃料。按 g/kg 与训练量估算，比按热量占比更贴近表现需要。",
      topics: [
        { name: "碳水与训练表现", desc: "训练量越大、组数越多，对糖原依赖越明显。", href: A("carbs-fats") },
        { name: "糖原", desc: "储存时伴随水分，这是体重短期波动的来源之一。", href: A("carbs-fats") },
        { name: "训练前碳水", desc: "训练前 1–3 小时的一餐含碳水与蛋白更实用。", href: A("carbs-fats") },
        { name: "训练后碳水", desc: "下一顿正餐在 1–2 小时内，不必额外安排补给窗口。", href: A("carbs-fats") },
        { name: "不同训练量的需求", desc: "从约 3–4 g/kg 到 5–7 g/kg 的实践分层。", href: A("carbs-fats") },
        { name: "常见碳水来源", desc: "米饭、面、燕麦、薯类、玉米、豆类、水果。", href: A("carbs-fats") },
      ],
    },
    {
      id: "fat",
      title: "4 · 脂肪",
      en: "DIETARY FAT",
      intro: "脂肪参与细胞膜结构、脂溶性维生素吸收、激素合成与必需脂肪酸供给，不宜压到极低。比例是计算结果，不是目标。",
      topics: [
        { name: "脂肪的生理作用", desc: "结构、吸收、合成与必需脂肪酸供给。", href: A("carbs-fats") },
        { name: "必需脂肪酸", desc: "需由食物提供，长期极低脂饮食风险更高。", href: A("carbs-fats") },
        { name: "脂肪摄入下限", desc: "实践上常不低于约 0.6–1.0 g/kg/日 或总热量 20%。", href: "/tools/macros" },
        { name: "脂肪来源", desc: "坚果、种子、植物油、鱼类、鸡蛋、牛油果。", href: A("carbs-fats") },
        { name: "如何平衡饮食", desc: "先守蛋白与脂肪克数，再用碳水填补剩余热量。", href: A("carbs-fats") },
      ],
    },
    {
      id: "practice",
      title: "5 · 增肌饮食实战",
      en: "PRACTICAL EATING",
      intro: "把估算落到餐盘上：食物重量、标签单位、外食组合与成本，都是决定「能不能长期做到」的现实因素。",
      topics: [
        { name: "如何制定一日饮食", desc: "蛋白、脂肪先定克数，碳水补剩余热量，分到 3–4 餐。", href: A("carbs-fats") },
        { name: "如何准备健身餐", desc: "按固定口径称生重，批量准备蛋白与主食。", href: A("carbs-fats") },
        { name: "外食如何选择", desc: "一份蛋白 + 一份主食 + 一份蔬菜，酱料另放。", href: A("carbs-fats") },
        { name: "如何计算食物重量", desc: "生重口径更稳定；没有秤时用固定份量估计。", href: A("carbs-fats") },
        { name: "如何阅读营养标签", desc: "注意「每 100 g」还是「每份」，以及熟重差异。", href: A("carbs-fats") },
        { name: "训练日 / 休息日饮食", desc: "周总摄入才是趋势决定量，不必强行每天不同。", href: A("calorie-surplus") },
        { name: "低成本获得足够蛋白", desc: "鸡蛋、牛奶、冷冻鸡胸、豆制品通常比即食产品便宜。", href: A("protein-intake") },
      ],
    },
    {
      id: "supplements",
      title: "6 · 补剂知识",
      en: "SUPPLEMENTS",
      intro: "按证据分层，不夸大功效，不推荐非法或危险产品。补剂负责把最后几分补齐，不负责替你把前面八十分练完。",
      topics: [
        { name: "乳清蛋白", desc: "作为蛋白来源研究充分，属于便利性选择。", href: A("protein-intake") },
        { name: "肌酸一水合物", desc: "研究较充分，每日 3–5 g，不必冲击期。", href: A("creatine") },
        { name: "咖啡因", desc: "特定表现场景有证据，但会明显影响部分人的睡眠。", href: A("sleep") },
        { name: "电解质", desc: "高温、长时间出汗场景下有意义，非日常必需。", href: A("carbs-fats") },
        { name: "维生素 D / 鱼油", desc: "是否补充应结合饮食、日照与检查结果，不盲目购买。", href: "/resources#standards" },
        { name: "证据有限的产品", desc: "蛋白已充足时的支链氨基酸、部分促合成复方。", href: A("creatine") },
        { name: "不建议盲目购买", desc: "不明成分、宣称类固醇替代的产品；本站不提供非法药物方案。", href: "/resources#standards" },
      ],
    },
  ],

  recovery: [
    {
      id: "fatigue",
      title: "疲劳与恢复",
      en: "01 / FATIGUE",
      intro: "一次训练后表现会短暂下降，随恢复回到甚至略高于基线。恢复不是训练的反面，而是刺激兑现成适应的那段时间。",
      topics: [
        { name: "睡眠与肌肉恢复", desc: "与短期力量表现、恢复感受相关；长期肥大的因果证据仍有限。", href: A("sleep") },
        { name: "训练疲劳", desc: "局部、全身与心理疲劳都需要与训练量一起记录。", href: A("plateau") },
        { name: "延迟性肌肉酸痛 DOMS", desc: "损伤并非肥大必要条件，酸痛是反馈不是成绩单。", href: A("doms") },
        { name: "休息日如何安排", desc: "保持低强度日常活动，不额外加训练量。", href: A("plateau") },
        { name: "训练频率如何调整", desc: "恢复吃紧时先降单日容量或减天数。", href: A("training-frequency") },
        { name: "过度训练与恢复不足的区别", desc: "前者是长期累积，后者常由短期睡眠、热量或压力触发。", href: A("plateau") },
        { name: "减量周", desc: "组数减半、重量降 10%、RIR 4，保留动作与频率。", href: A("plateau") },
      ],
    },
    {
      id: "progress",
      title: "进步与评估",
      en: "02 / PROGRESS",
      intro: "进步不止一种写法：同次数下重量上升、同重量下次数上升、同重量同次数但 RIR 改善。评估要基于可比较的记录，而不是镜子。",
      topics: [
        { name: "训练平台期", desc: "需要可比较记录 + 3–4 周以上无进展两个前提。", href: A("plateau") },
        { name: "训练表现波动", desc: "单日波动正常，用周均值与 RIR 趋势判断。", href: A("plateau") },
        { name: "肌肉增长速度", desc: "以月为单位观察，本站不承诺固定时间增长多少。", href: A("how-muscle-grows") },
        { name: "体重和围度监测", desc: "体重 + 腰围 / 臂围 + 训练表现三条线一起看。", href: "/tools/progress" },
        { name: "练半年没明显增长", desc: "按记录 → 刺激 → 营养 → 恢复 → 预期五环排查。", href: A("no-progress-six-months") },
        { name: "长期训练依从性", desc: "完成率比单次完美程度更能预测长期结果。", href: A("ten-habits") },
        { name: "如何建立健身习惯", desc: "从记录、固定口径、定期复盘三条开始。", href: A("ten-habits") },
      ],
    },
    {
      id: "essays",
      title: "重点文章",
      en: "FEATURED ESSAYS",
      intro: "四篇把「恢复不是偷懒」讲透的长文，适合在停滞期连续读完，再回头翻自己的日志。",
      topics: [
        { name: "你不是练得不够，而可能是恢复得不够", desc: "对应《为什么训练半年，肌肉却没有明显增长？》。", href: A("no-progress-six-months") },
        { name: "肌肉酸痛不等于训练有效", desc: "对应《训练后酸痛越明显，增肌效果越好吗？》。", href: A("doms") },
        { name: "为什么练了半年，重量没明显增加", desc: "对应《渐进超负荷》与《如何判断平台期》。", href: A("progressive-overload") },
        { name: "如何判断是否进入平台期", desc: "给出判据、假平台期四种成因与减量策略。", href: A("plateau") },
      ],
    },
  ],
};
