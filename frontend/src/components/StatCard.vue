<template>
  <div class="stat-card" :class="`tone-${tone}`">
    <div class="value">{{ value }}</div>
    <div class="label">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: { type: [String, Number], default: 0 },
  label: { type: String, default: '' },
  tone: { type: String, default: 'violet' },
})
</script>
