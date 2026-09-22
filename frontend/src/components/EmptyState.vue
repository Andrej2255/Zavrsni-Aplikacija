<template>
  <div class="empty-state">
    <div class="title">{{ title }}</div>
    <div v-if="caption" class="caption">{{ caption }}</div>
    <div v-if="$slots.action" class="action"><slot name="action" /></div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  caption: { type: String, default: '' },
})
</script>
