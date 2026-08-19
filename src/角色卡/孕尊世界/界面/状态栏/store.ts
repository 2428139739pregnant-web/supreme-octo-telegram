import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

// 当前角色 是 record<角色名, Character>
// AI 首次遇见角色时 JSONPatch insert 到 /当前角色/${角色名}
// AI 切换互动对象时, 应修改 关注角色 字段 (不删除角色库条目)
//
// message_id 使用 getCurrentMessageId() 与示例保持一致:
// Vue 应用由 <StatusPlaceHolderImpl/> 触发的 jQuery load 加载,
// 加载瞬间 getCurrentMessageId() 返回当前 AI 消息 id, 与 MVU 写入位置一致
export const useDataStore = defineMvuDataStore(
  Schema,
  { type: 'message', message_id: getCurrentMessageId() },
);