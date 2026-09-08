import { useState } from 'react'
import { motion } from 'framer-motion'

const AZUL    = '#60a5fa'
const VERDE   = '#6eda2c'
const LARANJA = '#ea8a29'
const ROXO    = '#a78bfa'

const PILARES = [
  { n: '1', icon: '🤝', titulo: 'Confiança na decisão',     cor: VERDE,   itens: ['Procedência garantida', 'Equipe preparada', 'Transparência no serviço'] },
  { n: '2', icon: '🕐', titulo: 'Presença 24h',              cor: AZUL,    itens: ['Disponibilidade real', 'Sempre quando o cliente precisa', 'Ponto de apoio do motorista'] },
  { n: '3', icon: '⚡', titulo: 'Simplicidade e agilidade',  cor: LARANJA, itens: ['Processo rápido', 'Soluciona a maioria dos hábitos diários', 'Resolve tudo em um lugar'] },
]

const NARRATIVAS = [
  { n: '1', icon: '🎯', titulo: 'Decisão',   chave: 'A decisão certa no abastecimento evita problema depois.',   apoio: ['Escolher combustível com confiança', 'Pensar no longo prazo', 'Evitar prejuízo no veículo'] },
  { n: '2', icon: '🛡️', titulo: 'Segurança', chave: 'Segurança não se improvisa. Se escolhe.',                   apoio: ['Procedência garantida', 'Processo correto', 'Orientação técnica'] },
  { n: '3', icon: '🔄', titulo: 'Rotina',    chave: 'Quem faz parte da rotina vira escolha natural.',            apoio: ['Presença 24h', 'Ponto de apoio constante', 'Parte da rotina do motorista'] },
  { n: '4', icon: '🛣️', titulo: 'Jornada',   chave: 'Cuidar do carro é continuidade, não decisão isolada.',      apoio: ['Abastecimento recorrente', 'Manutenção preventiva', 'Acompanhamento contínuo'] },
  { n: '5', icon: '✅', titulo: 'Simples',   chave: 'Resolver suas necessidades diárias é simples no Rizzotto.', apoio: ['Atendimento ágil', 'Processo rápido', 'Conveniência em um só lugar'] },
]

const PUBLICOS = [
  { icon: '🚗', cor: AZUL,    nome: 'Motorista do Dia a Dia',           desc: 'Pessoas que usam o carro na rotina e buscam praticidade e confiança.',
    itens: ['Abastece com frequência', 'Valoriza agilidade', 'Busca continuidade no combustível', 'Prefere praticidade a preço baixo'] },
  { icon: '🚚', cor: LARANJA, nome: 'Motorista Profissional',            desc: 'Uber, entregadores e quem vive do carro.',
    itens: ['Alta recorrência', 'Sensível a custo-benefício', 'Busca rendimento e durabilidade', 'Decide com base em economia real'] },
  { icon: '☕', cor: VERDE,   nome: 'Cliente de Conveniência / Rotina',  desc: 'Pessoas que usam o posto como ponto de apoio.',
    itens: ['Consome café da manhã', 'Usa o espaço como parada estratégica', 'Valoriza ambiente e atendimento', 'Pode não abastecer sempre', 'Frequenta em horários variados'] },
]

const INSTITUCIONAL = [
  { tema: 'Tema 1', icon: '🌅', cor: LARANJA, titulo: 'Seu dia começa aqui',
    objetivo: 'Atrair as pessoas no início do seu dia, independente do horário. A tese é que, atraindo no início da rotina da pessoa, ela volta.',
    desdobramentos: ['Manhã (café)', 'Tarde (abastecimento rápido)', 'Noite e madrugada (ponto de apoio)'],
    slogans: ['Comece bem. Comece no Rizzotto.', 'Seu primeiro compromisso do dia é no Rizzotto.'] },
  { tema: 'Tema 2', icon: '🏡', cor: VERDE, titulo: 'Nasceu aqui. Presente na sua rotina.',
    objetivo: 'Reforçar que o Rizzotto é da cidade e faz parte do dia a dia das pessoas.',
    desdobramentos: ['Mostrar a origem local da marca', 'Pessoas reais da cidade', 'Presença nos bairros e na rotina', 'Manhã, tarde e noite'],
    slogans: ['Quem é daqui, escolhe Rizzotto.', 'Rizzotto. Da nossa terra. Do seu dia a dia.', 'Rizzotto. Feito pra nossa gente.'] },
]

const COMERCIAIS = [
  { icon: '⛽', cor: AZUL,    grupo: 'Campanhas de Produto',                    sub: 'Regra 80/20', ideias: ['Tanque Cheio, Dia Redondo', 'Cuidar é Economizar', 'Manhã Inteligente'] },
  { icon: '🛒', cor: VERDE,   grupo: 'Campanhas de Mix',                        sub: 'Combustível + Conveniência', ideias: ['Abasteça e Aproveite', 'Passou, Resolveu', 'Comece no Rizzotto'] },
  { icon: '👥', cor: LARANJA, grupo: 'Campanhas por Público',                   sub: 'Uma para cada perfil', ideias: ['Para Quem Roda Todo Dia', 'Motorista Prevenido', 'Quem é Daqui, Escolhe Melhor'] },
]

const DATAS = [
  { data: '15 mar', nome: 'Dia do Consumidor', icon: '🛍️' },
  { data: 'Maio',   nome: 'Dia das Mães',      icon: '💐' },
  { data: 'Agosto', nome: 'Dia dos Pais',      icon: '👔' },
  { data: '15 set', nome: 'Dia do Cliente',    icon: '⭐' },
  { data: 'Nov',    nome: 'Black Friday',      icon: '🏷️' },
  { data: 'Dez',    nome: 'Natal',             icon: '🎄' },
]

function Card({ titulo, extra, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl ${className}`} style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      {titulo && (
        <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">{titulo}</p>
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}

function Hero({ color, titulo, sub, texto, destaque }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
      <div className="relative z-10 flex flex-wrap gap-6 items-center">
        {destaque && (
          <div className="flex flex-col items-center justify-center rounded-2xl px-6 py-4"
            style={{ background: color + '18', border: `1px solid ${color}35` }}>
            <span className="text-4xl font-black" style={{ color }}>{destaque.valor}</span>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>{destaque.label}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>{sub}</p>
          <p className="text-xl font-black text-white mt-1">{titulo}</p>
          {texto && <p className="text-[11.5px] mt-2 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{texto}</p>}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════ ESTRATÉGIA ═══════════ */
function Estrategia({ color }) {
  return (
    <div className="space-y-5">
      <Hero color={color} sub="Princípio geral de comunicação" titulo="A comunicação não nasce do combustível"
        destaque={{ valor: '3', label: 'pilares' }}
        texto="Ela nasce da responsabilidade da escolha diária, que envolve rotina, confiança, segurança, economia e conveniência. Toda peça deve reforçar pelo menos um dos pilares." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {PILARES.map((p, i) => (
          <motion.div key={p.n} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${p.cor}20` }}>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: p.cor + '15' }}>{p.icon}</span>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: p.cor }}>Pilar {p.n}</p>
                <p className="text-[13px] font-extrabold text-text leading-tight">{p.titulo}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {p.itens.map(t => (
                <p key={t} className="text-[11px] text-muted flex gap-2">
                  <span style={{ color: p.cor }}>•</span>{t}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <Card titulo="🗣️ Narrativas" extra={<span className="text-[10px] text-muted">cada peça carrega uma ideia-chave</span>}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 p-5">
          {NARRATIVAS.map((n, i) => (
            <motion.div key={n.n} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl p-4" style={{ background: '#f7f8fc' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{n.icon}</span>
                <p className="text-[12px] font-extrabold text-text">{n.titulo}</p>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ml-auto"
                  style={{ background: color + '20', color }}>{n.n}</span>
              </div>
              <p className="text-[11.5px] font-bold italic leading-snug mb-2" style={{ color }}>"{n.chave}"</p>
              <div className="space-y-1">
                {n.apoio.map(a => <p key={a} className="text-[10.5px] text-muted">• {a}</p>)}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card titulo="🎯 Público-alvo" extra={<span className="text-[10px] text-muted">3 perfis que orientam a comunicação</span>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-5">
          {PUBLICOS.map((p, i) => (
            <motion.div key={p.nome} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4" style={{ background: p.cor + '0d', border: `1px solid ${p.cor}30` }}>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
                  style={{ background: p.cor + '20' }}>{p.icon}</span>
                <p className="text-[12.5px] font-extrabold text-text leading-tight">{p.nome}</p>
              </div>
              <p className="text-[11px] text-muted mb-2.5 leading-snug">{p.desc}</p>
              <div className="space-y-1">
                {p.itens.map(t => (
                  <p key={t} className="text-[10.5px] text-muted flex gap-1.5"><span style={{ color: p.cor }}>•</span>{t}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ═══════════ CAMPANHAS ═══════════ */
function Campanhas({ color }) {
  return (
    <div className="space-y-5">
      <Hero color={color} sub="Ideias de campanhas" titulo="Institucional e comercial"
        destaque={{ valor: '2', label: 'temas de marca' }}
        texto="Os temas institucionais constroem a marca no longo prazo. As campanhas comerciais conectam oferta e estratégia." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {INSTITUCIONAL.map((c, i) => (
          <motion.div key={c.tema} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${c.cor}25` }}>
            <div className="px-5 py-4" style={{ background: c.cor + '0f', borderBottom: `1px solid ${c.cor}20` }}>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: c.cor }}>{c.tema} · Institucional</p>
                  <p className="text-[15px] font-black text-text leading-tight">"{c.titulo}"</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1">Objetivo</p>
                <p className="text-[11.5px] text-muted leading-relaxed">{c.objetivo}</p>
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Como desdobrar</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.desdobramentos.map(d => (
                    <span key={d} className="text-[10.5px] font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: c.cor + '15', color: c.cor }}>{d}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Slogans</p>
                <div className="space-y-1.5">
                  {c.slogans.map(s => (
                    <p key={s} className="text-[11.5px] font-bold rounded-lg px-3 py-2" style={{ background: '#f7f8fc', color: c.cor }}>
                      {s}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Card titulo="🛍️ Campanhas comerciais" extra={<span className="text-[10px] text-muted">conectam oferta e estratégia</span>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-5">
          {COMERCIAIS.map((c, i) => (
            <motion.div key={c.grupo} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4" style={{ background: c.cor + '0d', border: `1px solid ${c.cor}30` }}>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-lg">{c.icon}</span>
                <div>
                  <p className="text-[12px] font-extrabold text-text leading-tight">{c.grupo}</p>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider" style={{ color: c.cor }}>{c.sub}</p>
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                {c.ideias.map(t => (
                  <p key={t} className="text-[11px] font-bold text-text rounded-lg px-2.5 py-1.5" style={{ background: '#fff' }}>{t}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ═══════════ CALENDÁRIO E META ═══════════ */
function Calendario({ color }) {
  return (
    <div className="space-y-5">
      <Hero color={color} sub="Calendário e meta" titulo="Datas comerciais de 2026"
        destaque={{ valor: '6', label: 'datas' }}
        texto="As datas que orientam o planejamento de campanhas comerciais ao longo do ano." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card titulo="📅 Datas comerciais">
          <div className="p-2">
            {DATAS.map((d, i) => (
              <motion.div key={d.nome} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition hover:bg-slate-50">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: color + '12' }}>{d.icon}</span>
                <span className="text-[13px] font-extrabold text-text flex-1">{d.nome}</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ background: color + '15', color }}>{d.data}</span>
              </motion.div>
            ))}
          </div>
          <div className="mx-5 mb-5 rounded-xl p-3.5" style={{ background: LARANJA + '0f', border: `1px solid ${LARANJA}30` }}>
            <p className="text-[11px] text-muted leading-relaxed">
              <span className="mr-1">⚽</span>
              <strong className="text-text">Copa do Mundo — 11 de junho de 2026.</strong> Podemos pensar em alguma ação referente
              à Copa também, algo como "Esquenta jogo 6 no Posto Rizzotto".
            </p>
          </div>
        </Card>

        <Card titulo="🎯 Meta do ano">
          <div className="p-5">
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Seguidores no Instagram
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black" style={{ color }}>8.000</span>
                <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>de 10.000</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden mt-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
                  initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>80% da meta</span>
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>faltam 2.000</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl p-3.5 text-center" style={{ background: '#f7f8fc' }}>
                <p className="text-2xl font-black" style={{ color: VERDE }}>2.000</p>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-0.5">seguidores a ganhar</p>
              </div>
              <div className="rounded-xl p-3.5 text-center" style={{ background: '#f7f8fc' }}>
                <p className="text-2xl font-black" style={{ color: ROXO }}>10.000</p>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-0.5">meta até dezembro</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ═══════════ RAIZ ═══════════ */
export default function RizzottoPlanejamento({ color = AZUL }) {
  const [aba, setAba] = useState('estrategia')
  const abas = [
    { id: 'estrategia', label: '🧭 Estratégia' },
    { id: 'campanhas',  label: '📣 Campanhas' },
    { id: 'calendario', label: '📅 Calendário e Meta' },
  ]
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-extrabold text-text flex items-center gap-2 flex-wrap">
          Planejamento 2026
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: color + '15', color }}>Posto Rizzotto</span>
        </h2>
        <p className="text-xs text-muted mt-0.5">Pilares, narrativas, públicos, campanhas e calendário do ano</p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {abas.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className="text-xs font-bold px-3.5 py-2 rounded-xl transition"
            style={aba === a.id
              ? { background: color, color: '#fff', boxShadow: `0 2px 10px ${color}44` }
              : { background: color + '12', color }}>
            {a.label}
          </button>
        ))}
      </div>

      {aba === 'estrategia' && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><Estrategia color={color} /></motion.div>}
      {aba === 'campanhas'  && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><Campanhas  color={color} /></motion.div>}
      {aba === 'calendario' && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><Calendario color={color} /></motion.div>}
    </div>
  )
}
