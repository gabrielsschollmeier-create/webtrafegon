export const NIVEIS = {
  critico:      { rotulo: 'Crítico',      cor: '#ef4444', ordem: 0 },
  atencao:      { rotulo: 'Atenção',      cor: '#ea8a29', ordem: 1 },
  oportunidade: { rotulo: 'Oportunidade', cor: '#3b82f6', ordem: 2 },
  positivo:     { rotulo: 'Positivo',     cor: '#5bc424', ordem: 3 },
}

export const brl = v => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: v >= 1000 ? 0 : 2 })
export const num = v => (v || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
export const pct = v => `${Math.round((v || 0) * 100)}%`

export const cpa = m => (m.conversoes > 0 ? m.custo / m.conversoes : null)
export const ctr = m => (m.impressoes > 0 ? m.cliques / m.impressoes : null)

// Variação relativa; null quando a base é pequena demais para comparar.
export function variacao(atual, anterior) {
  if (atual == null || anterior == null || anterior === 0) return null
  return (atual - anterior) / anterior
}

// Mais da metade dos cliques virando conversão não é lead real: é evento contado errado
// (visualização de página, duplicidade). Essas contas ficam fora do custo por conversão da carteira.
export function conversaoInflada(m) {
  return m.conversoes >= 20 && m.cliques > 0 && m.conversoes / m.cliques > 0.5
}

// Conversões que se multiplicam muito acima dos cliques costumam ser uma ação de conversão
// nova contando o evento errado, mesmo sem passar de 50% dos cliques.
export function saltoSuspeito(a, b) {
  const taxa = m => (m.cliques > 0 ? m.conversoes / m.cliques : 0)
  return b.cliques >= 100 && a.conversoes >= 50 && a.conversoes > 5 * Math.max(b.conversoes, 1) && taxa(a) > 3 * Math.max(taxa(b), 0.001)
}

export function contaInflada(conta) {
  return !conta.erro && (conversaoInflada(conta.atual) || conversaoInflada(conta.anterior) || saltoSuspeito(conta.atual, conta.anterior))
}

export function semInvestimento(conta) {
  return !conta.erro && conta.atual.custo === 0 && conta.anterior.custo === 0
}

export function insightsDaConta(conta) {
  if (conta.erro) {
    return [{ nivel: 'critico', titulo: 'Não foi possível ler a conta', texto: conta.erro }]
  }
  if (semInvestimento(conta)) return []

  const a = conta.atual, b = conta.anterior
  const cpaA = cpa(a), cpaB = cpa(b)
  const lista = []

  if (a.custo >= 150 && a.conversoes === 0) {
    lista.push({
      nivel: 'critico',
      titulo: 'Investindo sem converter',
      texto: `${brl(a.custo)} investidos e nenhuma conversão registrada. Confira se a conversão está configurada e disparando; se estiver, revise termos de pesquisa e anúncios.`,
    })
  }

  if (b.custo >= 100 && a.custo < b.custo * 0.2) {
    lista.push({
      nivel: 'critico',
      titulo: 'A conta praticamente parou de investir',
      texto: `O investimento caiu de ${brl(b.custo)} para ${brl(a.custo)}. Verifique pagamento, campanhas pausadas e anúncios reprovados.`,
    })
  }

  const salto = saltoSuspeito(a, b)
  if (conversaoInflada(a) || salto) {
    lista.push({
      nivel: 'atencao',
      titulo: 'Conversão possivelmente inflada',
      texto: (salto
        ? `As conversões saltaram de ${num(b.conversoes)} para ${num(a.conversoes)}, enquanto os cliques foram de ${num(b.cliques)} para ${num(a.cliques)}.`
        : `${num(a.conversoes)} conversões para ${num(a.cliques)} cliques.`) +
        ` Custo por conversão de ${brl(cpaA)}. Alguma ação de conversão deve estar contando visualização de página ou duplicando eventos, o que distorce os números e os lances automáticos.`,
    })
  } else if (conversaoInflada(b)) {
    lista.push({
      nivel: 'atencao',
      titulo: 'Comparação com o período anterior não é confiável',
      texto: `No período anterior havia ${num(b.conversoes)} conversões para ${num(b.cliques)} cliques, sinal de conversão inflada. Hoje são ${num(a.conversoes)} conversões a ${brl(cpaA)} cada; use esse número como referência.`,
    })
  }

  const comparavel = !contaInflada(conta)

  if (comparavel && a.conversoes >= 3 && b.conversoes >= 3 && cpaA > cpaB * 1.3) {
    lista.push({
      nivel: 'atencao',
      titulo: 'Custo por conversão subiu',
      texto: `Passou de ${brl(cpaB)} para ${brl(cpaA)} (+${pct(variacao(cpaA, cpaB))}) em relação ao período anterior.`,
    })
  }

  if (comparavel && b.conversoes >= 5 && a.conversoes < b.conversoes * 0.7) {
    lista.push({
      nivel: 'atencao',
      titulo: 'Conversões caíram',
      texto: `De ${num(b.conversoes)} para ${num(a.conversoes)} (${pct(variacao(a.conversoes, b.conversoes))}).`,
    })
  }

  for (const c of conta.campanhas) {
    const cpaC = cpa(c)

    if (a.conversoes > 0 && c.conversoes === 0 && c.custo >= Math.max(100, 2 * (cpaA || 0))) {
      lista.push({
        nivel: 'atencao',
        titulo: 'Campanha sem conversão',
        texto: `"${c.nome}" investiu ${brl(c.custo)} sem nenhuma conversão, enquanto a conta converte a ${brl(cpaA)}.`,
      })
    }

    if (comparavel && c.perda_orcamento >= 0.2 && c.conversoes >= 1 && cpaA && cpaC <= cpaA * 1.1) {
      lista.push({
        nivel: 'oportunidade',
        titulo: 'Campanha limitada pelo orçamento',
        texto: `"${c.nome}" perde ${pct(c.perda_orcamento)} das impressões por falta de orçamento e converte a ${brl(cpaC)}, no nível da média da conta. Aumentar o orçamento tende a trazer mais conversões.`,
      })
    }

    if (c.perda_classificacao >= 0.6 && c.custo >= 100) {
      lista.push({
        nivel: 'atencao',
        titulo: 'Perdendo leilões por classificação',
        texto: `"${c.nome}" perde ${pct(c.perda_classificacao)} das impressões por classificação. Revise lances, qualidade dos anúncios e página de destino.`,
      })
    }
  }

  if (comparavel && a.conversoes >= 5 && b.conversoes >= 5 && cpaA < cpaB * 0.8) {
    lista.push({
      nivel: 'positivo',
      titulo: 'Custo por conversão caiu',
      texto: `De ${brl(cpaB)} para ${brl(cpaA)} (${pct(variacao(cpaA, cpaB))}).`,
    })
  }

  return lista.sort((x, y) => NIVEIS[x.nivel].ordem - NIVEIS[y.nivel].ordem)
}

// Conversões e custo por conversão da carteira ignoram contas com conversão inflada
// (custoConvertido é o investimento só das contas que entram na conta).
export function totais(contas) {
  const validas = contas.filter(c => !c.erro)
  const excluidas = validas.filter(contaInflada)
  const soma = k => validas.reduce((acc, c) => {
    acc.custo += c[k].custo
    if (!excluidas.includes(c)) {
      acc.conversoes     += c[k].conversoes
      acc.custoConvertido += c[k].custo
    }
    return acc
  }, { custo: 0, conversoes: 0, custoConvertido: 0 })
  return { atual: soma('atual'), anterior: soma('anterior'), excluidas }
}

export const cpaCarteira = m => (m.conversoes > 0 ? m.custoConvertido / m.conversoes : null)
