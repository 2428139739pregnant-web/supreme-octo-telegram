import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

// 当前角色 是 record<角色名, Character>
// AI 首次遇见角色时 JSONPatch insert 到 /当前角色/${角色名}
// AI 切换互动对象时, 应修改 关注角色 字段 (不删除角色库条目)
//
// 关键: message_id 用 -1 (酒馆的"最新消息"标记) 而非 getCurrentMessageId().
//   - getCurrentMessageId() 返回的是当前**滚动位置**对应的 message,
//     用户若滚到聊天顶部会拿到 first_mes (id=0), 永远看不到新写入的 stat_data.
//   - MVU 写入 stat_data 时用的是**最新消息** (AI 回复),
//     与我们这里读的位置可能不一致, 导致 Vue 读到旧数据 (scope mismatch).
//   - 改用 -1 后, Vue 始终读最新一条 message 的 stat_data,
//     与 MVU 写入位置对齐.
export const useDataStore = defineMvuDataStore(
  Schema,
  { type: 'message', message_id: -1 },
);