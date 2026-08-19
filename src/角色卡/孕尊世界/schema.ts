// schema.ts
// 孕尊世界 MVU 角色卡的变量结构定义
// 根级: { 世界, 当前角色(多角色记录), 关注角色 }
//   - 世界: 当前时间/地点/国家/天气/环境
//   - 当前角色: 玩家当前互动过的所有孕妇, key = 角色名, value = 角色身体状态对象
//   - 关注角色: 当前玩家最关注的角色名 (用于状态栏高亮 / 单一角色视角的脚本)
// 设计原则:
//   1. Schema.parse(Schema.parse(input)) === Schema.parse(input) —— 幂等
//   2. z.coerce.number() 优于 z.number()
//   3. z.record(动态key, value) 优于 z.array
//   4. z.prefault 优于 z.default
//   5. 禁 z.passthrough / z.strict
//   6. 字段命名遵循既有混球的xp 世界书的 {{key}} 占位符

const Character = z.object({
  // === 基础信息 ===
  名字: z.string().prefault('未知'),
  身份: z.string().prefault('普通孕妇'), // 特权孕妇/指标孕妇/年轻孕妇/边缘年轻孕妇/核心年轻孕妇/普通孕妇 等
  年龄: z.coerce.number().prefault(25),
  身高: z.coerce.number().prefault(165), // cm
  体重: z.coerce.number().prefault(55), // kg
  健康状况: z.string().prefault('健康'),

  // === 三围 ===
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
      状态: z.string().prefault('未怀孕'),
      周数: z.coerce.number().prefault(0),
      胎儿数目: z.coerce.number().prefault(0),
    })
    .prefault({}),

  // === 胎儿 ===
  胎儿: z
    .object({
      大小: z.string().prefault('适中'),
      物种: z.string().prefault('人类'),
      胎位: z.string().prefault(''),
      动作: z.string().prefault(''),
      反应: z.string().prefault(''),
      心情: z.string().prefault(''),
      入盆: z.string().prefault('还未入盆'),
    })
    .prefault({}),

  // === 肚子属性 ===
  肚子: z
    .object({
      外观描述: z.string().prefault(''),
      类型: z.string().prefault(''),
      大小描述: z.string().prefault(''),
      腹围: z.coerce.number().prefault(0),
      挺翘度: z.string().prefault(''),
      柔韧性: z.string().prefault(''),
      光泽度: z.string().prefault(''),
    })
    .prefault({}),

  // === 器官 ===
  器官: z
    .object({
      子宫: z.string().prefault(''),
      羊膜: z.string().prefault(''),
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

  // === 心理 (对肚子的想法等) ===
  对肚子的想法: z.string().prefault(''),
});

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string().describe('YYYY-MM-DD HH:MM'),
    当前地点: z.string(),
    国家: z.string(),
    天气: z.string(),
    周边环境: z.string(),
  }),

  // === 多个互动中的角色 (key = 角色名) ===
  当前角色: z
    .record(z.string().describe('角色名 (与 JSONPatch 路径一致)'), Character)
    .prefault({}),

  // === 当前玩家最关注的角色名 (用于高亮 / 单一视角) ===
  关注角色: z.string().prefault(''),
});
export type Schema = z.output<typeof Schema>;