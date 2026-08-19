<template>
  <section class="panel">
    <header class="panel-header">
      <span>👤 基础信息</span>
      <span class="field-emphasis">{{ char.名字 || '未设定' }}</span>
    </header>
    <div class="panel-body">
      <dl>
        <dt>身份</dt>
        <dd class="field-emphasis">{{ char.身份 || empty }}</dd>
        <dt>年龄</dt>
        <dd>{{ char.年龄 }} 岁</dd>
        <dt>身高</dt>
        <dd>{{ char.身高 }} cm</dd>
        <dt>体重</dt>
        <dd>{{ char.体重 }} kg</dd>
        <dt>三围 (B/W/H)</dt>
        <dd>
          <span class="field-emphasis">{{ char.三围?.Bust }}</span>
          /
          <span class="field-emphasis">{{ char.三围?.Waist }}</span>
          /
          <span>{{ char.三围?.Hips }}</span>
        </dd>
        <dt>健康</dt>
        <dd>{{ char.健康状况 || empty }}</dd>
        <dt>性经验</dt>
        <dd>{{ char.性经验 || empty }}</dd>
      </dl>
      <div v-if="char.当前行动" class="field-prose">→ {{ char.当前行动 }}</div>

      <details v-if="hasDress" class="collapsible">
        <summary>着装 ({{ dressCount }} 项)</summary>
        <ul class="dress-list">
          <li v-for="(desc, part) in char.着装" :key="part">
            <span class="dress-part">{{ part }}</span>
            <span>{{ desc }}</span>
          </li>
        </ul>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ char: any }>();

const empty = '—';

const hasDress = computed(() => {
  const d = props.char?.着装;
  return d && typeof d === 'object' && Object.keys(d).length > 0;
});
const dressCount = computed(() => Object.keys(props.char?.着装 ?? {}).length);
</script>