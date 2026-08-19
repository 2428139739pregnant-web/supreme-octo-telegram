<template>
  <div class="status-container">
    <h2 class="status-title">孕尊世界 · 状态栏</h2>

    <WorldPanel />

    <div v-if="characters.length === 0" class="empty-hint">
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
import { computed } from 'vue';
import { useDataStore } from './store';
import WorldPanel from './components/WorldPanel.vue';
import CharacterPanel from './components/CharacterPanel.vue';
import PregnancyPanel from './components/PregnancyPanel.vue';
import BellyPanel from './components/BellyPanel.vue';
import OrganPanel from './components/OrganPanel.vue';
import BodyPartsPanel from './components/BodyPartsPanel.vue';

const store = useDataStore();

// 角色列表 — 按 JSONPatch 插入顺序排列
const characters = computed(() => Object.keys(store.当前角色 ?? {}));

// 当前关注角色 (用于 UI 高亮)
const focus = computed(() => store.关注角色);

// 取指定角色的完整对象 (交给各子面板渲染)
function charOf(name: string) {
  return store.当前角色?.[name] ?? {};
}
</script>