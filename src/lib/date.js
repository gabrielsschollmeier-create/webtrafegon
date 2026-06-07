// Retorna a data de hoje no fuso local (evita problema UTC vs BRT)
export function hoje() {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD no fuso local
}

// Retorna data futura em N dias, no fuso local
export function daqui(dias) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d.toLocaleDateString('en-CA')
}
