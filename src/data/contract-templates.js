import { jsPDF } from 'jspdf'

/* ── Dados da contratada (TráfegOn) ────────────────────────────── */
const CONTRATADA = {
  nome:    'TráfegOn Marketing Digital',
  cnpj:    'XX.XXX.XXX/XXXX-XX',         // atualize com o CNPJ real
  endereco:'Florianópolis, Santa Catarina',
  rep:     'Gabriel Schollmeier',
  rep_email: 'gabrielsschollmeier@gmail.com',
}

/* ── Templates disponíveis ─────────────────────────────────────── */
export const TEMPLATES = [
  {
    id:       'assessoria',
    nome:     'Assessoria de Marketing Digital',
    icone:    '📊',
    descricao:'Google Ads · Meta Ads · Estratégia · Relatórios mensais',
    servicos: 'gestão e otimização de campanhas no Google Ads e/ou Meta Ads, planejamento de mídia, criação e teste de criativos, análise de métricas e relatório mensal de desempenho',
  },
  {
    id:       'social_media',
    nome:     'Gestão de Redes Sociais',
    icone:    '📱',
    descricao:'Instagram · Facebook · Criação de conteúdo · Postagens',
    servicos: 'planejamento editorial, criação de conteúdo para Instagram e Facebook, produção de artes e legendas, agendamento e publicação de posts, monitoramento de métricas e engajamento',
  },
  {
    id:       'completo',
    nome:     'Assessoria Completa',
    icone:    '🚀',
    descricao:'Tráfego Pago + Social Media + Estratégia Integrada',
    servicos: 'gestão de campanhas pagas (Google Ads e Meta Ads), criação de conteúdo para redes sociais, planejamento estratégico digital integrado, análise de métricas e relatório mensal consolidado',
  },
]

/* ── Helpers ───────────────────────────────────────────────────── */
function fmtMoney(v) {
  const n = parseFloat(String(v).replace(',', '.')) || 0
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtDateLong(iso) {
  if (!iso) return '___/___/______'
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function addMonths(isoDate, months) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T12:00:00')
  d.setMonth(d.getMonth() + parseInt(months || 12))
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtCity(iso) {
  if (!iso) return ''
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

/* ── PDF generator ─────────────────────────────────────────────── */
export function generateContractPdf(templateId, form, clientName) {
  const tpl = TEMPLATES.find(t => t.id === templateId)
  if (!tpl) throw new Error('Template não encontrado')

  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const M    = 20        // margin
  const W    = 170       // content width
  const MID  = 105       // center x
  let   y    = 22

  /* helpers */
  function checkPage(needed = 10) {
    if (y + needed > 272) { doc.addPage(); y = 20 }
  }

  function title(txt, size = 13) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(size)
    checkPage(10)
    doc.text(txt, MID, y, { align: 'center' })
    y += size === 13 ? 7 : 5
  }

  function sub(txt) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    checkPage(6)
    doc.text(txt, MID, y, { align: 'center' })
    y += 5
  }

  function sectionHead(txt) {
    checkPage(12)
    y += 3
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.text(txt, M, y)
    y += 6
  }

  function body(txt) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(txt, W)
    checkPage(lines.length * 4.5 + 2)
    doc.text(lines, M, y)
    y += lines.length * 4.5 + 2
  }

  function bodyIndent(txt) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(txt, W - 5)
    checkPage(lines.length * 4.5 + 1)
    doc.text(lines, M + 5, y)
    y += lines.length * 4.5 + 1
  }

  function separator() {
    checkPage(6)
    y += 2
    doc.setDrawColor(180)
    doc.line(M, y, M + W, y)
    y += 4
  }

  function space(n = 4) { y += n }

  /* ── Cabeçalho ── */
  title('CONTRATO DE PRESTAÇÃO DE SERVIÇOS')
  title(`DE ${tpl.nome.toUpperCase()}`, 11)
  space(2)
  separator()

  /* ── Qualificação das partes ── */
  sectionHead('DAS PARTES CONTRATANTES')

  body('CONTRATANTE:')
  bodyIndent(`Empresa/Pessoa: ${clientName || form.contratante_nome || '___________________'}`)
  if (form.cnpj) bodyIndent(`CNPJ/CPF: ${form.cnpj}`)
  if (form.endereco) bodyIndent(`Endereço: ${form.endereco}`)
  bodyIndent(`Representante Legal: ${form.representante_nome || '___________________'}${form.representante_cpf ? `, CPF: ${form.representante_cpf}` : ''}`)
  bodyIndent(`E-mail: ${form.representante_email || '___________________'}`)
  space(4)

  body('CONTRATADA:')
  bodyIndent(`${CONTRATADA.nome}`)
  bodyIndent(`CNPJ: ${CONTRATADA.cnpj}`)
  bodyIndent(`Endereço: ${CONTRATADA.endereco}`)
  bodyIndent(`Representante: ${CONTRATADA.rep}`)

  separator()

  body(`As partes acima qualificadas celebram o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS, que se regerá pelas cláusulas e condições a seguir:`)

  /* ── Cláusula 1 – Objeto ── */
  sectionHead('CLÁUSULA 1ª – DO OBJETO')
  body(`A CONTRATADA se compromete a prestar à CONTRATANTE os seguintes serviços: ${tpl.servicos}.`)

  /* ── Cláusula 2 – Prazo ── */
  sectionHead('CLÁUSULA 2ª – DO PRAZO')
  const dataFim = addMonths(form.data_inicio, form.vigencia)
  body(`O presente contrato tem vigência de ${form.vigencia || '12'} (${numExtenso(parseInt(form.vigencia) || 12)}) meses, iniciando-se em ${fmtDateLong(form.data_inicio)} e encerrando-se em ${dataFim || '___________________'}, podendo ser renovado por igual período mediante acordo entre as partes.`)

  /* ── Cláusula 3 – Valor ── */
  sectionHead('CLÁUSULA 3ª – DO VALOR E FORMA DE PAGAMENTO')
  body(`O valor mensal pelos serviços é de ${fmtMoney(form.valor)}, a ser pago até o dia ${form.dia_vencimento || '10'} de cada mês, mediante boleto bancário, transferência bancária (TED/DOC) ou PIX, conforme dados informados pela CONTRATADA.`)
  space(2)
  body('O não pagamento na data prevista sujeitará ao acréscimo de multa de 2% (dois por cento) e juros de mora de 1% (um por cento) ao mês, calculados sobre o valor em atraso.')

  /* ── Cláusula 4 – Obrigações do Contratante ── */
  sectionHead('CLÁUSULA 4ª – DAS OBRIGAÇÕES DA CONTRATANTE')
  body('São obrigações da CONTRATANTE:')
  bodyIndent('a) Fornecer à CONTRATADA acesso às plataformas e ferramentas digitais necessárias à execução dos serviços;')
  bodyIndent('b) Aprovar os materiais de comunicação (criativos, textos, campanhas) em até 48 (quarenta e oito) horas úteis;')
  bodyIndent('c) Disponibilizar as informações, imagens e conteúdos necessários para a execução dos serviços;')
  bodyIndent('d) Efetuar os pagamentos nas datas acordadas.')

  /* ── Cláusula 5 – Obrigações da Contratada ── */
  sectionHead('CLÁUSULA 5ª – DAS OBRIGAÇÕES DA CONTRATADA')
  body('São obrigações da CONTRATADA:')
  bodyIndent('a) Executar os serviços contratados com qualidade, diligência e dentro dos prazos acordados;')
  bodyIndent('b) Emitir relatório mensal de desempenho das ações realizadas;')
  bodyIndent('c) Manter sigilo absoluto sobre as informações, estratégias e dados da CONTRATANTE;')
  bodyIndent('d) Comunicar previamente qualquer impossibilidade de cumprimento dos serviços.')

  /* ── Cláusula 6 – Rescisão ── */
  sectionHead('CLÁUSULA 6ª – DA RESCISÃO')
  body('O presente contrato poderá ser rescindido por qualquer das partes mediante aviso prévio por escrito de 30 (trinta) dias. Em caso de rescisão sem aviso prévio, a parte que der causa pagará multa equivalente a 1 (uma) mensalidade integral.')

  /* ── Cláusula 7 – Confidencialidade ── */
  sectionHead('CLÁUSULA 7ª – DA CONFIDENCIALIDADE')
  body('As partes se comprometem a manter em sigilo todas as informações confidenciais, estratégias de negócio, dados de clientes e informações técnicas às quais tiverem acesso em razão deste contrato, durante sua vigência e por 2 (dois) anos após seu encerramento.')

  /* ── Cláusula 8 – Foro ── */
  sectionHead('CLÁUSULA 8ª – DO FORO')
  body(`Para dirimir eventuais controvérsias decorrentes deste contrato, as partes elegem o foro da Comarca de ${form.cidade_foro || 'Florianópolis'}, Estado de Santa Catarina, renunciando a qualquer outro, por mais privilegiado que seja.`)

  /* ── Assinaturas ── */
  separator()
  space(2)
  body(`${form.cidade_foro || 'Florianópolis'}, ${fmtCity(form.data_inicio) || fmtCity(new Date().toISOString().split('T')[0])}`)
  space(10)

  const col1 = M
  const col2 = M + W / 2 + 5

  doc.setDrawColor(60)
  doc.line(col1, y, col1 + 75, y)
  doc.line(col2, y, col2 + 75, y)
  y += 5

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('CONTRATANTE', col1, y)
  doc.text('CONTRATADA', col2, y)
  y += 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const contratanteNome = clientName || form.contratante_nome || ''
  doc.text(contratanteNome.slice(0, 35), col1, y)
  doc.text(CONTRATADA.nome, col2, y)
  y += 4

  doc.text(form.representante_nome || '', col1, y)
  doc.text(CONTRATADA.rep, col2, y)

  /* ── Numeração de páginas ── */
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(150)
    doc.text(`Página ${p} de ${total} — ${tpl.nome} — ${clientName || ''}`, MID, 290, { align: 'center' })
    doc.setTextColor(0)
  }

  return doc.output('datauristring').split(',')[1]
}

/* ── Números por extenso (1-36) ────────────────────────────────── */
function numExtenso(n) {
  const map = {
    1:'um',2:'dois',3:'três',4:'quatro',5:'cinco',6:'seis',7:'sete',8:'oito',
    9:'nove',10:'dez',11:'onze',12:'doze',13:'treze',14:'catorze',15:'quinze',
    16:'dezesseis',17:'dezessete',18:'dezoito',19:'dezenove',20:'vinte',
    24:'vinte e quatro',36:'trinta e seis',
  }
  return map[n] || String(n)
}
