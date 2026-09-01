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

/**
 * 数值字段: coerce + clamp 到合法区间。
 *
 * 用 transform+clamp 而不是 .min()/.max(): 后者在越界时抛错, 会让整条 JSONPatch
 * 更新被丢弃; clamp 则降级为边界值, 保住同批次其他字段的更新。
 * 区间取自 世界书/变量/变量更新规则.yaml 的 range 声明。
 */
const clamped = (min: number, max: number, fallback: number) =>
  z.coerce
    .number()
    .transform(n => (Number.isFinite(n) ? _.clamp(n, min, max) : fallback))
    .prefault(fallback);

const Character = z.object({
  // === 基础信息 ===
  名字: z.string().prefault('未知'),
  身份: z.string().prefault('普通孕妇'), // 特权孕妇/指标孕妇/年轻孕妇/边缘年轻孕妇/核心年轻孕妇/普通孕妇 等
  年龄: clamped(18, 80, 25),
  身高: clamped(140, 200, 165), // cm
  体重: clamped(30, 150, 55), // kg
  健康状况: z.string().prefault('健康'),

  // === 三围 (cm, 整数; 孕中期后 Waist 应大于 Bust/Hips) ===
  三围: z
    .object({
      Bust: clamped(50, 200, 85),
      Waist: clamped(40, 250, 70),
      Hips: clamped(50, 200, 88),
    })
    .prefault({}),

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
      状态: z.string().prefault('未怀孕'), // 未怀孕 / X周-孕早期 / 孕中期 / 孕晚期 / 临产 / 过产期
      周数: clamped(0, 45, 0),
      胎儿数目: clamped(0, 10, 0),
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
      腹围: clamped(0, 250, 0), // cm, 与 三围.Waist 协调
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
  // === 世界: 外层加 .prefault({}) 避免 stat_data 完全缺失时整个抛错 ===
  // (内层字段各自的 .prefault('—') 仍然生效, 即便 stat_data 有 世界={} 也能正常显示)
  世界: z
    .object({
      当前时间: z.string().prefault('—').describe('YYYY-MM-DD HH:MM'),
      当前地点: z.string().prefault('—'),
      国家: z.string().prefault('—'),
      天气: z.string().prefault('—'),
      周边环境: z.string().prefault('—'),
    })
    .prefault({}),

  // === 多个互动中的角色 (key = 角色名) ===
  当前角色: z
    .record(z.string().describe('角色名 (与 JSONPatch 路径一致)'), Character)
    .prefault({}),

  // === 当前玩家最关注的角色名 (用于高亮 / 单一视角) ===
  关注角色: z.string().prefault(''),
});
export type Schema = z.output<typeof Schema>;