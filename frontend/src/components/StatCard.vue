<template>
  <div class="gt-stat" :style="{ background: gradient }">
    <div class="gt-stat__icon">
      <q-icon :name="icon" size="22px" />
    </div>
    <div class="gt-stat__value">{{ value }}</div>
    <div class="gt-stat__label">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const GRADS = {
  violet:  'linear-gradient(135deg, #6D4BFF 0%, #A855F7 100%)',
  emerald: 'linear-gradient(135deg, #12B981 0%, #37D9A6 100%)',
  blue:    'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
  orange:  'linear-gradient(135deg, #FF7A2F 0%, #FFB057 100%)',
  pink:    'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
}

const props = defineProps({
  icon: { type: String, default: 'insights' },
  value: { type: [String, Number], default: '0' },
  label: { type: String, default: '' },
  tone: { type: String, default: 'violet' },
})

const gradient = computed(() => GRADS[props.tone] || GRADS.violet)
</script>
