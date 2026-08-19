import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

// 当前角色 是 record<角色名, Character>
// AI 首次遇见角色时 JSONPatch insert 到 /当前角色/${角色名}
// AI 切换互动对象时, 应修改 关注角色 字段 (不删除角色库条目)
export const useDataStore = defineMvuDataStore(
  Schema,
  { type: 'message', message_id: getCurrentMessageId() },
);