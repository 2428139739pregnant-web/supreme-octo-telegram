<template>
  <div class="status-container">
    <h2 class="status-title">孕尊世界 · 状态栏</h2>

    <!-- 降级面板: store 初始化失败时显示 -->
    <div v-if="bootError" class="error-panel">
      <h3>⚠️ 状态栏加载失败</h3>
      <p>{{ bootError }}</p>
      <p class="error-hint">
        可能原因: <br />
        1. <code>stat_data</code> 与 schema 不匹配 (旧数据残留, 请点击「[initvar]变量初始化勿开」重新初始化)<br />
        2. Vue app 读取的 message_id 与 MVU 写入位置不一致
      </p>
    </div>

    <WorldPanel v-if="store" />

    <div v-if="store && characters.length === 0" class="empty-hint">
      <em>暂未遇见任何孕妇角色 — AI 首次遇见 NPC 时会插入到 当前角色 记录中</em>
    </div>

    <div
      v-for="name in characters"
      :key="name"
      class="character-group"
      :class="{ 'character-focus': name === focus }"
    >
      <header class="character-header">
        <span class="character-name">👩 {{ name }}</span>
        <span v-if="name === focus" class="focus-badge">关注中</span>
        <span v-else class="focus-dim">未关注</span>
      </header>

      <CharacterPanel :char="charOf(name)" />
      <PregnancyPanel :char="charOf(name)" />
      <BellyPanel :char="charOf(name)" />
      <OrganPanel :char="charOf(name)" />
      <BodyPartsPanel :char="charOf(name)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from './store';
import WorldPanel from './components/WorldPanel.vue';
import CharacterPanel from './components/CharacterPanel.vue';
import PregnancyPanel from './components/PregnancyPanel.vue';
import BellyPanel from './components/BellyPanel.vue';
import OrganPanel from './components/OrganPanel.vue';
import BodyPartsPanel from './components/BodyPartsPanel.vue';

// 包装 store 调用, 失败时不让整个 Vue setup 崩溃
const store = ref<ReturnType<typeof useDataStore> | null>(null);
const bootError = ref<string>('');

try {
  store.value = useDataStore();
  // eslint-disable-next-line no-console
  console.log('[孕尊世界状态栏] store 初始化成功', {
    has世界: !!store.value?.data?.世界,
    has当前角色: !!store.value?.data?.当前角色,
    当前角色keys: Object.keys(store.value?.data?.当前角色 ?? {}),
    关注角色: store.value?.data?.关注角色,
  });
} catch (err: any) {
  bootError.value = String(err?.message ?? err);
  // eslint-disable-next-line no-console
  console.error('[孕尊世界状态栏] store 初始化失败', err);
}

// 角色列表 — 按 JSONPatch 插入顺序排列
// 注意: defineMvuDataStore 的返回值是 { data: {...}, ... }, 所有 schema 字段都在 .data 下
const characters = computed(() =>
  store.value ? Object.keys(store.value.data?.当前角色 ?? {}) : []
);

// 当前关注角色 (用于 UI 高亮)
const focus = computed(() => store.value?.data?.关注角色 ?? '');

// 取指定角色的完整对象 (交给各子面板渲染)
function charOf(name: string) {
  return store.value?.data?.当前角色?.[name] ?? {};
}
</script>