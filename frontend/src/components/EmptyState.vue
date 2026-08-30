<template>
  <div class="gt-empty">
    <div class="gt-empty__icon">
      <q-icon :name="icon" size="34px" />
    </div>
    <div class="text-subtitle1 text-weight-bold text-ink">{{ title }}</div>
    <div v-if="caption" class="q-mt-xs">{{ caption }}</div>
    <div v-if="$slots.action" class="q-mt-md">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'inbox' },
  title: { type: String, required: true },
  caption: { type: String, default: '' },
})
</script>

<style scoped>
.text-ink { color: var(--gt-ink); }
</style>
