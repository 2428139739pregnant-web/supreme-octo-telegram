import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

// 当前角色字段存在与否表示"是否有正在互动的孕妇"
// 切换互动对象时, AI 应删除/替换 当前角色 整个对象
export const useDataStore = defineMvuDataStore(
  Schema,
  { type: 'message', message_id: getCurrentMessageId() },
  data => {
    // 初始化时若 当前角色 缺失, 设置占位 (AI 在首次遇见时替换为真实角色)
    if (!data.value.当前角色 || Object.keys(data.value.当前角色).length === 0) {
      data.value.当前角色 = {
        名字: '未设定',
        身份: '未知',
      } as any;
    }
  },
);