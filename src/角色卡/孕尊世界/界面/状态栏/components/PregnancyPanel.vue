<template>
  <section class="panel">
    <header class="panel-header">
      <span>🤰 妊娠</span>
      <span class="field-emphasis">{{ preg.状态 || '未怀孕' }}</span>
    </header>
    <div class="panel-body">
      <dl>
        <dt>周数</dt>
        <dd class="field-emphasis">{{ preg.周数 || 0 }} 周</dd>
        <dt>胎儿数</dt>
        <dd>{{ preg.胎儿数目 || 0 }}</dd>
      </dl>

      <details v-if="preg.周数 > 0" class="collapsible" open>
        <summary>胎儿详情</summary>
        <dl>
          <dt>大小</dt>
          <dd>{{ fetus.大小 || empty }}</dd>
          <dt>物种</dt>
          <dd>{{ fetus.物种 || empty }}</dd>
          <dt>胎位</dt>
          <dd>{{ fetus.胎位 || empty }}</dd>
          <dt>动作</dt>
          <dd>{{ fetus.动作 || empty }}</dd>
          <dt>反应</dt>
          <dd>{{ fetus.反应 || empty }}</dd>
          <dt>心情</dt>
          <dd>{{ fetus.心情 || empty }}</dd>
          <dt>入盆</dt>
          <dd>{{ fetus.入盆 || empty }}</dd>
        </dl>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const preg = computed(() => store.当前角色?.妊娠 ?? {});
const fetus = computed(() => store.当前角色?.胎儿 ?? {});
const empty = '—';
</script>