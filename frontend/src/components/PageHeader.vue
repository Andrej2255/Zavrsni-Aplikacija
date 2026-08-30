<template>
  <div class="row items-end q-mb-lg gt-page-header">
    <div class="col">
      <div v-if="eyebrow" class="gt-eyebrow">
        <span class="gt-eyebrow__dot" />{{ eyebrow.toUpperCase() }}
      </div>
      <div class="text-h4 gt-title">{{ title }}</div>
      <div v-if="subtitle" class="gt-muted q-mt-xs">{{ subtitle }}</div>
    </div>
    <div class="col-auto">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
})
</script>

<style scoped>
.gt-page-header { gap: 12px; }
.gt-title {
  font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2.05rem);
  display: inline-block;
  padding-bottom: 8px;
  background: linear-gradient(90deg, var(--gt-primary), var(--gt-primary)) no-repeat left bottom;
  background-size: 56px 4px;
}
.gt-eyebrow {
  display: flex; align-items: center; gap: 7px;
  font-size: .72rem; font-weight: 800; letter-spacing: .1em;
  color: var(--gt-primary); margin-bottom: 6px;
}
.gt-eyebrow__dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--gt-brand-gradient);
}
</style>
