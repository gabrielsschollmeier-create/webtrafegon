import { useState } from 'react'
import { motion } from 'framer-motion'

const COR = '#be29ec'

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      <p className="text-sm font-extrabold text-text mb-4">{title}</p>
      {children}
    </div>
  )
}

function Badge({ color, text }) {
  return (
    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ background: color + '20', color }}>{text}</span>
  )
}

/* ══════════════════════════════════════════
   ABA: PRINCÍPIO
══════════════════════════════════════════ */
function Principio() {
  const pilares = [
    { icon: '👨‍👩‍👧', label: 'Família',     desc: 'A obra é um projeto familiar — envolve quem vai viver ali' },
    { icon: '🏠',     label: 'Patrimônio', desc: 'Material de construção é investimento de longo prazo' },
    { icon: '⏱️',     label: 'Tempo',      desc: 'Agilidade e pontualidade como compromisso' },
    { icon: '⚠️',     label: 'Risco',      desc: 'Evitar erros, arrependimentos e retrabalho' },
    { icon: '⚡',     label: 'Agilidade',  desc: 'Processo claro e sem burocracia' },
  ]

  const eixos = [
    {
      titulo: 'Parceria de longo prazo',
      desc: 'Relação de confiança de família para família.',
      color: COR,
      icon: '🤝',
    },
    {
      titulo: 'Segurança na decisão',
      desc: 'Experiência, orientação técnica e mais de 23 anos de mercado.',
      color: '#60a5fa',
      icon: '🛡️',
    },
    {
      titulo: 'Simplicidade e eficiência',
      desc: 'Processo claro, rápido e sem dor de cabeça.',
      color: '#6eda2c',
      icon: '✅',
    },
  ]

  return (
    <div className="space-y-5">

      {/* Hero */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1055 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${COR}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: COR + 'aa' }}>
            Kamy · Princípio Geral da Comunicação
          </p>
          <p className="text-xl font-black text-white mb-1">
            "Nasce da responsabilidade da decisão"
          </p>
          <p className="text-sm text-white/50 max-w-lg">
            A comunicação da Kamy não trata do produto — retrata o peso e o cuidado por trás de cada escolha de quem está construindo.
          </p>
          <div className="mt-4 rounded-xl px-4 py-3 w-fit" style={{ background: COR + '15', border: `1px solid ${COR}30` }}>
            <p className="text-[11px] font-bold text-white/80">
              📌 Toda frase, tema ou conteúdo da Kamy deve reforçar <strong className="text-white">ao menos um</strong> dos 5 pilares abaixo.
            </p>
          </div>
        </div>
      </div>

      {/* 5 pilares */}
      <Section title="🧱 Os 5 Pilares da Comunicação">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {pilares.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl p-3 text-center"
              style={{ background: COR + '08', border: `1px solid ${COR}20` }}>
              <div className="text-2xl mb-1.5">{p.icon}</div>
              <p className="text-xs font-extrabold text-text mb-1">{p.label}</p>
              <p className="text-[10px] text-muted leading-snug">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 3 eixos estratégicos */}
      <Section title="⚡ Eixos Estratégicos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eixos.map((e, i) => (
            <div key={i} className="rounded-xl p-4"
              style={{ background: e.color + '08', border: `1px solid ${e.color}25` }}>
              <div className="text-2xl mb-2">{e.icon}</div>
              <p className="text-sm font-extrabold text-text mb-1">{e.titulo}</p>
              <p className="text-[11px] text-muted">{e.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: NARRATIVA
══════════════════════════════════════════ */
function Narrativa() {
  const arcos = [
    {
      n: 1,
      titulo: 'Decida',
      subtitulo: 'A Kamy existe para guiar o cliente a escolher bem.',
      color: COR,
      ideia: 'Segurança não se improvisa. Se planeja.',
      pontos: [
        'Escolhas eficientes desde o primeiro produto',
        'Fazer certo desde o início para não pagar duas vezes',
        'Evitar arrependimento com orientação técnica',
      ],
    },
    {
      n: 2,
      titulo: 'Segurança',
      subtitulo: 'Deixar certo no início evita problema no final.',
      color: '#60a5fa',
      ideia: 'Segurança não se improvisa. Se planeja.',
      pontos: [
        'Base forte começa no material certo',
        'Orientação técnica inclusa no atendimento',
        '23+ anos de mercado como prova de confiança',
      ],
    },
    {
      n: 3,
      titulo: 'Família',
      subtitulo: 'Toda obra é um projeto de vida.',
      color: '#f472b6',
      ideia: 'Para quem decide melhor, a obra é sobre quem vai viver ali.',
      pontos: [
        'Tranquilidade durante todo o processo',
        'Proteção de quem está pagando a conta',
        'Pensar em quem vai ocupar o espaço',
      ],
    },
    {
      n: 4,
      titulo: 'Jornada',
      subtitulo: 'A obra não acontece em um dia.',
      color: '#f59e0b',
      ideia: 'A Kamy tem continuidade, não decisões isoladas.',
      pontos: [
        'Acompanhamento do início ao fim da obra',
        'Suporte em cada fase do processo',
        'Relacionamento que vai além da venda',
      ],
    },
    {
      n: 5,
      titulo: 'Parceria',
      subtitulo: 'A Kamy não vende e desaparece.',
      color: '#6eda2c',
      ideia: 'Somos a rede de apoio da obra.',
      pontos: [
        'Caminham junto em cada decisão',
        'Apoia quando surgem imprevistos',
        'Presença ativa, não pontual',
      ],
    },
    {
      n: 6,
      titulo: 'Simples',
      subtitulo: 'A Kamy conhece o caminho e facilita para o cliente.',
      color: '#34d399',
      ideia: 'Construir não precisa ser complicado.',
      pontos: [
        'Orientação direta e sem jargão técnico',
        'Processo de pagamento e logística descomplicados',
        'Atendimento técnico acessível',
      ],
    },
  ]

  const [ativo, setAtivo] = useState(1)
  const arco = arcos.find(a => a.n === ativo)

  return (
    <div className="space-y-5">

      {/* Seletor visual */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {arcos.map(a => (
          <motion.div key={a.n} whileHover={{ y: -2 }}
            onClick={() => setAtivo(a.n)}
            className="rounded-xl p-3 cursor-pointer text-center transition-all"
            style={{
              background: ativo === a.n ? a.color + '15' : 'white',
              border: `2px solid ${ativo === a.n ? a.color : '#e2e5f0'}`,
              boxShadow: ativo === a.n ? `0 4px 16px ${a.color}25` : '0 1px 4px rgba(26,29,46,0.06)',
            }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white mx-auto mb-1.5"
              style={{ background: a.color }}>{a.n}</div>
            <p className="text-[11px] font-extrabold" style={{ color: ativo === a.n ? a.color : '#1a1d2e' }}>{a.titulo}</p>
          </motion.div>
        ))}
      </div>

      {/* Detalhe do arco */}
      <motion.div key={ativo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${arco.color}25` }}>
          <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${arco.color}12, ${arco.color}06)`, borderBottom: `1px solid ${arco.color}18` }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
                style={{ background: arco.color }}>{arco.n}</div>
              <p className="text-lg font-extrabold text-text">{arco.titulo}</p>
            </div>
            <p className="text-sm text-muted">{arco.subtitulo}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-5" style={{ borderRight: '1px solid #f1f3f9' }}>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-3">Pontos-chave</p>
              <div className="space-y-2.5">
                {arco.pontos.map((p, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0" style={{ color: arco.color }}>→</span>
                    <p className="text-[11px] text-text">{p}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-3">Ideia-chave</p>
              <div className="rounded-xl p-4 h-full flex items-center" style={{ background: arco.color + '08', border: `1px solid ${arco.color}20` }}>
                <p className="text-base font-extrabold italic text-text">"{arco.ideia}"</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Visão compacta de todos */}
      <Section title="📋 Visão Geral da Narrativa">
        <div className="space-y-0">
          {arcos.map((a, i) => (
            <div key={a.n} className="flex items-start gap-4 py-3 cursor-pointer hover:bg-gray-50 rounded-xl px-2 transition-colors"
              style={{ borderBottom: i < arcos.length - 1 ? '1px solid #f1f3f9' : 'none' }}
              onClick={() => setAtivo(a.n)}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0 mt-0.5"
                style={{ background: a.color }}>{a.n}</div>
              <div className="flex-1">
                <p className="text-xs font-extrabold text-text">{a.titulo}</p>
                <p className="text-[10px] text-muted">{a.subtitulo}</p>
              </div>
              <p className="text-[10px] italic text-muted max-w-[200px] text-right hidden sm:block">"{a.ideia}"</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: CAMPANHAS
══════════════════════════════════════════ */
function Campanhas() {
  const datas = [
    { data: '24 anos Kamy',    quando: 'Set',      icon: '🎂', color: COR },
    { data: 'Dia do Cliente',  quando: '13 Set',   icon: '🤝', color: '#60a5fa' },
    { data: 'Black Friday',    quando: '27 Nov',   icon: '🛒', color: '#1a1a1a' },
    { data: 'Dia do Arquiteto', quando: '15 Dez',  icon: '📐', color: '#f59e0b' },
    { data: 'Páscoa / Natal / Ano Novo', quando: 'Sazonal', icon: '🎉', color: '#6eda2c' },
  ]

  return (
    <div className="space-y-5">

      {/* Campanhas Institucionais */}
      <Section title="🏛️ Campanhas Institucionais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COR}25` }}>
            <div className="px-4 py-3" style={{ background: COR + '10', borderBottom: `1px solid ${COR}18` }}>
              <p className="text-xs font-extrabold text-text">Tema 1 — Início de Obra</p>
              <p className="text-[10px] text-muted mt-0.5">A decisão mais importante é a primeira</p>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Mensagens centrais</p>
                {[
                  'A decisão mais importante da obra é a primeira',
                  'Uma boa compra evita problema — não apenas o improviso',
                ].map((m, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <span className="text-[10px] font-extrabold" style={{ color: COR }}>{i + 1}.</span>
                    <p className="text-[11px] text-text">{m}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Subtemas</p>
                {['Erros comuns no início da obra', 'Perigos do improviso', 'Como economizar sem abrir mão da qualidade', 'Benefícios da obra completa com a Kamy'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 py-1" style={{ borderBottom: '1px solid #f7f8fc' }}>
                    <span className="text-[10px]" style={{ color: COR }}>•</span>
                    <p className="text-[11px] text-text">{s}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Exemplos de chamadas</p>
                {['"Já fizemos clientes que começaram certos — e não pararam"', '"O custo de uma compra errada aparece no final da obra"'].map((c, i) => (
                  <div key={i} className="rounded-lg px-3 py-2 mt-1.5" style={{ background: COR + '08' }}>
                    <p className="text-[11px] italic text-text">{c}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #60a5fa25' }}>
            <div className="px-4 py-3" style={{ background: '#60a5fa10', borderBottom: '1px solid #60a5fa18' }}>
              <p className="text-xs font-extrabold text-text">Tema 2 — Jornada Completa</p>
              <p className="text-[10px] text-muted mt-0.5">Mais de 23 anos construindo junto</p>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Mensagens centrais</p>
                {[
                  'Não é só uma questão de qualidade — é confiança',
                  'Mais de 23 anos construindo obras e não paramos',
                ].map((m, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <span className="text-[10px] font-extrabold" style={{ color: '#60a5fa' }}>{i + 1}.</span>
                    <p className="text-[11px] text-text">{m}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Subtemas</p>
                {['Acompanhamento contínuo', 'Parceria ativa durante a obra', 'Menos dor de cabeça, mais segurança', 'Urgência e segurança andam juntos'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 py-1" style={{ borderBottom: '1px solid #f7f8fc' }}>
                    <span className="text-[10px]" style={{ color: '#60a5fa' }}>•</span>
                    <p className="text-[11px] text-text">{s}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Exemplos de chamadas</p>
                {['"Conheça quem conhece o caminho — confiança e resultado"', '"Mais do que fornecer. Um parceiro de obra"'].map((c, i) => (
                  <div key={i} className="rounded-lg px-3 py-2 mt-1.5" style={{ background: '#60a5fa08' }}>
                    <p className="text-[11px] italic text-text">{c}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Campanhas Comerciais */}
      <Section title="💰 Campanhas Comerciais">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              titulo: '1. Frases de Emoção',
              sub: 'Produto em destaque',
              color: COR,
              frases: [
                '"A obra certa faz toda a diferença"',
                '"Nossa missão começa aqui"',
                '"O material certo muda o resultado"',
              ],
            },
            {
              titulo: '2. Frases de Mês',
              sub: 'Ativações mensais',
              color: '#f59e0b',
              frases: [
                '"Custo certo para o produto certo"',
                '"Sua obra não é uma fase — são fases"',
                '"Planejar também é economizar"',
              ],
            },
            {
              titulo: '3. Frases de Decisão',
              sub: 'Facilitadores de compra',
              color: '#6eda2c',
              frases: [
                '"Facilitamos para quem não quer complicar"',
                '"Somos ágeis nos detalhes que importam"',
                '"Planejar também é economizar"',
              ],
            },
          ].map((g, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: g.color + '08', border: `1px solid ${g.color}20` }}>
              <p className="text-xs font-extrabold text-text mb-0.5">{g.titulo}</p>
              <p className="text-[10px] text-muted mb-3">{g.sub}</p>
              {g.frases.map((f, j) => (
                <div key={j} className="rounded-lg px-3 py-2 mt-2" style={{ background: 'white', border: `1px solid ${g.color}18` }}>
                  <p className="text-[11px] italic text-text">{f}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Datas comerciais */}
      <Section title="📅 Datas Comerciais">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {datas.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl p-3 text-center"
              style={{ background: d.color + '08', border: `1px solid ${d.color}25` }}>
              <div className="text-2xl mb-1.5">{d.icon}</div>
              <p className="text-[10px] font-extrabold text-text leading-tight">{d.data}</p>
              <p className="text-[9px] font-bold mt-1" style={{ color: d.color }}>{d.quando}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: PÚBLICO-ALVO
══════════════════════════════════════════ */
function Publico() {
  const publicos = [
    {
      n: 1,
      titulo: 'Dono de Obra — Residencial',
      icon: '🏠',
      color: COR,
      perfil: 'Pessoa que está construindo ou reformando e não quer errar. Sente o peso financeiro e emocional da decisão — é a obra da vida, não um projeto qualquer.',
      caracteristicas: [
        'Deseja segurança — família e patrimônio em jogo',
        'Valoriza orientação clara e relação de confiança',
        'Valoriza entrega no prazo sem supresas',
        'Processo de decisão emocional — compra com o coração',
      ],
      dores: [
        'Medo de comprar errado e perder dinheiro',
        'Não sabe distinguir qualidade de preço baixo',
        'Insegurança sobre quantidade e especificação do material',
        'Experiências ruins com fornecedores anteriores',
      ],
      como_falar: 'Com empatia e segurança. Mostrar que a Kamy guia, não apenas vende. Cases de família, resultados reais, transparência.',
    },
    {
      n: 2,
      titulo: 'Profissional de Obra e Arquitetos',
      icon: '📐',
      color: '#60a5fa',
      perfil: 'Profissional que compra em volume e frequência. Prioriza agilidade, prazo e disponibilidade de estoque. Relacionamento é fator decisivo — não troca fornecedor à toa.',
      caracteristicas: [
        'Agilidade e entrega no prazo acima de tudo',
        'Quer todo o material necessário em um só lugar',
        'Pensa em frequência de compra, não em compra única',
        'Busca parceiro de longo prazo, não fornecedor spot',
      ],
      dores: [
        'Atraso de fornecedor compromete a obra do cliente',
        'Falta de material no meio da obra',
        'Atendimento lento e sem comprometimento',
        'Falta de suporte técnico para especificações',
      ],
      como_falar: 'Com agilidade e objetividade. Mostrar disponibilidade de estoque, prazo garantido e suporte técnico. Linguagem profissional.',
    },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {publicos.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${p.color}25` }}>

            <div className="px-5 py-4 flex items-center gap-4" style={{ background: p.color + '08', borderBottom: `1px solid ${p.color}18` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: p.color + '18' }}>{p.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: p.color + '20', color: p.color }}>Público {p.n}</span>
                </div>
                <p className="text-sm font-extrabold text-text mt-0.5">{p.titulo}</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-xl p-3" style={{ background: p.color + '06', border: `1px solid ${p.color}15` }}>
                <p className="text-[11px] text-text">{p.perfil}</p>
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Características</p>
                {p.caracteristicas.map((c, j) => (
                  <div key={j} className="flex items-start gap-2 py-1.5" style={{ borderBottom: '1px solid #f7f8fc' }}>
                    <span className="text-xs text-green-500 flex-shrink-0">✓</span>
                    <p className="text-[11px] text-text">{c}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Dores principais</p>
                {p.dores.map((d, j) => (
                  <div key={j} className="flex items-start gap-2 py-1.5" style={{ borderBottom: '1px solid #f7f8fc' }}>
                    <span className="text-xs text-red-400 flex-shrink-0">⚠</span>
                    <p className="text-[11px] text-text">{d}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1">Como falar com esse público</p>
                <p className="text-[11px] text-text">{p.como_falar}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════ */
export default function KamyEstrategia({ color = COR }) {
  const [categoria, setCategoria] = useState('marketing')
  const [subTab, setSubTab] = useState('principio')

  const cats = [
    { key: 'marketing', label: '📣 Marketing', sub: 'Comunicação e mídia' },
    { key: 'pessoas',   label: '👤 Pessoas',   sub: 'Time e cultura' },
  ]
  const tabs = [
    { key: 'principio', label: '🧱 Princípio',   sub: 'Comunicação' },
    { key: 'narrativa', label: '📖 Narrativa',    sub: '6 arcos' },
    { key: 'campanhas', label: '📢 Campanhas',    sub: 'Ideas e datas' },
    { key: 'publico',   label: '👥 Público',      sub: 'Quem compra' },
  ]

  return (
    <div className="space-y-4">
      {/* Cabeçalho + seletor de categoria */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            🧠 Estratégia
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>Kamy Material de Construção</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Marketing · Pessoas</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl p-1 bg-white flex-wrap"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
          {cats.map(c => (
            <button key={c.key} onClick={() => setCategoria(c.key)}
              className="flex flex-col items-start px-4 py-2 rounded-xl text-left transition-all"
              style={categoria === c.key ? { background: color + '18', color } : { color: '#8890b5' }}>
              <span className="text-xs font-extrabold">{c.label}</span>
              <span className="text-[10px] opacity-60">{c.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MARKETING — tudo que já existe */}
      {categoria === 'marketing' && (
        <motion.div key="cat-marketing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-1 rounded-2xl p-1 bg-white flex-wrap"
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
          <motion.div key={subTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {subTab === 'principio' && <Principio />}
            {subTab === 'narrativa' && <Narrativa />}
            {subTab === 'campanhas' && <Campanhas />}
            {subTab === 'publico'   && <Publico />}
          </motion.div>
        </motion.div>
      )}

      {/* PESSOAS — a construir */}
      {categoria === 'pessoas' && (
        <motion.div key="cat-pessoas" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center text-center gap-3"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: color + '15' }}>👤</div>
            <div>
              <p className="text-base font-extrabold text-text">Pessoas</p>
              <p className="text-sm text-muted mt-1 max-w-md mx-auto">
                Categoria em construção. Aqui vamos estruturar o lado de <b className="text-text-2">gente da KAMY</b> —
                time, papéis, cultura, contratações e desenvolvimento.
              </p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full mt-1"
              style={{ background: color + '15', color }}>Em breve</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
