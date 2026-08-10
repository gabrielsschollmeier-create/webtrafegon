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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jurídico inclui */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: '#a78bfa' }}>Jurídico — O que INCLUI</p>
            {[
              'Direito de Família (divórcio, guarda, pensão)',
              'Previdenciário / BPC LOAS',
              'Cível (indenizações, contratos)',
              'Criminal (atendemos sem restrição)',
              'Consumidor, Trânsito, Imobiliário',
              'Escritório estruturado ou autônomo estabelecido',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-xs text-green-500">✓</span>
                <span className="text-[11px] text-text">{item}</span>
              </div>
            ))}
          </div>

          {/* Jurídico atenção / desqualifica */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: '#ef4444' }}>Jurídico — Impeditivos reais</p>
            {[
              { item: 'Faturamento abaixo de R$ 8k/mês', nivel: 'bloqueio' },
              { item: 'Sem disposição nenhuma para estruturar comercial', nivel: 'bloqueio' },
              { item: 'Empresarial/M&A — mercado 100% de indicação', nivel: 'atenção' },
            ].map(({ item, nivel }) => (
              <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-xs" style={{ color: nivel === 'bloqueio' ? '#ef4444' : '#ea8a29' }}>
                  {nivel === 'bloqueio' ? '✗' : '⚠'}
                </span>
                <span className="text-[11px] text-text">{item}</span>
                {nivel === 'atenção' && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto" style={{ background: '#ea8a2918', color: '#ea8a29' }}>atenção</span>
                )}
              </div>
            ))}
          </div>

          {/* Geral inclui */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: '#ea8a29' }}>Geral — O que INCLUI</p>
            {[
              'B2B com inside sales ou ticket médio/alto',
              'Empresa estabelecida (3+ anos)',
              'Sul SC prioritário · decisor acessível',
              'Confia sem microgerenciar',
              'Tem capacidade de atender o lead gerado',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-xs text-green-500">✓</span>
                <span className="text-[11px] text-text">{item}</span>
              </div>
            ))}
          </div>

          {/* Geral — sinais de atenção (não impeditivos absolutos) */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: '#ea8a29' }}>Geral — Sinais de atenção</p>
            {[
              { item: 'Margem de produto muito baixa', nivel: 'bloqueio', obs: 'inviabiliza ROI' },
              { item: 'Múltiplos decisores sem hierarquia clara', nivel: 'atenção', obs: 'requer alinhamento inicial' },
              { item: 'Mediador ruim entre agência e dono', nivel: 'atenção', obs: 'exige acesso direto ao decisor' },
              { item: 'Varejo de consumo de baixo ticket', nivel: 'atenção', obs: 'avaliar margens antes' },
              { item: 'Não aparece para reuniões ou ignora processo', nivel: 'bloqueio', obs: 'histórico claro' },
            ].map(({ item, nivel, obs }) => (
              <div key={item} className="flex items-start gap-2 py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: nivel === 'bloqueio' ? '#ef4444' : '#ea8a29' }}>
                  {nivel === 'bloqueio' ? '✗' : '⚠'}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-text">{item}</span>
                  <span className="text-[10px] text-muted ml-1">· {obs}</span>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-muted mt-3 italic">⚠ = sinal de atenção, não bloqueio absoluto — avaliar caso a caso.</p>
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
   ABA: ECOSSISTEMA
══════════════════════════════════════════ */
export function Ecossistema() {
  const pilares = [
    {
      id: 'juridico',
      icon: '⚖️',
      titulo: 'Agência para Advogados',
      subtitulo: 'Vertical jurídica',
      color: '#a78bfa',
      descricao: 'Nicho de especialização com maior potencial de crescimento. Somos a referência em marketing jurídico da região — advogados nos encontram antes de buscar qualquer agência.',
      status: 'Em escala',
      statusColor: '#6eda2c',
      itens: [
        { label: 'Clientes ativos', value: '7 escritórios / advogados' },
        { label: 'Áreas atendidas', value: 'Família, Previdenciário, Cível, Criminal' },
        { label: 'Canal principal', value: 'Google Ads (rede de pesquisa)' },
        { label: 'Produto de entrada', value: 'Destrava Digital + Landing Page' },
        { label: 'Produto de recorrência', value: 'Assessoria R$ 3.500+/mês' },
        { label: 'Meta 2º sem.', value: '12 clientes jurídicos ativos' },
      ],
      acoes: [
        'Perfil jurídico no Instagram com frequência semanal',
        'Remarketing para advogados que viram @trafegon',
        'Broadcast WhatsApp com leads não-fechados',
        'Parcerias com influenciadoras do nicho jurídico',
      ],
    },
    {
      id: 'regional',
      icon: '📍',
      titulo: 'Forte Regionalmente',
      subtitulo: 'Posicionamento B2B Sul SC',
      color: '#60a5fa',
      descricao: 'Ser a agência de referência para empresas do Sul de SC que querem crescer. Quando um empresário da região pensa em tráfego pago, pensa na TráfegOn antes de qualquer outra.',
      status: 'Em construção',
      statusColor: '#ea8a29',
      itens: [
        { label: 'Região prioritária', value: 'Araranguá, Criciúma, Tubarão, Içara' },
        { label: 'Perfil de cliente', value: 'B2B estabelecido 3+ anos, decisor acessível' },
        { label: 'Setores fortes', value: 'Construção, Energia Solar, Software, Indústria' },
        { label: 'Canal de aquisição', value: '@trafegon awareness + indicação' },
        { label: 'Diferencial', value: 'Atendimento presencial + proximidade regional' },
        { label: 'Meta 2º sem.', value: 'Top of mind em 3 cidades do Sul SC' },
      ],
      acoes: [
        'Conteúdo com cases de clientes regionais (com autorização)',
        'Presença em eventos e associações locais',
        'Branding @trafegon voltado para empresários da região',
        'LinkedIn como canal complementar para B2B',
      ],
    },
    {
      id: 'proprios',
      icon: '🏢',
      titulo: 'Produtos & Empresas Próprias',
      subtitulo: 'Participação e equity',
      color: '#f59e0b',
      descricao: 'Além de prestar serviços, a TráfegOn constrói e participa de negócios próprios. O primeiro é o escritório da Dra. Caroline Pagani — modelo que pode se replicar em outros segmentos.',
      status: 'Iniciando',
      statusColor: '#a78bfa',
      itens: [
        { label: 'Primeiro negócio', value: 'Escritório Dra. Caroline Pagani' },
        { label: 'Modelo', value: 'Participação societária ou revenue share' },
        { label: 'Vantagem', value: 'Laboratório próprio para testar estratégias' },
        { label: 'Potencial', value: 'Replicar em outros nichos e regiões' },
        { label: 'Próximo passo', value: 'Definir estrutura jurídica da parceria' },
        { label: 'Meta', value: '2–3 negócios próprios até 2027' },
      ],
      acoes: [
        'Formalizar parceria com o escritório Caroline Pagani',
        'Documentar o modelo para replicação futura',
        'Usar como case de metodologia própria',
        'Avaliar novos segmentos para o mesmo modelo',
      ],
    },
  ]

  const [ativo, setAtivo] = useState('juridico')
  const pilar = pilares.find(p => p.id === ativo)

  return (
    <div className="space-y-5">

      {/* Hero — visão macro */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #101828 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, #6eda2c15 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center mb-5">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#6eda2caa' }}>TráfegOn · Visão Estratégica · 2026–2027</p>
          <h2 className="text-2xl font-black text-white">Ecossistema de Crescimento</h2>
          <p className="text-sm text-white/40 mt-1">Três pilares que se reforçam mutuamente</p>
        </div>

        {/* Os três pilares resumidos */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          {pilares.map((p, i) => (
            <motion.div key={p.id} whileHover={{ y: -3 }}
              onClick={() => setAtivo(p.id)}
              className="rounded-2xl p-4 cursor-pointer transition-all text-center"
              style={{
                background: ativo === p.id ? p.color + '20' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${ativo === p.id ? p.color + '60' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: ativo === p.id ? `0 4px 20px ${p.color}30` : 'none',
              }}>
              <div className="text-3xl mb-2">{p.icon}</div>
              <p className="text-xs font-extrabold text-white leading-tight">{p.titulo}</p>
              <p className="text-[10px] mt-1" style={{ color: p.color + 'bb' }}>{p.subtitulo}</p>
              <span className="inline-block mt-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ background: p.statusColor + '25', color: p.statusColor }}>{p.status}</span>
            </motion.div>
          ))}
        </div>

        {/* Seta de reforço mútuo */}
        <p className="text-center text-[10px] text-white/20 mt-3 relative z-10">
          ↔ os três pilares se alimentam mutuamente — clientes jurídicos viram cases regionais · negócios próprios provam o método
        </p>
      </div>

      {/* Detalhe do pilar selecionado */}
      <motion.div key={ativo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${pilar.color}25` }}>
          <div className="px-5 py-4 flex items-center gap-4" style={{ background: pilar.color + '08', borderBottom: `1px solid ${pilar.color}18` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: pilar.color + '18' }}>{pilar.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-extrabold text-text">{pilar.titulo}</p>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                  style={{ background: pilar.statusColor + '20', color: pilar.statusColor }}>{pilar.status}</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{pilar.descricao}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-5" style={{ borderRight: '1px solid #f1f3f9' }}>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-3">Indicadores & Estrutura</p>
              {pilar.itens.map(item => (
                <div key={item.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #f7f8fc' }}>
                  <span className="text-[11px] text-muted">{item.label}</span>
                  <span className="text-xs font-bold text-text text-right ml-4 max-w-[180px]">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-3">Ações em andamento</p>
              <div className="space-y-2.5">
                {pilar.acoes.map((acao, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                    style={{ background: pilar.color + '08', border: `1px solid ${pilar.color}18` }}>
                    <span className="text-sm font-extrabold flex-shrink-0" style={{ color: pilar.color }}>{i + 1}</span>
                    <p className="text-[11px] text-text">{acao}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Como os pilares se conectam */}
      <Section title="🔗 Como os pilares se alimentam">
        <div className="space-y-3">
          {[
            { de: '⚖️ Jurídico', seta: '→', para: '📍 Regional', desc: 'Cases de advogados se tornam prova social para outros segmentos da região. "Se funciona para escritório, funciona para sua empresa."' },
            { de: '📍 Regional', seta: '→', para: '🏢 Próprios', desc: 'A reputação regional facilita atrair parceiros para novos negócios. Empresários conhecem a TráfegOn antes de qualquer conversa de equity.' },
            { de: '🏢 Próprios', seta: '→', para: '⚖️ Jurídico', desc: 'O escritório Caroline Pagani é laboratório vivo do método. Resultados reais sem depender de cliente — prova o sistema para outros advogados.' },
          ].map((c, i) => (
            <div key={i} className="rounded-xl p-4 flex items-start gap-4"
              style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
              <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                <span className="text-sm font-bold text-text">{c.de}</span>
                <span className="text-muted">{c.seta}</span>
                <span className="text-sm font-bold text-text">{c.para}</span>
              </div>
              <p className="text-[11px] text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Por que esse modelo vence no longo prazo */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0f1f10 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #6eda2c12 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#6eda2caa' }}>Tese de Negócio</p>
          <h3 className="text-xl font-black text-white mb-1">Por que esse modelo prospera no longo prazo</h3>
          <p className="text-sm text-white/40 mb-6">Enquanto agências de serviço puro têm teto, esse ecossistema tem efeito composto.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              {
                icon: '⏰',
                titulo: 'O problema do modelo de serviço puro',
                color: '#ef4444',
                desc: 'Toda agência que vende apenas serviço está vendendo horas disfarçadas. O crescimento é linear: mais clientes exige mais equipe, mais custo, mais gestão. O dono nunca para de operar — ele só aumenta a complexidade. Existe um teto invisível de faturamento que nenhuma contratação resolve.',
              },
              {
                icon: '🔄',
                titulo: 'O efeito composto dos três pilares',
                color: COR,
                desc: 'Cada pilar gera ativos — não apenas receita. O jurídico gera reputação de nicho (difícil de copiar). O regional gera relacionamento presencial (impossível de replicar à distância). Os negócios próprios geram equity e dividendos. Esses ativos se acumulam com o tempo e se tornam barreiras de entrada para qualquer concorrente.',
              },
              {
                icon: '🏰',
                titulo: 'Barreiras que se constroem sozinhas',
                color: '#60a5fa',
                desc: 'Nenhuma agência de São Paulo vai conseguir entrar no Sul de SC com o mesmo nível de relacionamento que a TráfegOn tem com empresários locais. Nenhuma agência genérica vai conseguir falar a língua do advogado com a mesma credibilidade de quem já está no nicho há anos. Essas barreiras não custam — elas se constroem com consistência.',
              },
              {
                icon: '🌱',
                titulo: 'De prestador a sócio: o salto de valor',
                color: '#f59e0b',
                desc: 'Quando a TráfegOn tem participação em negócios que ela mesma escala, o modelo muda de patamar. O escritório Caroline Pagani não é mais um cliente — é um ativo. Se ele cresce 3x nos próximos 2 anos, a TráfegOn cresce junto sem vender mais uma hora de trabalho. Esse é o salto de prestador para sócio estratégico.',
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.color}30` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-sm font-extrabold" style={{ color: item.color }}>{item.titulo}</p>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Visão 2027 */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(110,218,44,0.06)', border: '1px solid rgba(110,218,44,0.2)' }}>
            <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: '#6eda2c' }}>Visão 2027 — onde esse modelo chega</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '⚖️', titulo: 'Referência jurídica', desc: 'A TráfegOn é citada por advogados como a agência que entende o segmento. O perfil jurídico tem 10k+ seguidores e gera leads qualificados de forma orgânica.' },
                { icon: '📍', titulo: 'Marca regional consolidada', desc: 'Nos principais eventos do Sul SC, a TráfegOn é presença. Empresários da região conhecem a marca antes de procurar agência. Indicação é canal relevante.' },
                { icon: '🏢', titulo: '3+ negócios com equity', desc: 'Além de clientes, a TráfegOn tem participação em 2 a 3 negócios que ela mesma escalou. Uma linha de resultado que não depende de novos contratos de serviço.' },
              ].map((v, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl mb-2">{v.icon}</div>
                  <p className="text-xs font-extrabold text-white mb-1">{v.titulo}</p>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: CANAIS
══════════════════════════════════════════ */
function Canais() {
  const influenciadoras = [
    {
      nome: 'Camila Masera',
      handle: '@camilamasera',
      area: 'Advocacia',
      color: '#f472b6',
      icon: '⚖️',
      perfil: 'Advogada com perfil digital ativo e audiência no nicho jurídico. Já é cliente da TráfegOn — relacionamento estabelecido e confiança construída.',
      potencial: 'Alcançar advogados e escritórios que seguem perfis jurídicos de referência. Audiência qualificada e alinhada ao ICP do canal jurídico.',
      estrategia: [
        'Collab de conteúdo no perfil jurídico da TráfegOn — ela aparece como referência',
        'Depoimento sobre o processo de crescimento com a agência',
        'Stories citando a TráfegOn como parceira estratégica',
        'Co-criação de conteúdo educativo sobre marketing jurídico',
      ],
      metricas: 'Alcance de audiência jurídica qualificada · novos seguidores no perfil jurídico · leads por indicação direta',
    },
    {
      nome: 'Gabriela Gonçalves',
      handle: 'FGLaw',
      area: 'Advocacia',
      color: '#67e8f9',
      icon: '🏛️',
      perfil: 'Advogada com posicionamento digital no segmento jurídico. Fonseca e Gonçalves Advogados — escritório com identidade de marca bem construída.',
      potencial: 'Credibilidade no segmento por ser um escritório estruturado. A audiência dela é composta por advogados que aspiram esse nível de profissionalização.',
      estrategia: [
        'Parceria de visibilidade: TráfegOn aparece como agência por trás do crescimento digital',
        'Case público do trabalho realizado — resultados de campanha como conteúdo',
        'Indicação mútua: ela indica a TráfegOn para outros advogados do círculo',
        'Presença em eventos jurídicos onde ela participa como referência',
      ],
      metricas: 'Leads por indicação · seguidores no perfil jurídico · autoridade percebida no nicho',
    },
  ]

  const canais = [
    {
      nome: 'Instagram @trafegon',
      icon: '📷',
      color: COR,
      status: '🟢 Ativo',
      seguidores: '2.250',
      objetivo: 'Autoridade regional + employer branding',
      frequencia: 'Consistente (definir calendário)',
      pago: 'R$ 1.000 awareness + R$ 2.200 lead gen',
    },
    {
      nome: 'Instagram Jurídico',
      icon: '⚖️',
      color: '#a78bfa',
      status: '🟡 Em construção',
      seguidores: '0 — iniciando',
      objetivo: 'Autoridade em marketing jurídico',
      frequencia: 'Alta no início (3–5x/semana)',
      pago: 'R$ 800 remarketing (após 6–9 posts)',
    },
    {
      nome: 'LinkedIn',
      icon: '💼',
      color: '#60a5fa',
      status: '🔴 Não ativado',
      seguidores: '—',
      objetivo: 'B2B regional + jurídico de alto ticket',
      frequencia: 'A definir',
      pago: 'Testar com parte do budget de awareness',
    },
    {
      nome: 'WhatsApp Broadcast',
      icon: '💬',
      color: '#4ade80',
      status: '🔴 A implementar',
      seguidores: '—',
      objetivo: 'Nutrição de leads não-fechados',
      frequencia: '1–2x por semana',
      pago: 'Orgânico — sem custo de mídia',
    },
  ]

  return (
    <div className="space-y-6">

      {/* Visão geral dos canais */}
      <Section title="📡 Mapa de Canais">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {canais.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl p-4" style={{ background: c.color + '08', border: `1px solid ${c.color}25` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: c.color + '18' }}>{c.icon}</div>
                <div>
                  <p className="text-sm font-extrabold text-text">{c.nome}</p>
                  <p className="text-[10px] font-bold" style={{ color: c.color }}>{c.status}</p>
                </div>
              </div>
              {[
                { label: 'Base', value: c.seguidores },
                { label: 'Objetivo', value: c.objetivo },
                { label: 'Frequência', value: c.frequencia },
                { label: 'Investimento', value: c.pago },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between py-1.5" style={{ borderBottom: '1px solid ' + c.color + '15' }}>
                  <span className="text-[10px] text-muted flex-shrink-0">{item.label}</span>
                  <span className="text-[10px] font-bold text-text text-right ml-3">{item.value}</span>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Influenciadoras */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">✨</span>
          <p className="text-sm font-extrabold text-text">Estratégia de Influenciadoras</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1" style={{ background: '#f472b618', color: '#f472b6' }}>
            {influenciadoras.length} parceiras
          </span>
        </div>
        <p className="text-[11px] text-muted mb-4">
          Advogadas com audiência no nicho jurídico que ampliam o alcance da TráfegOn para um público altamente qualificado — sem o custo de mídia de uma campanha fria.
        </p>

        <div className="space-y-4">
          {influenciadoras.map((inf, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${inf.color}25` }}>

              {/* Header */}
              <div className="px-5 py-4 flex items-center gap-4" style={{ background: inf.color + '08', borderBottom: `1px solid ${inf.color}18` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: inf.color + '20' }}>{inf.icon}</div>
                <div className="flex-1">
                  <p className="text-base font-extrabold text-text">{inf.nome}</p>
                  <p className="text-xs font-bold" style={{ color: inf.color }}>{inf.handle} · {inf.area}</p>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full"
                  style={{ background: inf.color + '18', color: inf.color }}>Parceira estratégica</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Perfil */}
                <div className="p-4" style={{ borderRight: '1px solid #f1f3f9' }}>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Perfil</p>
                  <p className="text-[11px] text-text leading-relaxed">{inf.perfil}</p>
                  <div className="mt-3 rounded-lg p-2.5" style={{ background: inf.color + '0a' }}>
                    <p className="text-[10px] font-bold" style={{ color: inf.color }}>Potencial</p>
                    <p className="text-[11px] text-text mt-0.5">{inf.potencial}</p>
                  </div>
                </div>

                {/* Estratégia */}
                <div className="p-4 lg:col-span-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Estratégia de ativação</p>
                  <div className="space-y-2 mb-4">
                    {inf.estrategia.map((s, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0 mt-0.5"
                          style={{ background: inf.color }}>{j + 1}</div>
                        <p className="text-[11px] text-text">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg p-3" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Como medir o resultado</p>
                    <p className="text-[11px] text-text">{inf.metricas}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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
    { key: 'ecosistema', label: '🌐 Ecossistema',    sub: '3 pilares' },
    { key: 'icp',        label: '🎯 ICP & Personas', sub: 'Quem queremos' },
    { key: 'canais',     label: '📡 Canais',          sub: 'Distribuição' },
    { key: 'conteudo',   label: '📱 Conteúdo',        sub: 'Dois perfis' },
    { key: 'midia',      label: '💸 Mídia Paga',      sub: 'Budget R$4k' },
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
          <p className="text-xs text-muted mt-0.5">Ecossistema · ICP · Canais · Conteúdo · Mídia Paga · 2026</p>
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
        {subTab === 'ecosistema' && <Ecossistema />}
        {subTab === 'icp'        && <IcpPersonas />}
        {subTab === 'canais'     && <Canais />}
        {subTab === 'conteudo'   && <Conteudo />}
        {subTab === 'midia'      && <MidiaPaga />}
      </motion.div>
    </div>
  )
}
