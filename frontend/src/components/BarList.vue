<template>
  <div class="bar-list">
    <div v-for="item in items" :key="item.label" class="bar-row">
      <div class="bar-label">{{ item.label }}</div>
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: pct(item.value) + '%' }" />
      </div>
      <div class="bar-value">{{ format(item.value) }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true }, // [{ label, value }]
})

function max() {
  return Math.max(1, ...props.items.map((i) => i.value))
}

function pct(value) {
  return Math.max(4, Math.round((value / max()) * 100))
}

function format(value) {
  return Math.round(value).toLocaleString('hr-HR')
}
</script>
