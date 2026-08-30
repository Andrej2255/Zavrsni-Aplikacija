// Muscle-group visual identity: colour + gradient + icon.
// No photos — a bold coloured tile is always correct and consistent.

const MAP = {
  'Prsa':        { color: '#5E3BEE', grad: ['#6D4BFF', '#9B6BFF'], icon: 'sports_mma' },
  'Noge':        { color: '#0EA968', grad: ['#12B981', '#37D9A6'], icon: 'directions_run' },
  'Leđa':        { color: '#2563EB', grad: ['#3B82F6', '#60A5FA'], icon: 'rowing' },
  'Ramena':      { color: '#F2711C', grad: ['#FF7A2F', '#FFA34D'], icon: 'accessibility_new' },
  'Ruke':        { color: '#DB2777', grad: ['#EC4899', '#F472B6'], icon: 'sports_gymnastics' },
  'Trbušnjaci':  { color: '#D9A404', grad: ['#F59E0B', '#FBC94A'], icon: 'grid_on' },
}

const FALLBACK = { color: '#64748B', grad: ['#64748B', '#94A3B8'], icon: 'fitness_center' }

export const MUSCLE_GROUPS = Object.keys(MAP)

export function muscleGroupMeta (name) {
  return MAP[name] || FALLBACK
}

export function muscleGroupGradient (name) {
  const m = MAP[name] || FALLBACK
  return `linear-gradient(135deg, ${m.grad[0]} 0%, ${m.grad[1]} 100%)`
}
