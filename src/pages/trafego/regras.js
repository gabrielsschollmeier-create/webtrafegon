export const NIVEIS = {
  critico:      { rotulo: 'Urgente',      cor: '#dc2626', fundo: '#fef2f2', ordem: 0 },
  atencao:      { rotulo: 'Atenção',      cor: '#c2410c', fundo: '#fff7ed', ordem: 1 },
  oportunidade: { rotulo: 'Oportunidade', cor: '#1d4ed8', fundo: '#eff6ff', ordem: 2 },
  positivo:     { rotulo: 'Melhorou',     cor: '#15803d', fundo: '#f0fdf4', ordem: 3 },
}

export const SAUDE = {
  critico: { rotulo: 'Urgente',        cor: '#dc2626', ordem: 0 },
  atencao: { rotulo: 'Atenção',        cor: '#ea8a29', ordem: 1 },
  ok:      { rotulo: 'Saudável',       cor: '#5bc424', ordem: 2 },
  parada:  { rotulo: 'Sem investimento', cor: '#9ca3af', ordem: 3 },
}

export const GLOSSARIO = {
  conversao:   'Uma ação valiosa registrada pelo Google Ads, como contato pelo WhatsApp, formulário enviado ou ligação.',
  custoConv:   'Quanto custou, em média, cada conversão: investimento dividido pelo número de conversões.',
  orcamento:   'A campanha esgota o orçamento antes do fim do dia e deixa de aparecer para parte das buscas.',
  classificacao: 'O anúncio perde leilões para concorrentes por lance baixo ou anúncio/página de qualidade fraca.',
  inflada:     'Quando uma ação de conversão conta algo que não é contato real, como abrir uma página, os números ficam bons demais para ser verdade.',
}

export const brl = v => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: v >= 1000 ? 0 : 2 })
export const num = v => (v || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
export const pct = v => `${Math.round((v || 0) * 100)}%`

export const cpa = m => (m.conversoes > 0 ? m.custo / m.conversoes : null)

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

const PASSOS = {
  semConversao: [
    'Em Metas > Conversões, confira se há ação de conversão principal ativa e com status "Registrando conversões".',
    'Faça um teste: clique no anúncio ou no site e envie um contato; veja se a conversão aparece em até 3 horas.',
    'Se a conversão funciona, abra os termos de pesquisa e negative o que não tem relação com o cliente.',
    'Persistindo sem resultado, reduza o orçamento até descobrir a causa.',
  ],
  parou: [
    'Em Faturamento, veja se há pagamento recusado ou saldo pré-pago zerado.',
    'Confira se alguma campanha foi pausada ou chegou à data de término.',
    'Em Anúncios, filtre por "Reprovado" ou "Limitado" e corrija o que estiver bloqueado.',
    'Se tudo estiver certo, fale com o cliente: ele pode ter pedido a pausa.',
  ],
  inflada: [
    'Em Metas > Conversões, veja qual ação concentra as conversões do período.',
    'Se for visualização de página, rolagem ou clique em botão, marque como "Secundária" para não contar no total.',
    'Mantenha como principal só o que é contato real: WhatsApp, formulário, ligação ou compra.',
    'Anote a data da mudança: os lances automáticos levam cerca de 2 semanas para se reajustar.',
  ],
  comparacao: [
    'Use o número atual como referência daqui para frente.',
    'Confira em Metas > Conversões se a ação que inflava o período anterior já foi corrigida.',
  ],
  cpaSubiu: [
    'Compare as campanhas da conta e veja qual concentrou o aumento.',
    'Abra os termos de pesquisa dessa campanha e negative as buscas sem relação com o cliente.',
    'Confira se houve mudança recente de lance, orçamento ou anúncio no histórico de alterações.',
  ],
  conversoesCairam: [
    'Veja se o investimento também caiu: menos verba explica menos conversões.',
    'Se o investimento se manteve, teste o caminho do contato (site, WhatsApp) para garantir que funciona.',
    'Confira no histórico de alterações o que mudou na conta no período.',
  ],
  campanhaSemConversao: [
    'Abra os termos de pesquisa da campanha e negative o que não tem relação com o cliente.',
    'Confira se o anúncio leva para a página certa e se o contato funciona.',
    'Sem melhora em 7 dias, reduza o orçamento dela e reforce as campanhas que convertem.',
  ],
  orcamento: [
    'Aumente o orçamento diário da campanha em até 20%.',
    'Espere 3 a 4 dias e compare o custo por conversão antes de aumentar de novo.',
    'Combine o aumento com o cliente se mudar o investimento mensal.',
  ],
  classificacao: [
    'Confira o Índice de Qualidade das principais palavras-chave.',
    'Melhore os anúncios: use a palavra-chave no título e destaque o diferencial do cliente.',
    'Se o custo por conversão estiver bom, teste aumentar o lance em 10% a 15%.',
  ],
}

export function insightsDaConta(conta) {
  if (conta.erro) {
    return [{ nivel: 'critico', titulo: 'Não foi possível ler a conta', resumo: conta.erro, impacto: 0, passos: ['Confira se a conta continua vinculada à MCC e ativa.'] }]
  }
  if (semInvestimento(conta)) return []

  const a = conta.atual, b = conta.anterior
  const cpaA = cpa(a), cpaB = cpa(b)
  const lista = []

  if (a.custo >= 150 && a.conversoes === 0) {
    lista.push({
      nivel: 'critico', titulo: 'Investindo sem nenhuma conversão',
      resumo: `${brl(a.custo)} investidos no período e nenhuma conversão registrada.`,
      impacto: a.custo, passos: PASSOS.semConversao,
    })
  }

  if (b.custo >= 100 && a.custo < b.custo * 0.2) {
    lista.push({
      nivel: 'critico', titulo: 'A conta parou de investir',
      resumo: `O investimento caiu de ${brl(b.custo)} para ${brl(a.custo)}.`,
      impacto: b.custo - a.custo, passos: PASSOS.parou,
    })
  }

  const salto = saltoSuspeito(a, b)
  if (conversaoInflada(a) || salto) {
    lista.push({
      nivel: 'atencao', titulo: 'Conversões infladas', ajuda: 'inflada',
      resumo: salto
        ? `As conversões saltaram de ${num(b.conversoes)} para ${num(a.conversoes)}; os cliques, só de ${num(b.cliques)} para ${num(a.cliques)}.`
        : `${num(a.conversoes)} conversões para ${num(a.cliques)} cliques: mais conversões do que é possível de verdade.`,
      impacto: a.custo, passos: PASSOS.inflada,
    })
  } else if (conversaoInflada(b)) {
    lista.push({
      nivel: 'atencao', titulo: 'Período anterior com conversões infladas', ajuda: 'inflada',
      resumo: `A comparação não vale: antes eram ${num(b.conversoes)} conversões para ${num(b.cliques)} cliques. Hoje são ${num(a.conversoes)}, a ${brl(cpaA)} cada.`,
      impacto: 0, passos: PASSOS.comparacao,
    })
  }

  const comparavel = !contaInflada(conta)

  if (comparavel && a.conversoes >= 3 && b.conversoes >= 3 && cpaA > cpaB * 1.3) {
    lista.push({
      nivel: 'atencao', titulo: 'Cada conversão ficou mais cara', ajuda: 'custoConv',
      resumo: `Passou de ${brl(cpaB)} para ${brl(cpaA)}, ${pct(variacao(cpaA, cpaB))} a mais que no período anterior.`,
      impacto: (cpaA - cpaB) * a.conversoes, passos: PASSOS.cpaSubiu,
    })
  }

  if (comparavel && b.conversoes >= 5 && a.conversoes < b.conversoes * 0.7) {
    lista.push({
      nivel: 'atencao', titulo: 'Menos conversões que no período anterior',
      resumo: `Caíram de ${num(b.conversoes)} para ${num(a.conversoes)}.`,
      impacto: (b.conversoes - a.conversoes) * (cpaB || 0), passos: PASSOS.conversoesCairam,
    })
  }

  for (const c of conta.campanhas) {
    const cpaC = cpa(c)

    if (a.conversoes > 0 && c.conversoes === 0 && c.custo >= Math.max(100, 2 * (cpaA || 0))) {
      lista.push({
        nivel: 'atencao', titulo: 'Campanha gastando sem converter', campanha: c.nome,
        resumo: `${brl(c.custo)} investidos sem conversão, enquanto o resto da conta converte a ${brl(cpaA)}.`,
        impacto: c.custo, passos: PASSOS.campanhaSemConversao,
      })
    }

    if (comparavel && c.perda_orcamento >= 0.2 && c.conversoes >= 1 && cpaA && cpaC <= cpaA * 1.1) {
      lista.push({
        nivel: 'oportunidade', titulo: 'Pode converter mais com mais orçamento', campanha: c.nome, ajuda: 'orcamento',
        resumo: `Deixa de aparecer em ${pct(c.perda_orcamento)} das buscas por falta de orçamento e converte a ${brl(cpaC)}, no nível da conta.`,
        impacto: 0, passos: PASSOS.orcamento,
      })
    }

    if (c.perda_classificacao >= 0.6 && c.custo >= 100) {
      lista.push({
        nivel: 'atencao', titulo: 'Perdendo para concorrentes', campanha: c.nome, ajuda: 'classificacao',
        resumo: `Deixa de aparecer em ${pct(c.perda_classificacao)} das buscas por lance ou qualidade do anúncio.`,
        impacto: 0, passos: PASSOS.classificacao,
      })
    }
  }

  if (comparavel && a.conversoes >= 5 && b.conversoes >= 5 && cpaA < cpaB * 0.8) {
    lista.push({
      nivel: 'positivo', titulo: 'Cada conversão ficou mais barata', ajuda: 'custoConv',
      resumo: `Caiu de ${brl(cpaB)} para ${brl(cpaA)}.`, impacto: 0, passos: [],
    })
  }

  return lista.sort((x, y) => NIVEIS[x.nivel].ordem - NIVEIS[y.nivel].ordem || y.impacto - x.impacto)
}

export function saudeDaConta(conta, insights = insightsDaConta(conta)) {
  if (conta.erro) return 'critico'
  if (semInvestimento(conta)) return 'parada'
  if (insights.some(x => x.nivel === 'critico')) return 'critico'
  if (insights.some(x => x.nivel === 'atencao')) return 'atencao'
  return 'ok'
}

export function etiquetasDaCampanha(c) {
  const lista = []
  if (c.custo >= 100 && c.conversoes === 0) lista.push({ rotulo: 'Sem conversão', cor: NIVEIS.critico.cor, fundo: NIVEIS.critico.fundo })
  if (c.perda_orcamento >= 0.2) lista.push({ rotulo: 'Limitada pelo orçamento', cor: NIVEIS.oportunidade.cor, fundo: NIVEIS.oportunidade.fundo, ajuda: 'orcamento' })
  if (c.perda_classificacao >= 0.5) lista.push({ rotulo: 'Perdendo para concorrentes', cor: NIVEIS.atencao.cor, fundo: NIVEIS.atencao.fundo, ajuda: 'classificacao' })
  return lista
}

// Conversões e custo por conversão da carteira ignoram contas com conversão inflada
// (custoConvertido é o investimento só das contas que entram na conta).
export function totais(contas) {
  const validas = contas.filter(c => !c.erro)
  const excluidas = validas.filter(contaInflada)
  const soma = k => validas.reduce((acc, c) => {
    acc.custo += c[k].custo
    if (!excluidas.includes(c)) {
      acc.conversoes      += c[k].conversoes
      acc.custoConvertido += c[k].custo
    }
    return acc
  }, { custo: 0, conversoes: 0, custoConvertido: 0 })
  return { atual: soma('atual'), anterior: soma('anterior'), excluidas }
}

export const cpaCarteira = m => (m.conversoes > 0 ? m.custoConvertido / m.conversoes : null)
