// Escala: 1/2/3 ons por tarefa · tenure 15 ons/mês · ~55 ons/mês membro ativo
// Branca→Azul: ~6 meses consistente · Preta: ~5 anos
export const BELTS = [
  { id: 'branca', label: 'Branca', color: '#94a3b8', textColor: '#1e293b',
    xpMin: 0,    monthsMin: 0,  grauXp: [25, 60, 110, 180] },
  { id: 'azul',   label: 'Azul',   color: '#3b82f6', textColor: '#ffffff',
    xpMin: 180,  monthsMin: 6,  grauXp: [260, 360, 460, 600] },
  { id: 'roxa',   label: 'Roxa',   color: '#7c3aed', textColor: '#ffffff',
    xpMin: 600,  monthsMin: 18, grauXp: [750, 920, 1100, 1300] },
  { id: 'marrom', label: 'Marrom', color: '#92400e', textColor: '#ffffff',
    xpMin: 1300, monthsMin: 36, grauXp: [1500, 1700, 1900, 2200] },
  { id: 'preta',  label: 'Preta',  color: '#0f172a', textColor: '#e2e8f0',
    xpMin: 2200, monthsMin: 60, grauXp: [2800, 3600, 4600, 6000] },
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
