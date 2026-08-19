<template>
  <section class="panel">
    <header class="panel-header">
      <span>🌐 世界</span>
      <span class="field-dim">{{ world.当前时间 || '—' }}</span>
    </header>
    <div class="panel-body">
      <dl>
        <dt>地点</dt>
        <dd>{{ world.当前地点 || empty }}</dd>
        <dt>国家</dt>
        <dd>{{ world.国家 || empty }}</dd>
        <dt>天气</dt>
        <dd>{{ world.天气 || empty }}</dd>
      </dl>
      <div v-if="world.周边环境" class="field-prose">{{ world.周边环境 }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
// defineMvuDataStore 的返回值是 { data: {...}, ... }, 世界 字段在 .data 下
const world = computed(() => store.data?.世界 ?? {});
const empty = '—';
</script>