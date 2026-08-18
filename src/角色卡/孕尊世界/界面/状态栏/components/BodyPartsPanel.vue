<template>
  <section class="panel">
    <header class="panel-header">
      <span>💋 身体 & 心理</span>
    </header>
    <div class="panel-body">
      <details v-if="hasBodyParts" class="collapsible">
        <summary>性器官状态</summary>
        <dl>
          <template v-for="(desc, name) in bodyParts" :key="name">
            <dt>{{ name }}</dt>
            <dd v-if="desc" class="field-prose">{{ desc }}</dd>
            <dd v-else class="field-empty">—</dd>
          </template>
        </dl>
      </details>

      <details v-if="char.对肚子的想法 || hasBodyParts" class="collapsible" open>
        <summary>对肚子的想法</summary>
        <div v-if="char.对肚子的想法" class="field-prose">{{ char.对肚子的想法 }}</div>
        <div v-else class="field-empty">暂无</div>
      </details>

      <div v-if="!hasBodyParts && !char.对肚子的想法" class="field-empty">
        暂无身体状态记录
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const char = computed(() => store.当前角色 ?? {});

const bodyParts = computed(() => {
  const o = char.value.性器官 ?? {};
  return {
    胸部: o.胸部状态,
    臀部: o.臀部状态,
    小穴: o.小穴状态,
    后穴: o.后穴状态,
  } as Record<string, string>;
});

const hasBodyParts = computed(() => Object.values(bodyParts.value).some(v => v && v.trim()));
</script>