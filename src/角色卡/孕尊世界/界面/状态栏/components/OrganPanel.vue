<template>
  <section class="panel">
    <header class="panel-header">
      <span>🫀 器官</span>
      <span class="field-dim">子宫 · 胃 · 膀胱 · 肠 · 羊膜</span>
    </header>
    <div class="panel-body">
      <dl v-if="hasAnyProse">
        <template v-for="(desc, name) in proseFields" :key="name">
          <dt>{{ name }}</dt>
          <dd class="field-prose">{{ desc }}</dd>
        </template>
      </dl>
      <div v-else class="field-empty">暂无器官状态记录</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ char: any }>();

const organ = computed(() => props.char?.器官 ?? {});

const proseFields = computed(() => {
  const o = organ.value;
  return {
    子宫: o.子宫,
    羊膜: o.羊膜,
    胃部: o.胃部,
    膀胱: o.膀胱,
    肠子: o.肠子,
  } as Record<string, string>;
});

const hasAnyProse = computed(() => Object.values(proseFields.value).some(v => v && v.trim()));
</script>