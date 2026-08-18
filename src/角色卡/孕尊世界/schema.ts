// schema.ts
// 孕尊世界 MVU 角色卡的变量结构定义
// 根级: { 世界, 当前角色 }
//   - 世界: 当前时间/地点/国家/天气/环境
//   - 当前角色: 玩家当前互动的那位孕妇（追踪所有身体状态, 因为本卡是"世界观设定卡"而非单一 NPC）
// 设计原则:
//   1. Schema.parse(Schema.parse(input)) === Schema.parse(input) —— 幂等
//   2. z.coerce.number() 优于 z.number()
//   3. z.record(动态key, value) 优于 z.array
//   4. z.prefault 优于 z.default
//   5. 禁 z.passthrough / z.strict
//   6. 字段命名遵循既有混球的xp 世界书的 {{key}} 占位符

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string().describe('YYYY-MM-DD HH:MM'),
    当前地点: z.string(),
    国家: z.string(),
    天气: z.string(),
    周边环境: z.string(),
  }),

  当前角色: z.object({
    // === 基础信息 ===
    名字: z.string().prefault('未知'),
    身份: z.string().prefault('普通孕妇'), // 特权孕妇/指标孕妇/年轻孕妇/边缘年轻孕妇/核心年轻孕妇/普通孕妇 等
    年龄: z.coerce.number().prefault(25),
    身高: z.coerce.number().prefault(165), // cm
    体重: z.coerce.number().prefault(55), // kg
    健康状况: z.string().prefault('健康'),

    // === 三围 (孕中期后 Waist 必须 > Bust 且 > Hips, 由 AI 在更新规则维护) ===
    三围: z
      .object({
        Bust: z.coerce.number(),
        Waist: z.coerce.number(),
        Hips: z.coerce.number(),
      })
      .prefault({ Bust: 85, Waist: 70, Hips: 88 }),

    // === 着装 (key 为部位, value 为详细描述) ===
    着装: z
      .record(z.string().describe('服装部位'), z.string().describe('服装描述'))
      .prefault({}),

    // === 性相关 ===
    性经验: z.string().prefault('无'),
    当前行动: z.string().prefault(''),

    // === 妊娠 ===
    妊娠: z
      .object({
        状态: z.string().prefault('未怀孕'), // 例 "10周-孕早期" "20周-孕中期"
        周数: z.coerce.number().prefault(0),
        胎儿数目: z.coerce.number().prefault(0),
      })
      .prefault({}),

    // === 胎儿 (妊娠时才填充) ===
    胎儿: z
      .object({
        大小: z.string().prefault('适中'),
        物种: z.string().prefault('人类'),
        胎位: z.string().prefault(''), // 头位/臀位/横位/纠缠
        动作: z.string().prefault(''), // 活泼好动/安静睡觉/踢打子宫
        反应: z.string().prefault(''), // 因外部刺激的反应
        心情: z.string().prefault(''), // 好/差/饥饿/满足
        入盆: z.string().prefault('还未入盆'), // 未入盆/开始入盆/完全入盆
      })
      .prefault({}),

    // === 肚子属性 (5 个独立维度) ===
    肚子: z
      .object({
        外观描述: z.string().prefault(''), // 综合 (来自 肚子状态 条目)
        类型: z.string().prefault(''), // 椭圆型/水滴型/球型
        大小描述: z.string().prefault(''), // 如 "直径~30cm, 相当于西瓜"
        腹围: z.coerce.number().prefault(0), // cm
        挺翘度: z.string().prefault(''), // 上凸/下凸/平缓
        柔韧性: z.string().prefault(''), // 柔软/紧绷/坚硬
        光泽度: z.string().prefault(''), // 油光/粉嫩/白净/潮红/暗沉
      })
      .prefault({}),

    // === 器官 ===
    器官: z
      .object({
        子宫: z.string().prefault(''),
        羊膜: z.string().prefault(''), // 羊膜厚度
        胃部: z.string().prefault(''),
        膀胱: z.string().prefault(''),
        肠子: z.string().prefault(''),
      })
      .prefault({}),

    // === 性器官 ===
    性器官: z
      .object({
        胸部状态: z.string().prefault(''),
        臀部状态: z.string().prefault(''),
        小穴状态: z.string().prefault(''),
        后穴状态: z.string().prefault(''),
      })
      .prefault({}),
  }),
});
export type Schema = z.output<typeof Schema>;