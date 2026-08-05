/* ── Motivograma TráfegOn ──────────────────────────────────────
   Versão enxuta: ~5 min de resposta, 5 etapas.
   Espelha _agencia/conducao-equipe/motivograma.md — se mudar lá, mudar aqui.

   Cada item existe porque alimenta um indicador. Nada aqui é pergunta
   de reflexão: o que não vira decisão de escopo, carga, carreira ou
   retenção foi cortado.

   Metodologia: Autodeterminação (Deci & Ryan) · vigor/dedicação (UWES) ·
   Herzberg · Gallup Q12 · Âncoras de Carreira (Schein) · eNPS.
*/

export const RODADA_ATUAL = '2026-S2'

/* ── Blocos Likert (13 itens) ─────────────────────────────── */
export const BLOCOS = [
  {
    id: 'A',
    titulo: 'Seu trabalho',
    subtitulo: 'Seis afirmações. Responda de 1 (discordo) a 5 (concordo).',
    itens: [
      { id: 'A1', dim: 'AUT', texto: 'Tenho liberdade para decidir como faço meu trabalho.' },
      { id: 'A2', dim: 'AUT', texto: 'Minhas opiniões influenciam decisões que afetam meu dia a dia.' },
      { id: 'A3', dim: 'MAE', texto: 'Estou aprendendo coisas que me tornam melhor profissionalmente.' },
      { id: 'A4', dim: 'MAE', texto: 'Recebo desafios no tamanho certo — nem fáceis demais, nem impossíveis.' },
      { id: 'A5', dim: 'VIN', texto: 'Tenho relações de confiança com as pessoas do time.' },
      { id: 'A6', dim: 'VIN', texto: 'Posso expor um erro ou uma dúvida sem medo de retaliação.' },
    ],
  },
  {
    id: 'B',
    titulo: 'Energia, condições e liderança',
    subtitulo: 'Sete afirmações, mesma escala. Pensando nas últimas semanas.',
    itens: [
      { id: 'B1', dim: 'ENG', texto: 'Começo a semana com energia para o que tenho pela frente.' },
      { id: 'B2', dim: 'ENG', texto: 'Tenho orgulho do trabalho que faço aqui.' },
      { id: 'B2b', dim: 'ENG', texto: 'Entendo como meu trabalho se conecta ao resultado do cliente e da agência.' },
      { id: 'B3', dim: 'HIG', texto: 'Minha carga de trabalho é sustentável no ritmo atual.' },
      { id: 'B4', dim: 'HIG', texto: 'Sei exatamente o que se espera de mim.' },
      { id: 'B5', dim: 'HIG', texto: 'Considero minha remuneração justa para o que entrego.' },
      { id: 'B6', dim: 'LID', texto: 'Recebo reconhecimento e feedback útil com frequência suficiente.' },
      { id: 'B7', dim: 'LID', texto: 'Quando um cliente me trata mal, a liderança me banca.' },
    ],
  },
]

export const DIMENSOES = {
  AUT: { label: 'Autonomia',   cor: '#6eda2c' },
  MAE: { label: 'Maestria',    cor: '#22d3ee' },
  VIN: { label: 'Vínculo',     cor: '#be29ec' },
  ENG: { label: 'Engajamento', cor: '#ea8a29' },
  HIG: { label: 'Condições',   cor: '#f59e0b' },
  LID: { label: 'Liderança',   cor: '#ec4899' },
}

/* ── Matriz Importância × Presença (8 fatores) ────────────────
   Os fatores cortados (propósito, relacionamento, estabilidade,
   influência) já são medidos pelas dimensões Likert acima.        */
export const FATORES = [
  { id: 'F1', nome: 'Remuneração',    desc: 'Ganhar bem e ter previsibilidade' },
  { id: 'F2', nome: 'Aprendizado',    desc: 'Evoluir tecnicamente' },
  { id: 'F3', nome: 'Carreira',       desc: 'Subir de nível, ampliar escopo' },
  { id: 'F4', nome: 'Autonomia',      desc: 'Decidir como e quando fazer' },
  { id: 'F5', nome: 'Reconhecimento', desc: 'Ter o esforço visto e nomeado' },
  { id: 'F6', nome: 'Equilíbrio',     desc: 'Tempo e energia fora do trabalho' },
  { id: 'F7', nome: 'Desafio',        desc: 'Problema difícil, projeto novo' },
  { id: 'F8', nome: 'Flexibilidade',  desc: 'Horário e local de trabalho' },
]

/* ── Âncora de carreira (escolha 1) ───────────────────────── */
export const ANCORAS = [
  { id: 'tecnica',      nome: 'Ser a referência técnica' },
  { id: 'gestao',       nome: 'Liderar um time' },
  { id: 'autonomia',    nome: 'Ter controle do meu tempo e método' },
  { id: 'seguranca',    nome: 'Estabilidade e previsibilidade' },
  { id: 'empreendedor', nome: 'Ter algo meu / participação no negócio' },
  { id: 'desafio',      nome: 'Sempre o problema mais difícil' },
  { id: 'estilo',       nome: 'Trabalho que caiba na vida que quero' },
]

/* ── Abertas (opcionais, 2) ───────────────────────────────── */
export const ABERTAS = [
  { id: 'I1', texto: 'O que mais te drena hoje?' },
  { id: 'I2', texto: 'O que falta pra você fazer seu trabalho melhor?' },
]

/* ── Cálculo dos indicadores ──────────────────────────────── */

const media = arr => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
const r1 = n => Math.round(n * 10) / 10

export function calcularScores({ respostas, fatores, enps, h2, h3 }) {
  const todosItens = BLOCOS.flatMap(b => b.itens)
  const porDim = {}
  for (const dim of Object.keys(DIMENSOES)) {
    const vals = todosItens.filter(i => i.dim === dim).map(i => Number(respostas[i.id])).filter(Boolean)
    porDim[dim] = r1(media(vals) * 20)
  }

  const { AUT, MAE, VIN, ENG, HIG, LID } = porDim
  const ime = r1((AUT + MAE + VIN) / 3 * 0.35 + ENG * 0.25 + HIG * 0.20 + LID * 0.20)

  // Gap Motivacional Ponderado — gap pesado pela importância
  const lista = FATORES.map(f => {
    const i = Number(fatores?.[f.id]?.i) || 0
    const p = Number(fatores?.[f.id]?.p) || 0
    return { id: f.id, nome: f.nome, i, p, gap: i - p }
  })
  const somaI = lista.reduce((a, f) => a + f.i, 0)
  const gmp = somaI ? r1(lista.reduce((a, f) => a + f.gap * f.i, 0) / somaI) : 0

  // Índice de Risco de Saída
  let irs = 100 - (Number(h2) * 20 * 0.35 + LID * 0.25 + HIG * 0.20 + ENG * 0.20)
  if (h3 === true) irs += 15
  if (Number(enps) <= 6) irs += 10
  irs = r1(Math.max(0, Math.min(100, irs)))

  return { ...porDim, ime, irs, gmp, fatores: lista }
}

export function faixaIME(v) {
  if (v >= 80) return { label: 'Engajado',    cor: '#6eda2c', emoji: '🟢' }
  if (v >= 65) return { label: 'Estável',     cor: '#a3b81a', emoji: '🟡' }
  if (v >= 50) return { label: 'Em desgaste', cor: '#ea8a29', emoji: '🟠' }
  return         { label: 'Crítico',     cor: '#ef4444', emoji: '🔴' }
}

export function faixaIRS(v) {
  if (v < 25) return { label: 'Risco baixo',    cor: '#6eda2c', emoji: '🟢', acao: 'Cadência normal' }
  if (v < 45) return { label: 'Atenção',        cor: '#a3b81a', emoji: '🟡', acao: 'Endereçar o maior gap no próximo 1:1' }
  if (v < 65) return { label: 'Risco alto',     cor: '#ea8a29', emoji: '🟠', acao: 'Plano de retenção escrito em 15 dias' }
  return        { label: 'Risco iminente', cor: '#ef4444', emoji: '🔴', acao: 'Conversa de retenção em 7 dias + plano de sucessão' }
}

export function quadrante(f) {
  if (f.i >= 4 && f.p <= 3) return { id: 'agir',        label: 'Agir já',     cor: '#ef4444' }
  if (f.i >= 4 && f.p >= 4) return { id: 'proteger',    label: 'Proteger',    cor: '#6eda2c' }
  if (f.i <= 3 && f.p >= 4) return { id: 'desperdicio', label: 'Desperdício', cor: '#ea8a29' }
  return                     { id: 'ignorar',     label: 'Ignorar',     cor: '#7680a8' }
}

/* Motor dominante = maior entre autonomia, maestria e vínculo */
export function motorDominante(s) {
  const cand = [['Autonomia', s.AUT], ['Maestria', s.MAE], ['Vínculo', s.VIN]]
  return cand.sort((a, b) => b[1] - a[1])[0][0]
}

export const ALAVANCA_POR_MOTOR = {
  Autonomia: { funciona: 'Dar dono de conta, tirar aprovação intermediária', evitar: 'Microgerenciar "para ajudar"' },
  Maestria:  { funciona: 'Caso difícil, treinamento, ser a referência de um tema', evitar: 'Volume repetitivo de conta fácil' },
  Vínculo:   { funciona: 'Trabalho em dupla, papel no time, rituais', evitar: 'Isolar em projeto solo' },
}

/* Itens obrigatórios: 13 Likert + 8 fatores × 2 + âncora + 3 de permanência */
export const TOTAL_ITENS = BLOCOS.flatMap(b => b.itens).length + FATORES.length * 2 + 1 + 3
