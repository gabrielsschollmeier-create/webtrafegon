import { useState } from 'react'
import { motion } from 'framer-motion'

const COR = '#6eda2c'

function Badge({ color, text }) {
  return (
    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ background: color + '20', color }}>{text}</span>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      <p className="text-sm font-extrabold text-text mb-4">{title}</p>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: ICP & PERSONAS
══════════════════════════════════════════ */
function IcpPersonas() {
  const personas = [
    {
      id: 'ana',
      nome: 'Ana Paula',
      idade: '30–38 anos',
      tipo: 'Jurídico · Entrada',
      area: 'Direito de Família / Previdenciário / Cível',
      formato: 'Autônoma ou escritório 1–3 adv.',
      faturamento: 'R$ 8–18k/mês',
      midia: 'R$ 800–1.500/mês',
      produto: 'Destrava Digital',
      dor: 'Depende 100% de indicação. Não sabe de onde virão os próximos clientes.',
      gatilho: 'Mês fraco. Ou ver colega crescendo com anúncios.',
      convence: 'Case real de advogada parecida + entendimento das regras OAB.',
      color: '#a78bfa',
      icon: '⚖️',
      refs: 'Andressa, Mayara, Gabriel Piva',
    },
    {
      id: 'carlos',
      nome: 'Carlos',
      idade: '38–50 anos',
      tipo: 'Jurídico · Assessoria',
      area: 'Família, Previdenciário, Cível',
      formato: 'Escritório estruturado 2–5 adv.',
      faturamento: 'R$ 30–80k/mês (escritório)',
      midia: 'R$ 1.500–3.000/mês',
      produto: 'Assessoria Recorrente',
      dor: 'Crescimento desorganizado. Sócio cético. Tentou marketing sem método.',
      gatilho: 'Resultado inconsistente. Quer escalar sem depender da rede pessoal.',
      convence: 'Método claro + números + entender o segmento jurídico.',
      color: '#60a5fa',
      icon: '🏛️',
      refs: 'RCA Advogados (Carol), Polizio Advogados',
    },
    {
      id: 'rejane',
      nome: 'Rejane',
      idade: '38–55 anos',
      tipo: 'Geral · Regional',
      area: 'B2B: construção, ferro/aço, energia, software',
      formato: 'Empresa 5–50 func. · Sul SC prioritário',
      faturamento: 'R$ 500k–10M/ano',
      midia: 'R$ 1.500–2.500/mês',
      produto: 'Assessoria Recorrente',
      dor: 'Crescimento depende da rede do dono. Sem previsibilidade.',
      gatilho: 'Concorrente crescendo. Meta que equipe não bate sem mais leads.',
      convence: 'Confiança + resultado real em vendas (não só leads).',
      color: '#ea8a29',
      icon: '🏭',
      refs: 'Kamy, Milfer, Lenergy, Kinto, Casa do Construtor',
    },
  ]

  const [ativo, setAtivo] = useState('ana')
  const persona = personas.find(p => p.id === ativo)

  return (
    <div className="space-y-5">

      {/* Resumo comparativo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {personas.map(p => (
          <motion.div key={p.id} whileHover={{ y: -2 }}
            onClick={() => setAtivo(p.id)}
            className="rounded-2xl p-4 cursor-pointer transition-all"
            style={{
              background: ativo === p.id ? p.color + '12' : 'white',
              border: `2px solid ${ativo === p.id ? p.color : '#e2e5f0'}`,
              boxShadow: ativo === p.id ? `0 4px 20px ${p.color}25` : '0 2px 8px rgba(26,29,46,0.06)',
            }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: p.color + '18' }}>{p.icon}</div>
              <div>
                <p className="text-sm font-extrabold text-text">{p.nome}</p>
                <p className="text-[10px]" style={{ color: p.color }}>{p.tipo}</p>
              </div>
            </div>
            <p className="text-[11px] text-muted mb-3 line-clamp-2">"{p.dor}"</p>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-text">{p.faturamento}</span>
              <span className="font-bold" style={{ color: p.color }}>{p.produto}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detalhe da persona selecionada */}
      <motion.div key={ativo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Section title={`${persona.icon} ${persona.nome} — Detalhamento`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[
                { label: 'Idade', value: persona.idade },
                { label: 'Área de atuação', value: persona.area },
                { label: 'Formato', value: persona.formato },
                { label: 'Faturamento estimado', value: persona.faturamento },
                { label: 'Budget em mídia', value: persona.midia },
                { label: 'Produto ideal', value: persona.produto },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2"
                  style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <span className="text-[11px] text-muted">{item.label}</span>
                  <span className="text-xs font-bold text-text text-right ml-4">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ background: persona.color + '08', border: `1px solid ${persona.color}25` }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2" style={{ color: persona.color }}>Dor principal</p>
                <p className="text-sm text-text">{persona.dor}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: '#ea8a2908', border: '1px solid #ea8a2925' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2" style={{ color: '#ea8a29' }}>Gatilho de compra</p>
                <p className="text-sm text-text">{persona.gatilho}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: '#6eda2c08', border: '1px solid #6eda2c25' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2" style={{ color: COR }}>O que a convence</p>
                <p className="text-sm text-text">{persona.convence}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: '#f7f8fc' }}>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Referência na base</p>
                <p className="text-xs text-text">{persona.refs}</p>
              </div>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Filtros de qualificação */}
      <Section title="🔍 Filtros de Qualificação por ICP">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: '#a78bfa' }}>Jurídico — O que INCLUI</p>
            {['Direito de Família (divórcio, guarda, pensão)', 'Previdenciário / BPC LOAS', 'Cível (indenizações, contratos)', 'Consumidor, Trânsito, Imobiliário', 'Escritório estruturado ou autônomo estabelecido'].map(item => (
              <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-xs text-green-500">✓</span>
                <span className="text-[11px] text-text">{item}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: '#ef4444' }}>Jurídico — O que DESQUALIFICA</p>
            {['Criminal (restrição OAB severa)', 'Empresarial/M&A (mercado de indicação)', 'Tributário complexo (B2B corporativo)', 'Faturamento abaixo de R$ 8k/mês', 'Sem processo comercial e sem disposição para estruturar'].map(item => (
              <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-xs text-red-400">✗</span>
                <span className="text-[11px] text-text">{item}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: '#ea8a29' }}>Geral — O que INCLUI</p>
            {['B2B com inside sales ou ticket médio/alto', 'Empresa estabelecida (3+ anos)', 'Sul SC prioritário · decisor acessível', 'Confia sem microgerenciar', 'Tem equipe para atender o lead gerado'].map(item => (
              <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-xs text-green-500">✓</span>
                <span className="text-[11px] text-text">{item}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: '#ef4444' }}>Geral — O que DESQUALIFICA</p>
            {['Múltiplos decisores sem hierarquia clara', 'Margem de produto muito baixa', 'Mediador ruim entre agência e dono', 'Varejo de consumo de baixo ticket', 'Não aparece para reuniões ou não segue o processo'].map(item => (
              <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-xs text-red-400">✗</span>
                <span className="text-[11px] text-text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: CONTEÚDO
══════════════════════════════════════════ */
function Conteudo() {
  const perfis = [
    {
      nome: '@trafegon',
      status: '2.250 seguidores · ativo',
      objetivo: 'Autoridade regional + employer branding',
      meta: 'Clientes estratégicos de alto ticket e talentos que querem trabalhar aqui',
      tom: 'Confiante, direto, com personalidade. Mais ousado, aspiracional.',
      color: COR,
      icon: '🏢',
      pilares: [
        { nome: 'Resultados & Prova Social', desc: 'Cases de clientes (com ou sem nome), números, antes/depois.', objetivo: 'Credibilidade para quem avalia contratar.', icon: '📊' },
        { nome: 'Cultura & Bastidores',      desc: 'Como a equipe pensa, trabalha, processo criativo, rotina.',    objetivo: 'Desejo de fazer parte + humanizar a marca.',     icon: '🎬' },
        { nome: 'Posicionamento & Visão',    desc: 'Opinião sobre o mercado, tendências, o que funciona ou não.',   objetivo: 'Autoridade regional, diferenciação.',           icon: '💡' },
        { nome: 'Lifestyle & Identidade',    desc: 'O que representa ser parte da TráfegOn além do trabalho.',     objetivo: 'Employer branding e marca aspiracional.',        icon: '✨' },
      ],
    },
    {
      nome: 'Perfil Jurídico',
      status: 'Zero · em construção',
      objetivo: 'Autoridade em marketing jurídico + geração de demanda',
      meta: 'Advogados e escritórios de Família, Previdenciário e Cível',
      tom: 'Especialista, seguro, respeitoso com o nicho. Mais educativo.',
      color: '#a78bfa',
      icon: '⚖️',
      pilares: [
        { nome: 'Educação sobre Marketing Jurídico', desc: 'O que é permitido, o que não é, como funciona o tráfego dentro das regras da OAB.', objetivo: 'Confiança + posicionamento como especialista.',   icon: '📚' },
        { nome: 'Resultados & Cases Jurídicos',      desc: 'Campanhas que funcionaram, CPL, volume de leads, tipos de casos gerados.',          objetivo: 'Prova de que funciona para esse público.',      icon: '🏆' },
        { nome: 'Desmistificação',                   desc: 'Quebrar mitos: "advogado não pode fazer marketing", "precisa de muito dinheiro".',   objetivo: 'Reduzir barreira de entrada, gerar engajamento.', icon: '🔓' },
        { nome: 'Processo & Metodologia',            desc: 'Como a agência trabalha com escritórios, o que esperar, como é a parceria.',         objetivo: 'Qualificar o lead antes do contato.',            icon: '🗺️' },
      ],
    },
  ]

  const [perfilAtivo, setPerfilAtivo] = useState(0)
  const perfil = perfis[perfilAtivo]

  return (
    <div className="space-y-5">
      {/* Seletor */}
      <div className="flex items-center gap-3">
        {perfis.map((p, i) => (
          <button key={i} onClick={() => setPerfilAtivo(i)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all"
            style={{
              background: perfilAtivo === i ? p.color + '12' : 'white',
              borderColor: perfilAtivo === i ? p.color : '#e2e5f0',
              color: perfilAtivo === i ? p.color : '#8890b5',
            }}>
            <span>{p.icon}</span> {p.nome}
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1"
              style={{ background: p.color + '20', color: p.color }}>{p.status}</span>
          </button>
        ))}
      </div>

      {/* Info do perfil */}
      <motion.div key={perfilAtivo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.3)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 80% 20%, ${perfil.color}22 0%, transparent 60%)` }} />
          <div className="relative z-10">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{ color: perfil.color + 'aa' }}>
              {perfil.nome} · Estratégia de Conteúdo
            </p>
            <p className="text-lg font-extrabold text-white mb-3">{perfil.objetivo}</p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Público</p>
                <p className="text-sm text-white/80 mt-0.5 max-w-xs">{perfil.meta}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Tom de voz</p>
                <p className="text-sm text-white/80 mt-0.5 max-w-xs">{perfil.tom}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {perfil.pilares.map((pilar, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-4"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(26,29,46,0.07)', border: `1px solid ${perfil.color}18` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: perfil.color + '15' }}>{pilar.icon}</div>
                <p className="text-sm font-extrabold text-text">{pilar.nome}</p>
              </div>
              <p className="text-[11px] text-muted mb-2">{pilar.desc}</p>
              <div className="rounded-lg px-3 py-1.5" style={{ background: perfil.color + '0a' }}>
                <p className="text-[10px] font-bold" style={{ color: perfil.color }}>Objetivo: {pilar.objetivo}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Norte estratégico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: COR + '08', border: `1px solid ${COR}25` }}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2" style={{ color: COR }}>Norte — @trafegon</p>
          <p className="text-sm text-text italic">"Crescer em qualidade, não em volume. Cada post deve fazer alguém pensar 'quero trabalhar aqui' ou 'quero contratar essa agência'."</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#a78bfa08', border: '1px solid #a78bfa25' }}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2" style={{ color: '#a78bfa' }}>Norte — Perfil Jurídico</p>
          <p className="text-sm text-text italic">"Ser a referência que o advogado já conhece antes de procurar uma agência. Antes de ligar, ele já nos segue."</p>
        </div>
      </div>

      {/* Diferença entre os canais */}
      <Section title="⚡ Diferenças Críticas entre os Canais">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {['Dimensão', '@trafegon', 'Perfil Jurídico'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Estágio',           'Consolidação',         'Lançamento'],
                ['Voz',               'Confiante, ousado',    'Especialista, educativo'],
                ['Frequência',        'Consistência',         'Alta frequência inicial'],
                ['Métrica principal', 'Qualidade dos leads',  'Crescimento de base'],
                ['Pago',              'Lead gen + awareness', 'Remarketing (pós-conteúdo)'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <td className="px-4 py-2.5 font-bold text-text">{row[0]}</td>
                  <td className="px-4 py-2.5 text-muted">{row[1]}</td>
                  <td className="px-4 py-2.5 text-muted">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: MÍDIA PAGA
══════════════════════════════════════════ */
function MidiaPaga() {
  const totalBudget = 4000

  return (
    <div className="space-y-5">

      {/* Hero */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #6eda2c22 0%, transparent 60%)' }} />
        <div className="relative z-10 flex flex-wrap gap-8 items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Budget Total/mês</p>
            <p className="text-4xl font-black" style={{ color: COR }}>R$ 4.000</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>CPL Atual</p>
            <p className="text-4xl font-black text-white">R$ 18</p>
            <p className="text-[10px] text-white/30 mt-0.5">90% advogados · qualificação é o gargalo</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Problema principal</p>
            <p className="text-sm font-extrabold text-white/80 max-w-xs">Lead jurídico chega mas não tem budget para assessoria. Filtro de qualificação está ausente.</p>
          </div>
        </div>
      </div>

      {/* Split detalhado */}
      <Section title="💸 Distribuição do Budget">
        <div className="space-y-5">
          {[
            {
              objetivo: 'Lead gen jurídico qualificado',
              canal: '@trafegon',
              valor: 2200,
              color: COR,
              icon: '🎯',
              descricao: 'Principal investimento. Criativo e formulário ajustados para filtrar escritórios com budget. Pergunta qualificadora obrigatória no formulário.',
              acoes: ['Adicionar pergunta: "Quantos advogados no escritório?"', 'Criativo fala com escritório estruturado, não autônomo iniciante', 'Segmentar por cargo (sócio, titular) quando possível'],
            },
            {
              objetivo: 'Branding regional',
              canal: '@trafegon awareness',
              valor: 1000,
              color: '#60a5fa',
              icon: '📡',
              descricao: 'Audiência pequena = alta frequência com pouco budget. Empresários locais do Sul de SC que precisam conhecer a TráfegOn antes de precisar dela.',
              acoes: ['Público: empresários Sul SC, interesse em gestão/crescimento', 'Objetivo de campanha: alcance/reconhecimento', 'Testar split com LinkedIn para B2B regional'],
            },
            {
              objetivo: 'Remarketing + credibilidade jurídico',
              canal: 'Perfil jurídico (novo)',
              valor: 800,
              color: '#a78bfa',
              icon: '🔁',
              descricao: 'Segundo toque: quem viu o @trafegon mas não converteu vê o perfil especializado. Ativar APENAS após o perfil ter 6–9 posts publicados.',
              acoes: ['Aguardar mínimo 6–9 posts no perfil antes de ativar', 'Público: remarketing de quem interagiu com @trafegon', 'Formato: conteúdo educativo (não pitch direto)'],
            },
          ].map((item, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${item.color}25` }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ background: item.color + '0a' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-extrabold text-text">{item.objetivo}</p>
                    <p className="text-[11px] text-muted">{item.canal}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold" style={{ color: item.color }}>R$ {item.valor.toLocaleString('pt-BR')}</p>
                  <p className="text-[10px] text-muted">{Math.round((item.valor / totalBudget) * 100)}% do total</p>
                </div>
              </div>
              <div className="px-4 pt-3 pb-4">
                <p className="text-[11px] text-text mb-3">{item.descricao}</p>
                <div className="space-y-1.5">
                  {item.acoes.map((acao, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-[10px] font-bold mt-0.5" style={{ color: item.color }}>→</span>
                      <span className="text-[11px] text-muted">{acao}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Sequência de ativação */}
      <Section title="📋 Sequência de Ativação">
        <div className="space-y-3">
          {[
            { semana: 'Agora',     acao: 'Ajustar formulário de lead com pergunta qualificadora',                          status: 'urgente', color: '#ef4444' },
            { semana: 'Sem 1–2',   acao: 'Criar novos criativos focados em escritório estruturado (não autônomo iniciante)', status: 'urgente', color: '#ef4444' },
            { semana: 'Sem 2–4',   acao: 'Publicar 6–9 posts no perfil jurídico',                                           status: 'preparar', color: '#ea8a29' },
            { semana: 'Mês 2',     acao: 'Ativar remarketing do perfil jurídico com os R$ 800',                             status: 'próximo', color: '#60a5fa' },
            { semana: 'Mês 2–3',   acao: 'Estruturar broadcast WhatsApp para leads não-fechados',                           status: 'próximo', color: '#60a5fa' },
            { semana: 'Mês 3+',    acao: 'Avaliar performance e ajustar split conforme CPL qualificado',                    status: 'futuro',  color: '#8890b5' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 py-2.5" style={{ borderBottom: i < 5 ? '1px solid #f1f3f9' : 'none' }}>
              <div className="w-16 flex-shrink-0">
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-lg"
                  style={{ background: item.color + '18', color: item.color }}>{item.semana}</span>
              </div>
              <p className="text-[11px] text-text flex-1">{item.acao}</p>
              <Badge color={item.color} text={item.status} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════ */
export default function TrafegonEstrategia({ color = COR }) {
  const [subTab, setSubTab] = useState('icp')

  const tabs = [
    { key: 'icp',      label: '🎯 ICP & Personas',  sub: 'Quem queremos' },
    { key: 'conteudo', label: '📱 Conteúdo',         sub: 'Dois perfis' },
    { key: 'midia',    label: '💸 Mídia Paga',        sub: 'Budget R$4k' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            🧠 Estratégia & Inteligência
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>TráfegOn</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">ICP · Personas · Conteúdo · Mídia Paga · 2º Semestre 2026</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl p-1 bg-white"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setSubTab(t.key)}
              className="flex flex-col items-start px-4 py-2 rounded-xl text-left transition-all"
              style={subTab === t.key ? { background: color + '18', color } : { color: '#8890b5' }}>
              <span className="text-xs font-extrabold">{t.label}</span>
              <span className="text-[10px] opacity-60">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div key={subTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {subTab === 'icp'      && <IcpPersonas />}
        {subTab === 'conteudo' && <Conteudo />}
        {subTab === 'midia'    && <MidiaPaga />}
      </motion.div>
    </div>
  )
}
