<template>
  <section class="panel">
    <header class="panel-header">
      <span>🫄 肚子</span>
      <span class="field-emphasis">{{ belly.腹围 || 0 }} cm</span>
    </header>
    <div class="panel-body">
      <!-- 签名元素: 腹围进度条 — 把抽象数字变成可视的孕肚规模感 -->
      <div class="belly-bar-wrap">
        <div class="belly-bar-label">
          <span>0 cm</span>
          <span class="field-emphasis">{{ belly.腹围 || 0 }} / 110 cm</span>
          <span>临产上限</span>
        </div>
        <div class="belly-bar-track">
          <div class="belly-bar-fill" :style="{ width: fillPercent + '%' }"></div>
          <div class="belly-bar-marker" style="left: 50%" title="孕中期"></div>
          <div class="belly-bar-marker" style="left: 80%" title="孕晚期"></div>
        </div>
      </div>

      <dl>
        <dt>类型</dt>
        <dd>{{ belly.类型 || empty }}</dd>
        <dt>大小</dt>
        <dd>{{ belly.大小描述 || empty }}</dd>
        <dt>挺翘度</dt>
        <dd>{{ belly.挺翘度 || empty }}</dd>
        <dt>柔韧性</dt>
        <dd>{{ belly.柔韧性 || empty }}</dd>
        <dt>光泽度</dt>
        <dd>{{ belly.光泽度 || empty }}</dd>
      </dl>

      <div v-if="belly.外观描述" class="field-prose">{{ belly.外观描述 }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const belly = computed(() => store.当前角色?.肚子 ?? {});
const empty = '—';

// 腹围进度条: 0~110cm 映射到 0~100%
// 110cm 对应孕足月 + 适度延产, 这是视觉上的"接近极限"提示
const FILL_MAX = 110;
const fillPercent = computed(() => {
  const w = belly.value.腹围 || 0;
  return Math.min(100, Math.max(0, (w / FILL_MAX) * 100));
});
</script>