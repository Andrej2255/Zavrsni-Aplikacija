export function formatDate(value, opts = {}) {
  const d = new Date(value)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  if (opts.short) return `${day}.${month}.`
  return `${day}.${month}.${d.getFullYear()}.`
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}
