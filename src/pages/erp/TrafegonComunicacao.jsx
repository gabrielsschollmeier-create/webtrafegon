import { useState } from 'react'
import { motion } from 'framer-motion'

const COR = '#a78bfa'

const CANAIS = [
  { nome: '@trafegonparadvogados', papel: 'Gerar leads de advogados para o Destrava Digital', freq: '4 Reels + 1 carrossel/semana', prioridade: 'Alta', color: '#a78bfa', icon: '⚖️' },
  { nome: '@trafegon',             papel: 'Construir a marca da agência',                     freq: '3 Reels/semana',               prioridade: 'Alta', color: '#6eda2c', icon: '🏢' },
  { nome: '@gabriel (pessoal)',    papel: 'Autoridade do fundador — abre contas maiores',      freq: '1–2 posts/semana',             prioridade: 'Secundária', color: '#60a5fa', icon: '👤' },
  { nome: 'Google Meu Negócio',   papel: 'Presença local — ser encontrado na região',         freq: '1 post/mês',                   prioridade: 'Manutenção', color: '#ea8a29', icon: '📍' },
]

const SEMANAS = [
  {
    titulo: 'Semana 1 — Fazer o algoritmo entender o perfil',
    tema: 'Fazer o advogado se identificar com o problema',
    posts: [
      { num: 1,  formato: 'Narrado',           cor: '#6eda2c', gancho: 'O maior erro que advogados cometem ao tentar captar clientes online' },
      { num: 2,  formato: 'Comparativo',        cor: '#f59e0b', gancho: 'Dois escritórios. Mesmo valor investido. Resultado completamente diferente.' },
      { num: 3,  formato: 'Carrossel — Lista',  cor: '#60a5fa', gancho: '5 motivos por que tráfego pago não funciona para advogados (e como corrigir)' },
      { num: 4,  formato: 'Trend com Texto',    cor: '#be29ec', gancho: 'A indicação não é estratégia. É sorte.' },
    ],
    stories: 'Bastidor da agência — equipe, tela do Ads, reunião.',
    acao: 'Identificar 5 advogados com perfil ativo e engajar genuinamente nos posts deles com comentários relevantes.',
  },
  {
    titulo: 'Semana 2 — Mostrar autoridade com dados reais',
    tema: 'Existe método. A TráfegOn domina isso.',
    posts: [
      { num: 5,  formato: 'Tela Dividida',      cor: '#ea8a29', gancho: 'Esse escritório tinha R$40 de CPL. Hoje paga R$12. O que mudou.' },
      { num: 6,  formato: 'React',              cor: '#ef4444', gancho: 'Por que advogado de família converte melhor no Google do que no Instagram' },
      { num: 7,  formato: 'Carrossel — Lista',  cor: '#60a5fa', gancho: 'O que a OAB permite (e o que proíbe) no marketing jurídico' },
      { num: 8,  formato: 'Comparativo',        cor: '#f59e0b', gancho: 'Você não tem problema de tráfego. Tem problema de atendimento.' },
    ],
    stories: 'Enquete — "Você já investiu em tráfego pago para seu escritório?" + Repost dos Reels da semana.',
    acao: 'Continuar engajando nos 5 perfis de advogados identificados na semana 1.',
  },
  {
    titulo: 'Semana 3 — Aprofundar e criar razão para seguir',
    tema: 'Aprofundar e polarizar',
    posts: [
      { num: 9,  formato: 'Conversa',                   cor: '#4ade80', gancho: 'Quanto um advogado precisa investir em tráfego para ter resultado?' },
      { num: 10, formato: 'Carrossel — Passo a passo',  cor: '#60a5fa', gancho: 'O que acontece nos primeiros 30 dias de campanha jurídica (semana a semana)' },
      { num: 11, formato: 'Comparativo',                cor: '#f59e0b', gancho: 'Advogado que anuncia no chute vs. advogado com estrutura' },
      { num: 12, formato: 'Tela Dividida',              cor: '#ea8a29', gancho: 'Bastidor: print de campanha, CPL, lead chegando' },
    ],
    stories: 'Caixa de perguntas — "Manda sua dúvida sobre marketing para advogados".',
    acao: 'Usar as respostas da caixa como pauta dos próximos Reels.',
  },
  {
    titulo: 'Semana 4 — Provar e converter',
    tema: 'Provar resultado e converter',
    posts: [
      { num: 13, formato: 'Novelinha',                  cor: '#f472b6', gancho: 'Cliente que quase desistiu — o que virou' },
      { num: 14, formato: 'Carrossel — Passo a passo',  cor: '#60a5fa', gancho: 'Como funciona o Destrava Digital — do dia 1 ao resultado' },
      { num: 15, formato: 'Narrado',                    cor: '#6eda2c', gancho: 'Por que abrimos uma empresa focada só em advogado' },
      { num: 16, formato: 'React',                      cor: '#ef4444', gancho: 'Dado do mercado jurídico + opinião direta da TráfegOn' },
      { num: 17, formato: 'Tela Dividida',              cor: '#ea8a29', gancho: 'Collab post com advogado parceiro' },
    ],
    stories: 'CTA direto — "Quer saber como funciona? Responde aqui com \'quero\'".',
    acao: 'Analisar os dados do mês: qual formato performou melhor? Qual post teve mais shares?',
  },
]

const HASHTAGS_FIXAS = ['#marketingjuridico', '#marketingparaadvogados', '#advogado', '#advocacia', '#escritoriodeadvocacia']
const HASHTAGS_ROTATIVAS = [
  { tema: 'Tráfego pago',        tags: ['#trafegopago', '#googleads', '#metaads', '#gestaodetrafego', '#anunciosonline'] },
  { tema: 'Captação e resultado', tags: ['#captacaodeclientes', '#geracaodeleads', '#clientesparaadvogados', '#crescimentodigital', '#resultados'] },
  { tema: 'Negócios e estratégia', tags: ['#negociosjuridicos', '#direitodigital', '#empreendedorismojuridico', '#gestaoparaadvogados', '#advocaciadigital'] },
  { tema: 'Regional e agência',   tags: ['#agenciademarketing', '#santacatarina', '#suldesantacatarina', '#criciuma', '#trafegon'] },
]

const REGRAS = [
  'Texto na tela nos primeiros 1,5 segundos — antes do áudio fazer sentido',
  'Responder 100% dos comentários em até 2 horas após publicar',
  'Takes máximo 5 segundos',
  'Legenda sempre — funciona sem som',
  'CTA contextualizado — nunca "segue para mais"',
  'Nunca conteúdo genérico — se qualquer agência poderia postar, não posta',
  'Consistência de tema — sempre marketing para advogado, sem desvio',
  'Sem hashtags como estratégia de alcance — são etiquetas de categorização',
]

const METRICAS = [
  { nome: 'Shares via DM',              desc: 'Sinal mais pesado do algoritmo — prioridade',  meta: 'Crescer semana a semana' },
  { nome: 'Taxa de conclusão dos Reels', desc: 'Se o conteúdo prende',                         meta: 'Acima de 40%' },
  { nome: 'Saves nos carrosséis',        desc: 'Conteúdo de valor percebido',                  meta: '3% do alcance' },
  { nome: 'Seguidores novos por formato', desc: 'O que está convertendo',                      meta: 'Mapear por semana' },
  { nome: 'Comentários genuínos',        desc: 'Engajamento real — responder todos',           meta: 'Resposta em até 2h' },
]

const METAS = [
  { fase: 'Mês 1',     foco: 'Hábito',            meta: 'Publicar 17 Reels + 4 carrosséis sem falhar. Só isso.', destaque: true },
  { fase: 'Meses 2–3', foco: 'Aprendizado',        meta: '1–2 contatos espontâneos vindos do digital', destaque: false },
  { fase: 'Meses 4–6', foco: 'Primeiro resultado', meta: '1–2 leads/mês via digital', destaque: false },
  { fase: 'Ano 1',     foco: 'Posicionamento',     meta: 'R$ 80–100k/mês, reconhecimento no nicho jurídico', destaque: false },
]

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      <p className="text-sm font-extrabold text-text mb-4">{title}</p>
      {children}
    </div>
  )
}

function DirecionalView() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${COR}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: COR + 'aa' }}>Posicionamento Central</p>
          <h2 className="text-xl font-black text-white mb-4">"Empresa jovem, séria, com sangue no olho para entregar resultado."</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: COR + 'bb' }}>Para advogados</p>
              <p className="text-sm text-white/80">"Clientes novos todo mês. Sem depender de indicação."</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#6eda2cbb' }}>Para empresas</p>
              <p className="text-sm text-white/80">"Do tráfego ao processo comercial. Resultado mensurável."</p>
            </div>
          </div>
        </div>
      </div>

      <Section title="📡 Canais e Frequência">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CANAIS.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl p-4" style={{ background: c.color + '08', border: `1px solid ${c.color}25` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: c.color + '18' }}>{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-text truncate">{c.nome}</p>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                    style={{ background: c.color + '20', color: c.color }}>{c.prioridade}</span>
                </div>
              </div>
              <p className="text-[11px] text-muted mb-2">{c.papel}</p>
              <div className="rounded-lg px-3 py-1.5" style={{ background: c.color + '0a' }}>
                <p className="text-[10px] font-bold" style={{ color: c.color }}>📅 {c.freq}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 rounded-xl p-3" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
          <p className="text-[11px] text-muted">LinkedIn existe mas não é prioridade agora. Entra quando os canais acima estiverem rodando.</p>
        </div>
      </Section>

      <Section title="⚙️ Setup — antes de postar">
        {[
          { icon: '🔑', text: 'Bio com keyword exata: "marketing digital para advogados" (Instagram indexa por SEO agora)' },
          { icon: '📌', text: 'Destaques organizados: Resultados / Como funciona / Sobre a TráfegOn' },
          { icon: '📸', text: 'Foto de perfil profissional' },
        ].map((item, i, arr) => (
          <div key={i} className="flex items-start gap-3 py-2.5"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid #f1f3f9' : 'none' }}>
            <span className="text-base flex-shrink-0">{item.icon}</span>
            <p className="text-[11px] text-text">{item.text}</p>
          </div>
        ))}
      </Section>

      <Section title="⚡ Regras — não negociáveis">
        <div className="space-y-2">
          {REGRAS.map((r, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl px-3 py-2.5"
              style={{ background: COR + '06', border: `1px solid ${COR}15` }}>
              <span className="text-xs font-extrabold flex-shrink-0 mt-0.5" style={{ color: COR }}>{i + 1}</span>
              <p className="text-[11px] text-text">{r}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="📅 Rotina Semanal">
        <div className="space-y-0 mb-4">
          {[
            { dia: 'Segunda',      acao: 'Gabriel passa 2 ideias (áudio, print, texto — qualquer formato) + reunião de 15 min' },
            { dia: 'Terça/Quarta', acao: 'Social media produz os Reels da semana' },
            { dia: 'Quinta',       acao: 'Gabriel aprova em 15 min' },
            { dia: 'Sexta',        acao: 'Tudo agendado para a semana seguinte' },
          ].map((item, i, arr) => (
            <div key={i} className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #f1f3f9' : 'none' }}>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex-shrink-0 w-24 text-center"
                style={{ background: COR + '15', color: COR }}>{item.dia}</span>
              <p className="text-[11px] text-text">{item.acao}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3" style={{ background: '#6eda2c08', border: '1px solid #6eda2c25' }}>
          <p className="text-[10px] font-extrabold" style={{ color: '#6eda2c' }}>O que o Gabriel entrega por semana</p>
          <p className="text-[11px] text-text mt-1">2 ideias + 15 min de aprovação + 15 min de reunião. Nada além disso.</p>
        </div>
      </Section>
    </div>
  )
}

function CalendarioView() {
  const [semanaAtiva, setSemanaAtiva] = useState(0)
  const semana = SEMANAS[semanaAtiva]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 bg-white rounded-xl p-1 w-fit"
        style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
        {SEMANAS.map((s, i) => (
          <button key={i} onClick={() => setSemanaAtiva(i)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={semanaAtiva === i ? { background: COR + '18', color: COR } : { color: '#8890b5' }}>
            Sem {i + 1}
          </button>
        ))}
      </div>

      <motion.div key={semanaAtiva} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: COR + '08', border: `1px solid ${COR}25` }}>
          <p className="text-sm font-extrabold text-text">{semana.titulo}</p>
          <p className="text-[11px] text-muted mt-0.5">{semana.tema}</p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden mb-4"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f3f9' }}>
            <p className="text-xs font-extrabold text-text">{semana.posts.length} posts</p>
            <p className="text-[10px] text-muted">Formato + gancho</p>
          </div>
          <div className="divide-y divide-gray-50">
            {semana.posts.map((post, i) => (
              <div key={i} className="flex items-start gap-4 px-4 py-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 text-white"
                  style={{ background: COR }}>
                  {String(post.num).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                      style={{ background: post.cor + '18', color: post.cor }}>{post.formato}</span>
                  </div>
                  <p className="text-[11px] text-text leading-relaxed">{post.gancho}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">📱 Stories</p>
            <p className="text-[11px] text-text">{semana.stories}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: COR + '06', border: `1px solid ${COR}20` }}>
            <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2" style={{ color: COR }}>⚡ Ação da semana</p>
            <p className="text-[11px] text-text">{semana.acao}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ExecucaoView() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4"># Hashtags</p>
        <div className="mb-5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Fixas — em todo post</p>
          <div className="flex flex-wrap gap-2">
            {HASHTAGS_FIXAS.map((tag, i) => (
              <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: COR + '15', color: COR }}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Rotativas por tema — 5 a 7 por post</p>
          {HASHTAGS_ROTATIVAS.map((grupo, i) => (
            <div key={i}>
              <p className="text-[10px] font-bold text-text mb-1.5">{grupo.tema}</p>
              <div className="flex flex-wrap gap-1.5">
                {grupo.tags.map((tag, j) => (
                  <span key={j} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: '#f7f8fc', border: '1px solid #edf0f7', color: '#4a5068' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl p-3" style={{ background: '#ea8a2908', border: '1px solid #ea8a2925' }}>
          <p className="text-[11px]" style={{ color: '#ea8a29' }}>
            <strong>Combinação por post:</strong> 5 fixas + 5–7 rotativas = 10–12. Variar combinações semanalmente — repetição sinaliza spam.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">📊 Métricas — acompanhar toda semana</p>
        <div className="space-y-0">
          {METRICAS.map((m, i, arr) => (
            <div key={i} className="flex items-start gap-3 py-3"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #f1f3f9' : 'none' }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-text">{m.nome}</p>
                <p className="text-[11px] text-muted">{m.desc}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 text-right"
                style={{ background: COR + '15', color: COR }}>{m.meta}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🎯 Metas por fase</p>
        <div className="space-y-2">
          {METAS.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex items-start gap-4 rounded-xl p-3"
              style={{
                background: m.destaque ? '#6eda2c08' : '#f7f8fc',
                border: m.destaque ? '1px solid #6eda2c25' : '1px solid #edf0f7',
              }}>
              <div className="flex-shrink-0 w-20">
                <p className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: COR }}>{m.fase}</p>
                <p className="text-[10px] font-bold text-text">{m.foco}</p>
              </div>
              <p className="text-[11px] text-muted flex-1">{m.meta}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 rounded-xl p-3" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
          <p className="text-[11px] text-muted italic">O que não cobrar no mês 1: vendas. Digital em B2B é ciclo longo — o mês 1 planta, o mês 4 colhe.</p>
        </div>
      </div>
    </div>
  )
}

export default function TrafegonComunicacao({ color = COR }) {
  const [subTab, setSubTab] = useState('direcional')

  const tabs = [
    { key: 'direcional', label: '📋 Direcional', sub: 'Canais e regras' },
    { key: 'calendario', label: '📅 30 Dias',    sub: 'Conteúdo planejado' },
    { key: 'execucao',   label: '⚡ Execução',   sub: 'Hashtags e métricas' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            📱 Comunicação & Conteúdo
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>@trafegonparadvogados</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Direcional · 30 dias · Hashtags · Métricas · 2026</p>
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
        {subTab === 'direcional' && <DirecionalView />}
        {subTab === 'calendario' && <CalendarioView />}
        {subTab === 'execucao'   && <ExecucaoView />}
      </motion.div>
    </div>
  )
}
