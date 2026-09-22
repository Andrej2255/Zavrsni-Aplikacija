// Boja po mišićnoj skupini — koristi se za filtere i naljepnice na vježbama.
const COLORS = {
  Prsa: '#5e3bee',
  Noge: '#0ea968',
  Leđa: '#2563eb',
  Ramena: '#e0692a',
  Ruke: '#db2777',
  Trbušnjaci: '#c99a04',
}

const FALLBACK = '#64748b'

export const MUSCLE_GROUPS = Object.keys(COLORS)

export function muscleGroupColor(name) {
  return COLORS[name] || FALLBACK
}
