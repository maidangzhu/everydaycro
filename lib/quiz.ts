export type QuizQuestion = {
  id: string
  category: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

/**
 * CRO / 临床研究行业知识题库。每天按日期从中轮换抽 3 题。
 * 后续可以让 LLM 基于每日新闻动态生成新题，接进同一结构。
 */
export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'cro-1',
    category: 'CRO 基础',
    question: 'CRO 这个缩写代表什么？',
    options: [
      'Clinical Research Organization（临床研究组织）',
      'Central Regulatory Office（中央监管办公室）',
      'Certified Review Operator（认证审评操作方）',
      'Clinical Records Office（临床档案办公室）',
    ],
    answerIndex: 0,
    explanation: 'CRO = Contract/Clinical Research Organization，即合同研究组织，为药企（申办方）提供临床试验外包服务。',
  },
  {
    id: 'phase-3',
    category: '试验分期',
    question: 'III 期临床试验的主要目的是什么？',
    options: [
      '首次在人体测试安全性',
      '在大规模人群中确证疗效并监测不良反应',
      '确定药物的最佳给药途径',
      '进行药物的临床前动物实验',
    ],
    answerIndex: 1,
    explanation: 'III 期是确证性试验，通常数百到数千人，用来证明疗效、收集安全性数据，是注册上市的关键依据。I 期看安全性，II 期探索剂量和初步疗效。',
  },
  {
    id: 'gcp',
    category: '法规',
    question: 'GCP（药物临床试验质量管理规范）的核心目的是什么？',
    options: [
      '加快药物上市审批速度',
      '保护受试者权益并保证试验数据真实可靠',
      '降低临床试验的运营成本',
      '统一全球药品定价',
    ],
    answerIndex: 1,
    explanation: 'ICH-GCP 的两大支柱：保护受试者的权益、安全与福祉；保证试验数据的可信度。它是伦理与科学质量的国际标准。',
  },
  {
    id: 'sponsor-cro',
    category: 'CRO 基础',
    question: '在临床试验中，"申办方（Sponsor）"通常指谁？',
    options: [
      '负责执行试验的医院',
      '发起并对试验负责、通常出资的药企或机构',
      '监查试验的监管机构',
      '招募受试者的中介公司',
    ],
    answerIndex: 1,
    explanation: '申办方是发起、管理并出资临床试验的一方（多为药企）。CRO 受申办方委托执行部分或全部工作，但最终责任仍在申办方。',
  },
  {
    id: 'monitoring',
    category: '临床运营',
    question: 'CRA（临床监查员）现场监查的核心工作是什么？',
    options: [
      '给受试者开处方',
      '核对源数据、确认试验按方案和 GCP 执行',
      '设计试验统计方法',
      '撰写药品说明书',
    ],
    answerIndex: 1,
    explanation: 'CRA（Clinical Research Associate）做 SDV（源数据核查）、确认知情同意、核对原始记录与 CRF 一致性，确保试验合规、数据真实。',
  },
  {
    id: 'randomization',
    category: '试验设计',
    question: '随机化（Randomization）在试验中主要为了？',
    options: [
      '让医生自由选择治疗方案',
      '减少选择偏倚，使各组基线可比',
      '缩短招募时间',
      '降低样本量需求',
    ],
    answerIndex: 1,
    explanation: '随机化把受试者随机分配到各组，平衡已知和未知的混杂因素，是因果推断的基石。',
  },
  {
    id: 'blinding',
    category: '试验设计',
    question: '"双盲"试验指的是谁不知道分组？',
    options: [
      '只有受试者不知道',
      '受试者和研究者（医生）都不知道',
      '只有统计分析人员不知道',
      '申办方和监管机构不知道',
    ],
    answerIndex: 1,
    explanation: '双盲 = 受试者和直接参与的研究人员都不知道分组，避免主观偏倚影响疗效和安全性评估。',
  },
  {
    id: 'primary-endpoint',
    category: '试验设计',
    question: '主要终点（Primary Endpoint）的作用是？',
    options: [
      '衡量试验是否达到预设的核心疗效/安全性目标',
      '记录所有不良反应',
      '计算试验的预算',
      '决定受试者的补偿金额',
    ],
    answerIndex: 0,
    explanation: '主要终点是试验预先设定的、用来判断成败的核心指标，样本量和统计分析都围绕它设计。',
  },
  {
    id: 'informed-consent',
    category: '法规',
    question: '知情同意（Informed Consent）最关键的原则是？',
    options: [
      '受试者签字后就不能退出',
      '受试者充分理解并自愿参加，可随时退出',
      '只需要家属同意即可',
      '只要口头同意就足够',
    ],
    answerIndex: 1,
    explanation: '知情同意要求受试者在充分理解风险获益后自愿同意，且任何时候可无条件退出，是伦理底线。',
  },
  {
    id: 'irb',
    category: '法规',
    question: 'IRB / 伦理委员会的主要职责是？',
    options: [
      '审批药品的生产工艺',
      '审查试验方案以保护受试者权益',
      '为药企做市场推广',
      '培训 CRA 监查技能',
    ],
    answerIndex: 1,
    explanation: '机构审查委员会（IRB）/伦理委员会独立审查方案与知情同意书，核心是保护受试者，试验获批前必须通过。',
  },
  {
    id: 'ae-sae',
    category: '临床运营',
    question: 'SAE（严重不良事件）的判定标准是？',
    options: [
      '任何让受试者不舒服的反应',
      '导致死亡、危及生命、住院或延长住院、致残等的事件',
      '只在 III 期才算的事件',
      '由申办方主观判断的事件',
    ],
    answerIndex: 1,
    explanation: 'SAE 有明确标准：死亡、危及生命、需住院或延长住院、持续/显著残疾、先天异常等。需在规定时限内上报。',
  },
  {
    id: 'edc',
    category: '工具',
    question: 'EDC 系统在临床试验中是干什么的？',
    options: [
      '电子化采集和管理临床试验数据',
      '给受试者发放试验药物',
      '自动生成药品专利',
      '做药物的化学合成',
    ],
    answerIndex: 0,
    explanation: 'EDC（Electronic Data Capture）电子数据采集系统，用于录入、核查、管理 CRF 数据，是现代临床数据管理的核心，也是 AI 工具发力的环节。',
  },
  {
    id: 'decentralized',
    category: '行业趋势',
    question: '去中心化临床试验（DCT）的最大优势通常是？',
    options: [
      '完全不需要研究者参与',
      '让受试者在家就能参与，扩大可及性、提升依从性',
      '不需要任何监管审批',
      '可以省略知情同意',
    ],
    answerIndex: 1,
    explanation: 'DCT 通过远程访视、可穿戴设备、电子知情等减少受试者奔波，扩大招募范围。AI 在远程监测和数据分析里作用很大。',
  },
  {
    id: 'ai-matching',
    category: 'AI 应用',
    question: '当前 AI 在临床试验中证据最充分的应用是？',
    options: [
      '完全自动取代医生做诊断',
      '患者-试验匹配与资格筛选',
      '自动批准新药上市',
      '替代伦理委员会审查',
    ],
    answerIndex: 1,
    explanation: '患者匹配、资格筛选、EHR 数据提取是当前 AI 落地最实的方向——从海量病历里快速找出符合入排标准的受试者，大幅缩短招募时间。',
  },
  {
    id: 'part11',
    category: '法规',
    question: 'FDA 21 CFR Part 11 规范的是什么？',
    options: [
      '药物的化学纯度',
      '电子记录与电子签名的可信性',
      '临床试验的招募广告',
      '药品的运输冷链',
    ],
    answerIndex: 1,
    explanation: '21 CFR Part 11 规定电子记录和电子签名等同纸质的合规要求（审计追踪、权限、验证等），AI 工具进临床流程必须过这一关。',
  },
  {
    id: 'gxp',
    category: '法规',
    question: '"GxP" 这个统称涵盖的是哪类规范？',
    options: [
      '只指 GMP 生产规范',
      'GLP/GCP/GMP 等一系列质量与合规规范的总称',
      '药品的营销规范',
      '医疗器械的外观标准',
    ],
    answerIndex: 1,
    explanation: 'GxP 是 Good x Practice 的统称（GLP 实验室、GCP 临床、GMP 生产、GVP 药物警戒等）。AI 工具要进临床，常需满足 GxP 合规与人工审核架构。',
  },
  {
    id: 'placebo',
    category: '试验设计',
    question: '设置安慰剂对照组的主要目的是？',
    options: [
      '节省试验药物成本',
      '排除心理和非特异效应，测出真实药效',
      '让受试者更舒服',
      '减少伦理审查',
    ],
    answerIndex: 1,
    explanation: '安慰剂对照帮我们把"真药效"从安慰剂效应、自然病程里分离出来，是疗效确证的金标准设计。',
  },
  {
    id: 'itt',
    category: '统计',
    question: 'ITT（意向性治疗）分析的原则是？',
    options: [
      '只分析完成全部治疗的受试者',
      '按随机分组分析所有受试者，无论是否完成治疗',
      '只分析出现疗效的人',
      '剔除所有出组的人',
    ],
    answerIndex: 1,
    explanation: 'ITT 按最初随机分组纳入所有人分析，保持随机化带来的组间可比性，避免破坏随机，是优效性试验的主要分析集。',
  },
  {
    id: 'cro-trend',
    category: '行业趋势',
    question: '大型 CRO（如 ICON、IQVIA）纷纷接入大模型，主要想解决什么？',
    options: [
      '完全取代临床研究者',
      '方案设计、中心选择、数据监查等环节的提效',
      '跳过监管审批',
      '替代受试者签署知情同意',
    ],
    answerIndex: 1,
    explanation: 'CRO 引入 LLM 主要提升运营效率：辅助方案设计、智能选中心、自动化数据核查与监测。但 PHI 处理、责任归属、审计追踪等合规治理是落地焦点。',
  },
  {
    id: 'sample-size',
    category: '统计',
    question: '样本量估算最主要依据什么？',
    options: [
      '申办方的预算多少',
      '预期效应量、显著性水平 α 和把握度（power）',
      '医院有多少空闲床位',
      '试验想做多快',
    ],
    answerIndex: 1,
    explanation: '样本量由预期效应量、I 类错误 α、统计把握度（1-β）和主要终点的变异决定，算少了检验不出差异，算多了浪费资源。',
  },
  {
    id: 'phase-1',
    category: '试验分期',
    question: 'I 期临床试验通常招募谁、看什么？',
    options: [
      '大量患者，看长期疗效',
      '少量健康志愿者或患者，看安全性与耐受性',
      '只看动物实验数据',
      '统计专家，看数据分布',
    ],
    answerIndex: 1,
    explanation: 'I 期通常几十人，核心是安全性、耐受性和药代动力学（PK），确定安全剂量范围，还不追求疗效。',
  },
  {
    id: 'phase-2',
    category: '试验分期',
    question: 'II 期临床试验的核心目标是？',
    options: [
      '确证大规模疗效',
      '探索剂量并初步评估疗效',
      '只做药物稳定性测试',
      '上市后监测',
    ],
    answerIndex: 1,
    explanation: 'II 期在目标患者群体里探索剂量、看初步疗效信号和安全性，是决定要不要进 III 期的关键节点。',
  },
  {
    id: 'phase-4',
    category: '试验分期',
    question: 'IV 期临床试验发生在什么时候？',
    options: [
      '药物上市前',
      '药物上市后，监测真实世界的长期安全性',
      '临床前阶段',
      '只在做动物实验时',
    ],
    answerIndex: 1,
    explanation: 'IV 期是上市后研究（PMS），在更大、更真实的人群里监测罕见/迟发不良反应和长期疗效。',
  },
  {
    id: 'crf',
    category: '临床运营',
    question: 'CRF（病例报告表）是用来干什么的？',
    options: [
      '给受试者看的宣传册',
      '按方案采集每位受试者试验数据的标准表格',
      '医院的财务报表',
      '药品的包装设计稿',
    ],
    answerIndex: 1,
    explanation: 'CRF 是按方案设计的、为每位受试者采集数据的标准化表格（现在多为 eCRF，录入 EDC 系统）。',
  },
  {
    id: 'sdv',
    category: '临床运营',
    question: 'SDV（源数据核查）是指？',
    options: [
      '核对 CRF 数据与原始病历/源文件是否一致',
      '检查药品的生产批次',
      '审核统计代码',
      '给受试者做体检',
    ],
    answerIndex: 0,
    explanation: 'SDV 是 CRA 把录入到 CRF/EDC 的数据和源文件（病历、检验报告）逐条比对，保证数据真实、准确、可溯源。',
  },
  {
    id: 'pico',
    category: '试验设计',
    question: '设计试验时常用的 PICO 框架不包括哪个？',
    options: [
      'Patient（研究人群）',
      'Intervention（干预）',
      'Comparison（对照）',
      'Profit（利润）',
    ],
    answerIndex: 3,
    explanation: 'PICO = 人群 Patient、干预 Intervention、对照 Comparison、结局 Outcome，是提出临床研究问题的经典框架，跟利润无关。',
  },
  {
    id: 'survival',
    category: '统计',
    question: '肿瘤试验里 OS 和 PFS 的区别是？',
    options: [
      'OS 是总生存期，PFS 是无进展生存期',
      '两者完全一样',
      'OS 只看生活质量',
      'PFS 是财务指标',
    ],
    answerIndex: 0,
    explanation: 'OS（总生存）看活多久，是最硬的终点；PFS（无进展生存）看病情多久不恶化，更早读出、受后续治疗影响小，常作替代终点。',
  },
  {
    id: 'crossover',
    category: '试验设计',
    question: '交叉试验（Crossover）设计的特点是？',
    options: [
      '每位受试者先后接受多种处理，自身作对照',
      '受试者随机分成两组永不变',
      '完全不用随机',
      '只做体外实验',
    ],
    answerIndex: 0,
    explanation: '交叉设计让同一受试者在不同阶段轮换接受不同处理，自身对照、省样本量，但要求病情稳定且有洗脱期。',
  },
  {
    id: 'noninferiority',
    category: '统计',
    question: '非劣效试验（Non-inferiority）想证明什么？',
    options: [
      '新药一定比旧药好',
      '新药不劣于对照（在可接受范围内）',
      '新药完全没有副作用',
      '新药更便宜',
    ],
    answerIndex: 1,
    explanation: '非劣效试验证明新治疗不比现有治疗差太多（在预设界值内），常用于新药更安全、更方便或更便宜时。',
  },
  {
    id: 'pha-vigilance',
    category: '法规',
    question: '药物警戒（Pharmacovigilance, PV）主要做什么？',
    options: [
      '监测、评估和预防药品不良反应',
      '给药品打广告',
      '管理药品库存',
      '培训销售代表',
    ],
    answerIndex: 0,
    explanation: 'PV 贯穿药品全生命周期，收集和分析不良反应报告、识别风险信号，AI 正在用来自动化处理海量安全性报告。',
  },
  {
    id: 'med-writing',
    category: '工具',
    question: '医学撰写（Medical Writing）里的 CSR 是指？',
    options: [
      'Clinical Study Report（临床研究报告）',
      '公司社会责任报告',
      '患者满意度问卷',
      '药品定价方案',
    ],
    answerIndex: 0,
    explanation: 'CSR 是试验结束后提交的完整临床研究报告，记录方法、结果和结论。LLM 辅助撰写 CSR 是当下热门应用。',
  },
  {
    id: 'adaptive',
    category: '试验设计',
    question: '适应性设计（Adaptive Design）试验的优势是？',
    options: [
      '完全不预设任何规则',
      '可按预设规则在中途调整（如剂量、样本量）',
      '不需要统计分析',
      '可以随意改主要终点',
    ],
    answerIndex: 1,
    explanation: '适应性设计允许根据期中分析按预设规则调整（调整剂量、提前终止无效组、重估样本量），更灵活高效，但需严格预设以控 I 类错误。',
  },
  {
    id: 'master-protocol',
    category: '行业趋势',
    question: '篮式（Basket）/伞式（Umbrella）试验属于哪类设计？',
    options: [
      '主方案（Master Protocol）框架',
      '单臂回顾性研究',
      '纯体外实验',
      '市场调查',
    ],
    answerIndex: 0,
    explanation: '篮式（同一靶向药治多种癌）、伞式（同一癌种测多种靶向药）、平台试验都属于主方案框架，一份方案同时研究多个子问题，效率更高。',
  },
  {
    id: 'rwe',
    category: '行业趋势',
    question: '真实世界证据（RWE）主要来自？',
    options: [
      '严格对照的随机试验',
      '电子病历、医保数据、可穿戴设备等真实诊疗数据',
      '动物实验',
      '理论推算',
    ],
    answerIndex: 1,
    explanation: 'RWE 来自 EHR、医保理赔、登记系统、可穿戴设备等真实世界数据，可补充 RCT 证据，AI 在处理这些非结构化数据上大有可为。',
  },
  {
    id: 'synthetic-control',
    category: 'AI 应用',
    question: '合成对照臂（Synthetic Control Arm）是指？',
    options: [
      '用历史/外部数据模拟对照组，减少实际入组对照',
      '用塑料手臂做实验',
      '完全不用对照组',
      '让受试者自己选组',
    ],
    answerIndex: 0,
    explanation: '合成对照臂用历史试验或真实世界数据构建"虚拟"对照组，可减少甚至替代实际对照组入组，罕见病领域尤其有价值，但监管接受度仍在演进。',
  },
  {
    id: 'eligibility',
    category: 'AI 应用',
    question: 'AI 做受试者资格筛选时，主要解析什么？',
    options: [
      '入排标准（Inclusion/Exclusion Criteria）与病历的匹配',
      '药品的价格',
      '医院的装修',
      '医生的排班表',
    ],
    answerIndex: 0,
    explanation: 'AI 把方案的入排标准与患者 EHR（诊断、检验、用药、既往史）结构化匹配，快速筛出候选受试者，是当前落地最实的招募提效场景。',
  },
  {
    id: 'phi',
    category: '法规',
    question: '在临床数据里，PHI 指的是？',
    options: [
      '受保护的健康信息（Protected Health Information）',
      '药品化学编号',
      '伦理委员会代号',
      '统计软件名称',
    ],
    answerIndex: 0,
    explanation: 'PHI 是可识别个人的健康信息，受 HIPAA 等法规保护。AI 工具处理临床数据必须做好 PHI 脱敏、访问控制和 BAA，这是合规部署的核心。',
  },
  {
    id: 'ich',
    category: '法规',
    question: 'ICH 这个组织的作用是？',
    options: [
      '协调各国药品注册技术要求，减少重复',
      '给药品定价',
      '管理医院人事',
      '生产疫苗',
    ],
    answerIndex: 0,
    explanation: 'ICH（国际人用药品注册技术协调会）协调欧美日等地的技术要求（如 E6 GCP、E9 统计原则），让一套数据能多国申报。',
  },
  {
    id: 'e6-e9',
    category: '统计',
    question: 'ICH E9 指导原则规范的是？',
    options: [
      '临床试验的统计学原则',
      '药品的包装颜色',
      '受试者的饮食',
      '药品运输温度',
    ],
    answerIndex: 0,
    explanation: 'ICH E9 是临床试验统计学原则的国际指南（随机化、盲法、分析集、样本量等），E6 则是 GCP。做统计的常把它当"圣经"。',
  },
]

/** 按日期稳定地从题库轮换抽 n 题。同一天结果一致。 */
export function pickDailyQuestions(dateISO: string, count = 3): QuizQuestion[] {
  let seed = 0
  for (const ch of dateISO) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0

  const pool = QUIZ_BANK.slice()
  // 简单确定性洗牌
  for (let i = pool.length - 1; i > 0; i -= 1) {
    seed = (seed * 1103515245 + 12345) >>> 0
    const j = seed % (i + 1)
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}
