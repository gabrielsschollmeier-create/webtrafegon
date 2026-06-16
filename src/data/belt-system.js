// Escala: 1/2/3 ons por tarefa · tenure 15 ons/mês · ~200 ons/mês membro ativo
// Base: 100 ons/2 semanas → ~200 ons/mês → 1.200 ons em 6 meses, 12.000 em 60 meses
export const BELTS = [
  { id: 'branca', label: 'Branca', color: '#94a3b8', textColor: '#1e293b',
    xpMin: 0,     monthsMin: 0,  grauXp: [300, 600, 900, 1200] },
  { id: 'azul',   label: 'Azul',   color: '#3b82f6', textColor: '#ffffff',
    xpMin: 1200,  monthsMin: 6,  grauXp: [1700, 2300, 2900, 3500] },
  { id: 'roxa',   label: 'Roxa',   color: '#7c3aed', textColor: '#ffffff',
    xpMin: 3500,  monthsMin: 18, grauXp: [4500, 5500, 6500, 7500] },
  { id: 'marrom', label: 'Marrom', color: '#92400e', textColor: '#ffffff',
    xpMin: 7500,  monthsMin: 36, grauXp: [8600, 9700, 10800, 12000] },
  { id: 'preta',  label: 'Preta',  color: '#0f172a', textColor: '#e2e8f0',
    xpMin: 12000, monthsMin: 60, grauXp: [15000, 19000, 24000, 30000] },
]

export function getBeltInfo(xp, months, perfPct = 100, beltFloor = 'branca', grauFloor = 0) {
  const perfMult = perfPct >= 95 ? 0.6 : perfPct >= 85 ? 0.75 : 1.0

  let computedIdx = 0
  for (let i = 0; i < BELTS.length; i++) {
    const b = BELTS[i]
    if (xp >= b.xpMin && months >= Math.round(b.monthsMin * perfMult)) computedIdx = i
  }

  const floorIdx = BELTS.findIndex(b => b.id === beltFloor)
  const finalIdx = Math.max(computedIdx, floorIdx >= 0 ? floorIdx : 0)
  const belt     = BELTS[finalIdx]
  const isFloor  = finalIdx > computedIdx

  let grau = 0
  for (const t of belt.grauXp) { if (xp >= t) grau++ }
  if (isFloor) grau = Math.max(grau, grauFloor ?? 0)

  const grauStart = grau === 0 ? belt.xpMin : belt.grauXp[grau - 1]
  const nextBelt  = BELTS[finalIdx + 1] || null
  const grauEnd   = grau < belt.grauXp.length
    ? belt.grauXp[grau]
    : nextBelt?.xpMin ?? belt.grauXp[belt.grauXp.length - 1] + 2000
  const xpInGrau  = Math.max(0, xp - grauStart)
  const grauSpan  = Math.max(1, grauEnd - grauStart)

  const xpNeeded  = nextBelt ? Math.max(0, nextBelt.xpMin - xp) : 0
  const mthsNeeded = nextBelt ? Math.max(0, Math.round(nextBelt.monthsMin * perfMult) - months) : 0

  return {
    belt, grau,
    xpInGrau, grauSpan, grauStart, grauEnd,
    nextBelt, xpNeeded, mthsNeeded,
    canAdvance: nextBelt && xpNeeded === 0 && mthsNeeded === 0,
  }
}
