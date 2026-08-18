<template>
  <div class="status-container">
    <h2 class="status-title">孕尊世界 · 状态栏</h2>

    <WorldPanel />
    <CharacterPanel />
    <PregnancyPanel />
    <BellyPanel />
    <OrganPanel />
    <BodyPartsPanel />
  </div>
</template>

<script setup lang="ts">
import WorldPanel from './components/WorldPanel.vue';
import CharacterPanel from './components/CharacterPanel.vue';
import PregnancyPanel from './components/PregnancyPanel.vue';
import BellyPanel from './components/BellyPanel.vue';
import OrganPanel from './components/OrganPanel.vue';
import BodyPartsPanel from './components/BodyPartsPanel.vue';
</script>